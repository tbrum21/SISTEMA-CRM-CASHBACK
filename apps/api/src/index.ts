import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionController } from './controllers/transaction.controller';
import { SettingsController } from './controllers/settings.controller';
import { POSController } from './controllers/pos.controller';
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

// Settings / Config do Tenant
app.get('/api/settings/:tenantSlug', SettingsController.getTenantSettings);
app.put('/api/settings/:tenantSlug', SettingsController.updateTenantSettings);

// Catálogo de Produtos
app.post('/api/settings/:tenantSlug/products', SettingsController.createProduct);
app.put('/api/settings/:tenantSlug/products/:id', SettingsController.updateProduct);
app.delete('/api/settings/:tenantSlug/products/:id', SettingsController.deleteProduct);

// Regras de Recompensa
app.post('/api/settings/:tenantSlug/rules', SettingsController.createRule);
app.put('/api/settings/:tenantSlug/rules/:id', SettingsController.updateRule);
app.delete('/api/settings/:tenantSlug/rules/:id', SettingsController.deleteRule);

// POS - Frente de Caixa
app.get('/api/pos/:tenantSlug/customer', POSController.lookupCustomer);
app.get('/api/pos/:tenantSlug/rules', POSController.getActiveRules);
app.post('/api/pos/:tenantSlug/purchase', POSController.registerPurchase);

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
