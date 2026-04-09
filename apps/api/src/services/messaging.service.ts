import { WhatsAppService } from '../whatsapp/baileys.service';
import { PrismaClient } from '@repo/database';

export class MessagingService {
    constructor(private prisma: PrismaClient, private waService: WhatsAppService) {}

    async sendToSegment(tenantId: string, segment: string, template: string) {
        // Obter do banco todos os profiles do tenant e segmento
        const profiles = await this.prisma.customerProfile.findMany({
            where: { tenantId, rfmSegment: segment },
            include: { customer: true }
        });

        let successCount = 0;
        let failCount = 0;

        for (const p of profiles) {
            // Apply template replacements
            const msg = template
                .replace('{name}', p.customer.name || 'amigo(a)')
                .replace('{balance}', p.balance.toFixed(2));
            
            try {
                await this.waService.sendText(p.customer.phone, msg);
                successCount++;
                
                // Add message to timeline
                await this.prisma.transaction.create({
                    data: {
                        tenantId,
                        customerProfileId: p.id,
                        type: 'MESSAGE',
                        amountPurchase: 0,
                        amountPoints: 0,
                        description: `Campanha RFM: ${segment}`,
                    }
                });

                // Await 1 sec to avoid ban (rate limiting)
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`Erro ao disparar para ${p.customer.phone}`);
                failCount++;
            }
        }
        return { successCount, failCount, total: profiles.length };
    }
}
