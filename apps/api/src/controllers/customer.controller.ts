import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { MessagingService } from '../services/messaging.service';
import { WhatsAppService, waService } from '../whatsapp/baileys.service';
import { formatPhone } from '../utils/phone.util';

waService.initEngine().catch(console.error);
const messagingService = new MessagingService(prisma, waService);

export class CustomerController {
  
  static async listCustomers(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const { search, segment } = req.query;

      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

      // Build WHERE clause string for raw SQL if search is provided
      let whereClause = `WHERE "tenantId" = '${tenant.id}'`;
      if (search) {
          const s = String(search).toLowerCase();
          whereClause += ` AND (LOWER(name) LIKE '%${s}%' OR phone LIKE '%${s}%')`;
      }
      if (segment && segment !== 'TODOS') {
          whereClause += ` AND computed_segment = '${segment}'`;
      }

      const query = `SELECT * FROM vw_customer_rfm ${whereClause} ORDER BY "lastPurchaseAt" DESC NULLS LAST;`;
      
      const customers = await prisma.$queryRawUnsafe(query);
      
      // Get summary
      const allCustomers: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM vw_customer_rfm WHERE "tenantId" = '${tenant.id}'`);
      
      const metrics = {
          totalAtivos: allCustomers.length,
          emRisco: allCustomers.filter(c => c.computed_segment === 'EM_RISCO').length,
          cashbackPendente: allCustomers.reduce((acc, c) => acc + (c.balance || 0), 0),
          aniversariantesMes: allCustomers.filter(c => {
             if (!c.birthDate) return false;
             return new Date(c.birthDate).getMonth() === new Date().getMonth();
          }).length
      };

      return res.json({ customers, metrics, tenant });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async getCustomerDetail(req: Request, res: Response) {
    try {
      const { tenantSlug, profileId } = req.params;
      
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

      const profile = await prisma.customerProfile.findFirst({
        where: { id: profileId, tenantId: tenant.id },
        include: {
            customer: true,
            transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
            notes: { orderBy: { createdAt: 'desc' } }
        }
      });

      if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' });

      // Group consumption chart data based on transactions
      const monthlyData: Record<string, number> = {};
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      // Build last 6 months empty
      const d = new Date();
      for(let i=5; i>=0; i--) {
         const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
         monthlyData[`${monthNames[m.getMonth()]}`] = 0;
      }

      profile.transactions.forEach(t => {
         if (t.type === 'EARN' || t.type === 'REDEEM') {
             const m = monthNames[t.createdAt.getMonth()];
             if (monthlyData[m] !== undefined) {
                 monthlyData[m] += (t.amountPurchase || 0) + (t.type === 'REDEEM' ? t.amountPoints : 0);
             }
         }
      });

      const chartData = Object.keys(monthlyData).map(k => ({ month: k, value: monthlyData[k] }));

      return res.json({ profile, chartData, tenant });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async addNote(req: Request, res: Response) {
      try {
        const { profileId } = req.params;
        const { content, authorName } = req.body;
        const note = await prisma.customerNote.create({
            data: { customerProfileId: profileId, content, authorName: authorName || 'Admin' }
        });
        return res.json(note);
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
  }

  static async deleteNote(req: Request, res: Response) {
      try {
          const { noteId } = req.params;
          await prisma.customerNote.delete({ where: { id: noteId } });
          return res.json({ success: true });
      } catch (e: any) {
          return res.status(500).json({ error: e.message });
      }
  }

  static async sendSegmentMessage(req: Request, res: Response) {
      try {
          const { tenantSlug } = req.params;
          const { segment, template } = req.body;

          const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
          if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

          const result = await messagingService.sendToSegment(tenant.id, segment, template);
          return res.json(result);
      } catch (e: any) {
          return res.status(500).json({ error: e.message });
      }
  }

  static async updateCustomer(req: Request, res: Response) {
      try {
          const { tenantSlug, profileId } = req.params;
          const { name, phone, cpf, birthDate } = req.body;
          const cleanPhone = phone ? formatPhone(phone) : undefined;

          const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
          if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

          const profile = await prisma.customerProfile.findFirst({
              where: { id: profileId, tenantId: tenant.id },
              include: { customer: true }
          });

          if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' });

          const updatedCustomer = await prisma.customer.update({
              where: { id: profile.customerId },
              data: {
                  ...(name !== undefined && { name }),
                  ...(cleanPhone !== undefined && { phone: cleanPhone }),
                  ...(cpf !== undefined && { cpf }),
                  ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null })
              }
          });

          return res.json({ success: true, customer: updatedCustomer });
      } catch (e: any) {
          return res.status(500).json({ error: e.message });
      }
  }

  static async deleteCustomer(req: Request, res: Response) {
      try {
          const { tenantSlug, profileId } = req.params;

          const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
          if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

          const profile = await prisma.customerProfile.update({
              where: { id: profileId, tenantId: tenant.id },
              data: { isActive: false }
          });

          return res.json({ success: true, profile });
      } catch (e: any) {
          return res.status(500).json({ error: e.message });
      }
  }
}
