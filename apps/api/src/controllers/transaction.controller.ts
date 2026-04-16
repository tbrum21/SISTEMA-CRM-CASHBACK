import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { TransactionService } from '../services/transaction.service';
import { waService } from '../whatsapp/baileys.service';

const txService = new TransactionService(prisma);

waService.initEngine().catch(console.error);

export class TransactionController {
  
  static async handleWebhook(req: Request, res: Response) {
    try {
      const { tenantId, customerId, customerPhone, amount } = req.body;
      
      const result = await txService.processPurchase(tenantId, customerId, amount);
      if (!result) {
        return res.status(200).json({ message: 'Nenhuma regra de cashback elegível.' });
      }

      const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

      const msg = `🎉 Olá! Você acabou de ganhar R$ ${result.transaction.amountPoints.toFixed(2)} em Cashback na loja ${tenant?.name}! Seu saldo atualizado é de R$ ${result.profile.balance.toFixed(2)}. Voltaremos a nos falar em breve!`;
      
      try {
        await waService.sendText(customerPhone, msg);
      } catch(waError) {
        console.error('Falha ao acionar WhatsApp no gatilho:', waError);
      }

      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}
