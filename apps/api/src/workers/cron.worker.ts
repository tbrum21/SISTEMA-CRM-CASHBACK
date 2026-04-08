import cron from 'node-cron';
import { PrismaClient } from '@repo/database';
import { WhatsAppService } from '../whatsapp/baileys.service';

export class CRMWorkers {
  constructor(private prisma: PrismaClient, private waService: WhatsAppService) {}

  start() {
    cron.schedule('0 10 * * *', async () => {
      console.log('🔥 Disparando gatilhos de Retenção RFM...');
      await this.runRemarketingHooks();
    });
  }

  private async runRemarketingHooks() {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 30);

    const dormants = await this.prisma.customerProfile.findMany({
      where: {
        lastPurchaseAt: { lte: limitDate },
        OR: [ { lastRemarketingSentAt: null }, { lastRemarketingSentAt: { lte: limitDate } } ],
        balance: { gt: 0 }
      },
      include: { customer: true, tenant: true }
    });

    for (const profile of dormants) {
      if (!profile.tenant.remarketingTemplate) continue;

      const msg = profile.tenant.remarketingTemplate
        .replace('{name}', profile.customer.name || 'amigo(a)')
        .replace('{balance}', profile.balance.toFixed(2));

      try {
        await this.waService.sendText(profile.customer.phone, msg);
        
        await this.prisma.customerProfile.update({
          where: { id: profile.id },
          data: { 
            lastRemarketingSentAt: new Date(),
            rfmSegment: 'EM_RISCO'
          }
        });
      } catch (err) {
        console.error(`Erro ao disparar para ${profile.customer.phone}`);
      }
    }
  }
}
