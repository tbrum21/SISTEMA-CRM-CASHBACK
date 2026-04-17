import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { formatPhone } from '../utils/phone.util';

export class POSController {

  /**
   * Busca cliente pelo telefone. Retorna dados existentes ou 404.
   * GET /api/pos/:tenantSlug/customer?phone=5511999999999
   */
  static async lookupCustomer(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const { query, phone } = req.query;
      const searchTerm = String(query || phone || '');
      if (!searchTerm) return res.status(400).json({ error: 'Termo de busca é obrigatório.' });

      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });

      const cleanDigits = searchTerm.replace(/\D/g, '');
      const possiblePhone = formatPhone(cleanDigits);

      const customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { phone: possiblePhone },
            { phone: cleanDigits },
            ...(cleanDigits.length >= 11 ? [{ cpf: cleanDigits }] : []),
            { name: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        include: {
          profiles: {
            where: { tenantId: tenant.id },
            select: { balance: true, lifetimeValue: true, totalTransactions: true, rfmSegment: true }
          }
        }
      });

      if (!customer) return res.status(404).json({ found: false });

      return res.json({
        found: true,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          cpf: customer.cpf,
          profile: customer.profiles[0] || null
        }
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Retorna as regras ativas do tenant para checagem de minPurchase no frontend.
   * GET /api/pos/:tenantSlug/rules
   */
  static async getActiveRules(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });

      const rules = await prisma.rewardRule.findMany({
        where: { tenantId: tenant.id, isActive: true },
        select: { id: true, name: true, type: true, value: true, minPurchase: true, dayOfWeek: true }
      });
      return res.json(rules);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Registra a compra do cliente (cria customer se necessário) e retorna pontos ganhos + saldo.
   * POST /api/pos/:tenantSlug/purchase
   * Body: { phone, name?, cpf?, purchaseAmount }
   */
  static async registerPurchase(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const { phone, name, cpf, purchaseAmount } = req.body;

      if (!phone || !purchaseAmount) {
        return res.status(400).json({ error: 'Telefone e valor da compra são obrigatórios.' });
      }

      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });

      let cleanPhone = formatPhone(String(phone));
      const rawDigits = String(phone).replace(/\D/g, '');
      const cleanCpf = cpf ? cpf.replace(/\D/g, '') : null;
      const amount = Number(purchaseAmount);

      // Fallback para evitar duplicação caso exista um cliente legado sem o '55' no banco
      const existRaw = await prisma.customer.findUnique({ where: { phone: rawDigits } });
      if (existRaw) {
          cleanPhone = rawDigits;
      }

      if (cleanCpf) {
          const existingCpf = await prisma.customer.findUnique({ where: { cpf: cleanCpf } });
          if (existingCpf && existingCpf.phone !== cleanPhone) {
              return res.status(400).json({ error: 'Este CPF já está cadastrado para outro número de telefone.' });
          }
      }

      // Upsert do customer
      const customer = await prisma.customer.upsert({
        where: { phone: cleanPhone },
        create: { phone: cleanPhone, name: name || null, cpf: cleanCpf },
        update: {
          ...(name && { name }),
          ...(cleanCpf && { cpf: cleanCpf }),
        }
      });

      // Encontra regra elegível
      const rule = await prisma.rewardRule.findFirst({
        where: {
          tenantId: tenant.id,
          isActive: true,
          OR: [
            { minPurchase: null },
            { minPurchase: { lte: amount } }
          ]
        }
      });

      // Mesmo sem regra elegível, registra a compra com 0 pontos
      const pointsEarned = rule
        ? (rule.type === 'PERCENTAGE'
          ? (amount * rule.value) / 100
          : rule.type === 'CONVERSION'
          ? Math.floor(amount / rule.value)
          : rule.value)
        : 0;

      const ttlDays = tenant.cashbackTtlDays || 90;

      const result = await prisma.$transaction(async (tx) => {
        const profile = await tx.customerProfile.upsert({
          where: { tenantId_customerId: { tenantId: tenant.id, customerId: customer.id } },
          create: { tenantId: tenant.id, customerId: customer.id },
          update: {}
        });

        await tx.transaction.create({
          data: {
            tenantId: tenant.id,
            customerProfileId: profile.id,
            type: 'EARN',
            amountPurchase: amount,
            amountPoints: pointsEarned,
            description: rule ? `Regra: ${rule.name}` : 'Compra registrada (sem regra elegível)',
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * ttlDays)
          }
        });

        const totalVisits = profile.totalTransactions + 1;
        const updatedProfile = await tx.customerProfile.update({
          where: { id: profile.id },
          data: {
            balance: profile.balance + pointsEarned,
            lifetimeValue: profile.lifetimeValue + amount,
            totalTransactions: totalVisits,
            lastPurchaseAt: new Date(),
            rfmSegment: totalVisits > 10 ? 'CAMPEAO' : (totalVisits > 2 ? 'RECORRENTE' : 'NOVATO')
          }
        });

        return updatedProfile;
      });

      return res.status(201).json({
        success: true,
        customerName: customer.name || 'Cliente',
        pointsEarned,
        totalBalance: result.balance,
        totalTransactions: result.totalTransactions,
        ruleName: rule?.name || null
      });

    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
}
