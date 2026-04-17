import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { TransactionService } from '../services/transaction.service';

const txService = new TransactionService(prisma);

export class TransactionController {
  
  static async handleWebhook(req: Request, res: Response) {
    try {
      const { tenantId, customerId, customerPhone, amount } = req.body;
      
      const result = await txService.processPurchase(tenantId, customerId, amount);
      if (!result) {
        return res.status(200).json({ message: 'Nenhuma regra de cashback elegível.' });
      }

      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}
