import { PrismaClient } from '@repo/database';

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  async processPurchase(tenantId: string, customerId: string, purchaseAmount: number) {
    const rule = await this.prisma.rewardRule.findFirst({
      where: { 
        tenantId, 
        isActive: true, 
        OR: [
            { minPurchase: null },
            { minPurchase: { lte: purchaseAmount } }
        ]
      }
    });
    
    if (!rule) return null;

    const pointsEarned = rule.type === 'PERCENTAGE' 
      ? (purchaseAmount * rule.value) / 100 
      : rule.type === 'CONVERSION'
      ? Math.floor(purchaseAmount / rule.value)
      : rule.value;

    return await this.prisma.$transaction(async (tx) => {
      const profile = await tx.customerProfile.upsert({
        where: { tenantId_customerId: { tenantId, customerId } },
        create: { tenantId, customerId },
        update: {}
      });

      const transaction = await tx.transaction.create({
        data: {
          tenantId, customerProfileId: profile.id,
          type: 'EARN', amountPurchase: purchaseAmount, amountPoints: pointsEarned,
          description: `Regra Aplicada: ${rule.name}`,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        }
      });

      const totalVisits = profile.totalTransactions + 1;
      const updatedProfile = await tx.customerProfile.update({
        where: { id: profile.id },
        data: {
          balance: profile.balance + pointsEarned,
          lifetimeValue: profile.lifetimeValue + purchaseAmount,
          totalTransactions: totalVisits,
          lastPurchaseAt: new Date(),
          rfmSegment: totalVisits > 10 ? 'CAMPEAO' : (totalVisits > 2 ? 'RECORRENTE' : 'NOVATO')
        }
      });

      return { transaction, profile: updatedProfile };
    });
  }
}
