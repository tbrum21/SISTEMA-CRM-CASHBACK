import { Request, Response } from 'express';
import { prisma } from '@repo/database';

export class DashboardController {
  
  static async getTenantKPIs(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: {
            customerProfiles: true,
            transactions: true
        }
      });

      if (!tenant) return res.status(404).json({ error: 'Lojista não encontrado' });

      // Aggregate data from real DB
      const totalFidelizados = tenant.customerProfiles.length;
      
      let receitaFeitaComCashback = 0;
      tenant.transactions.forEach(tx => {
          receitaFeitaComCashback += (tx.amountPurchase || 0);
      });

      const avgTicket = totalFidelizados > 0 ? (receitaFeitaComCashback / totalFidelizados) : 0;

      // Build daily data for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0,0,0,0);

      const recentStats = await prisma.transaction.findMany({
        where: { tenantId: tenant.id, type: 'EARN', createdAt: { gte: sevenDaysAgo } }
      });

      const dailyData = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(sevenDaysAgo);
          d.setDate(d.getDate() + i);
          return {
              dateStr: d.toISOString().split('T')[0],
              // "seg.", "ter." format removal
              name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
              cashback: 0
          };
      });

      recentStats.forEach(tx => {
          const txDate = tx.createdAt.toISOString().split('T')[0];
          const dayMatch = dailyData.find(d => d.dateStr === txDate);
          if (dayMatch) {
              dayMatch.cashback += (tx.amountPurchase || 0);
          }
      });

      const chartData = dailyData.map(d => ({ name: d.name.charAt(0).toUpperCase() + d.name.slice(1), cashback: d.cashback }));

      const recentTransactions = await prisma.transaction.findMany({
          where: { tenantId: tenant.id, type: 'EARN' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
              customerProfile: {
                  include: { customer: true }
              }
          }
      });

      return res.json({
        kpis: {
            receitaBase: receitaFeitaComCashback,
            fidelizados: totalFidelizados,
            ticketMedio: avgTicket
        },
        chartData,
        recentTransactions
      });
      
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
