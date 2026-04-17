import cron from 'node-cron';
import { PrismaClient } from '@repo/database';

/**
 * CRMWorkers — Tarefas agendadas para remarketing e retenção de clientes.
 * 
 * NOTA: O envio automático via Baileys foi removido para evitar banimento.
 * A estrutura do cron está mantida para futura integração com a API oficial do WhatsApp.
 * 
 * TODO: Quando a API oficial do WhatsApp for integrada:
 *   1. Injetar o serviço de mensageria oficial no construtor
 *   2. Descomentar a lógica de envio no runRemarketingHooks()
 *   3. Implementar runBirthdayHooks() para template de aniversário
 */
export class CRMWorkers {
  constructor(private prisma: PrismaClient) {}

  start() {
    // Executa todos os dias às 10:00 da manhã  
    cron.schedule('0 10 * * *', async () => {
      console.log('🔥 Disparando gatilhos de Retenção RFM...');
      await this.runRemarketingHooks();
    });

    console.log('⏰ CRM Workers agendados (cron ativo).');
  }

  /**
   * Identifica clientes inativos (>30 dias sem compra) com saldo pendente
   * e prepara lista para remarketing.
   * 
   * TODO: Enviar mensagens automaticamente via API oficial do WhatsApp.
   * Por enquanto, apenas loga os clientes identificados para remarketing.
   */
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

    if (dormants.length === 0) {
      console.log('✅ Nenhum cliente inativo com saldo encontrado.');
      return;
    }

    console.log(`📋 ${dormants.length} cliente(s) inativo(s) identificados para remarketing:`);

    for (const profile of dormants) {
      if (!profile.tenant.remarketingTemplate) continue;

      const msg = profile.tenant.remarketingTemplate
        .replace('{name}', profile.customer.name || 'amigo(a)')
        .replace('{balance}', profile.balance.toFixed(2));

      // TODO: Descomentar quando a API oficial do WhatsApp for integrada:
      // try {
      //   await officialWhatsAppService.sendTemplate(profile.customer.phone, msg);
      //   await this.prisma.customerProfile.update({
      //     where: { id: profile.id },
      //     data: { 
      //       lastRemarketingSentAt: new Date(),
      //       rfmSegment: 'EM_RISCO'
      //     }
      //   });
      // } catch (err) {
      //   console.error(`Erro ao disparar para ${profile.customer.phone}`);
      // }

      console.log(`  → ${profile.customer.name || 'Sem nome'} (${profile.customer.phone}) — Saldo: ${profile.balance.toFixed(2)} pts`);
    }
  }
}
