import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { formatPhone } from '../utils/phone.util';

export class ConsumerController {

  /**
   * Identificação "Passwordless"
   * Retorna os dados do cliente e os profiles (carteiras em lojas) que ele possui.
   * POST /api/consumer/auth
   */
  static async auth(req: Request, res: Response) {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: 'Telefone ou CPF obrigatório.' });

      const cleanDigits = String(query).replace(/\D/g, '');
      const possiblePhone = formatPhone(cleanDigits);

      const customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { phone: possiblePhone },
            { phone: cleanDigits },
            ...(cleanDigits.length >= 11 ? [{ cpf: cleanDigits }] : [])
          ]
        },
        include: {
          profiles: {
            include: {
              tenant: { select: { id: true, name: true, slug: true } }
            }
          }
        }
      });

      if (!customer) {
        return res.status(404).json({ error: 'Cadastro não encontrado.' });
      }

      return res.json({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        profiles: customer.profiles.map(p => ({
          profileId: p.id,
          balance: p.balance,
          tenant: p.tenant
        }))
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Retorna saldo e lista de produtos disponíveis para a carteira específica
   * GET /api/consumer/wallet/:tenantSlug/:customerId
   */
  static async getWallet(req: Request, res: Response) {
    try {
      const { tenantSlug, customerId } = req.params;

      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: {
          products: { where: { isActive: true } }
        }
      });

      if (!tenant) return res.status(404).json({ error: 'Loja não encontrada' });

      const profile = await prisma.customerProfile.findUnique({
        where: { tenantId_customerId: { tenantId: tenant.id, customerId } }
      });

      if (!profile) return res.status(404).json({ error: 'Você não possui carteira nesta loja.' });

      // Pending redemptions (to show in the UI as processing)
      const pendingRedemptions = await prisma.transaction.findMany({
        where: { customerProfileId: profile.id, type: 'REDEEM', status: 'PENDING' },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        tenantName: tenant.name,
        balance: profile.balance,
        products: tenant.products,
        pendingRedemptions
      });

    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * Solicitação de Resgate pelo Cliente
   * POST /api/consumer/redeem
   */
  static async requestRedeem(req: Request, res: Response) {
    try {
      const { tenantSlug, customerId, productId } = req.body;

      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      const product = await prisma.product.findUnique({ where: { id: productId } });
      
      if (!tenant || !product) return res.status(404).json({ error: 'Dados inválidos' });

      const profile = await prisma.customerProfile.findUnique({
        where: { tenantId_customerId: { tenantId: tenant.id, customerId } }
      });

      if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' });

      if (profile.balance < product.costInPoints) {
        return res.status(400).json({ error: 'Saldo insuficiente.' });
      }

      // Cria a transação PENDENTE e debita o saldo
      const tx = await prisma.$transaction(async (db) => {
        const updatedProfile = await db.customerProfile.update({
          where: { id: profile.id },
          data: { balance: profile.balance - product.costInPoints }
        });

        const transaction = await db.transaction.create({
          data: {
            tenantId: tenant.id,
            customerProfileId: profile.id,
            type: 'REDEEM',
            amountPoints: -product.costInPoints,
            productId: product.id,
            status: 'PENDING',
            description: `Solicitação de Resgate: ${product.name}`
          }
        });

        return { updatedProfile, transaction };
      });

      return res.json({ success: true, newBalance: tx.updatedProfile.balance, transactionId: tx.transaction.id });

    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  /**
   * LOJISTA: Lista Fila de Entregas Pendentes
   * GET /api/consumer/admin/queue/:tenantSlug
   */
  static async getRedeemQueue(req: Request, res: Response) {
     try {
        const { tenantSlug } = req.params;
        const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (!tenant) return res.status(404).json({ error: 'Tenant error' });

        const queue = await prisma.transaction.findMany({
            where: { tenantId: tenant.id, type: 'REDEEM', status: 'PENDING' },
            include: { 
                product: true, 
                customerProfile: { include: { customer: true } } 
            },
            orderBy: { createdAt: 'asc' }
        });

        return res.json(queue);
     } catch(e: any) {
         return res.status(500).json({ error: e.message });
     }
  }

  /**
   * LOJISTA: Marcar como FULFILLED (Entregue)
   * POST /api/consumer/admin/fulfill/:transactionId
   */
  static async fulfillRedeem(req: Request, res: Response) {
      try {
          const { transactionId } = req.params;
          
          const tx = await prisma.transaction.update({
              where: { id: transactionId },
              data: { status: 'FULFILLED' }
          });
          
          return res.json({ success: true, tx });
      } catch(e: any) {
          return res.status(500).json({ error: e.message });
      }
  }

}
