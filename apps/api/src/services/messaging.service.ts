import { PrismaClient } from '@repo/database';

/**
 * MessagingService — Preparação de mensagens para disparo manual ou via API oficial (futuro).
 * 
 * NOTA: Anteriormente usava Baileys para envio automático via WebSocket.
 * Removido para evitar banimento de conta WhatsApp.
 * 
 * TODO: Reconectar quando integrar com a API oficial do WhatsApp (Meta Business API).
 */
export class MessagingService {
    constructor(private prisma: PrismaClient) {}

    /**
     * Gera links wa.me para disparo manual de mensagens por segmento.
     * Retorna array de contatos com link pronto para abrir no WhatsApp Web.
     */
    async buildSegmentLinks(tenantId: string, segment: string, template: string) {
        const profiles = await this.prisma.customerProfile.findMany({
            where: { tenantId, rfmSegment: segment },
            include: { customer: true }
        });

        return profiles.map(p => {
            const msg = template
                .replace('{name}', p.customer.name || 'amigo(a)')
                .replace('{balance}', p.balance.toFixed(2));

            return {
                name: p.customer.name || 'Cliente',
                phone: p.customer.phone,
                message: msg,
                waLink: `https://wa.me/${p.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
            };
        });
    }
}
