import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionController } from './controllers/transaction.controller';
import { CRMWorkers } from './workers/cron.worker';
import { prisma } from '@repo/database';

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// REGISTRO DOS ENDPOINTS DA VERSÃO FINAL
// ==========================================
app.get('/api/dashboard/:tenantSlug', DashboardController.getTenantKPIs);
app.post('/api/transactions/webhook', TransactionController.handleWebhook);

// Inicializa Backgroun Tasks de Engajamento
async function bootstrap() {
    // NOTA: Baileys e Workers rodariam isolados no PM2 (Produção)
    // Para simplificar a visualização do NEXT.js no seu ambiente de Dev,
    // o QR Code do WhatsApp foi suprimido do Auto-Restart do Nodemon.
    
    app.listen(3333, () => {
        console.log('🚀 Backend API-Driven (Node) operando na porta 3333!');
    });
}

bootstrap();
