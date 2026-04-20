import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });
import express from 'express';
import cors from 'cors';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionController } from './controllers/transaction.controller';
import { SettingsController } from './controllers/settings.controller';
import { POSController } from './controllers/pos.controller';
import { CustomerController } from './controllers/customer.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { SaasController } from './controllers/saas.controller';
import { ConsumerController } from './controllers/consumer.controller';
import { authMiddleware, requireSuperAdmin, requireTenantOwner } from './middlewares/auth.middleware';
import { CRMWorkers } from './workers/cron.worker';
import { prisma } from '@repo/database';

const app = express();

const allowedOrigins = [
  'https://cashback.cyrustech.com.br',
  'https://sistema-crm-cashback-web.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handler explícito para resolver o Preflight do navegador
app.options('*', cors());

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

// Rotas Públicas
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Auth
app.post('/api/auth/login', AuthController.login);

// ===== SAAS ADMIN ROUTES =====
app.get('/api/saas/companies', SaasController.listTenants);
app.post('/api/saas/companies', SaasController.createTenant);
app.get('/api/saas/companies/:tenantId/metrics', SaasController.getTenantMetrics);

// ===== CONSUMER PWA ROUTES =====
app.post('/api/consumer/auth', ConsumerController.auth);
app.get('/api/consumer/wallet/:tenantSlug/:customerId', ConsumerController.getWallet);
app.post('/api/consumer/redeem', ConsumerController.requestRedeem);

// ===== ADMIN / QUEUE ROUTES =====
app.get('/api/consumer/admin/queue/:tenantSlug', ConsumerController.getRedeemQueue);
app.post('/api/consumer/admin/fulfill/:transactionId', ConsumerController.fulfillRedeem);

// Módulo Tenant (Loja Configurações & Equipe)
app.get('/api/users', authMiddleware, requireTenantOwner, UserController.listUsers);
app.post('/api/users', authMiddleware, requireTenantOwner, UserController.createUser);

// POS - Frente de Caixa
app.get('/api/pos/:tenantSlug/customer', POSController.lookupCustomer);
app.get('/api/pos/:tenantSlug/rules', POSController.getActiveRules);
app.post('/api/pos/:tenantSlug/purchase', POSController.registerPurchase);

// Diretório de Clientes & CRM
app.get('/api/customers/:tenantSlug', CustomerController.listCustomers);
app.get('/api/customers/:tenantSlug/:profileId', CustomerController.getCustomerDetail);
app.put('/api/customers/:tenantSlug/:profileId', CustomerController.updateCustomer);
app.delete('/api/customers/:tenantSlug/:profileId', CustomerController.deleteCustomer);
app.post('/api/customers/:tenantSlug/:profileId/notes', CustomerController.addNote);
app.delete('/api/customers/:tenantSlug/notes/:noteId', CustomerController.deleteNote);
app.post('/api/customers/:tenantSlug/message-segment', CustomerController.sendSegmentMessage);


// Inicializa Background Tasks e Servidor
async function bootstrap() {
    // TODO: Descomentar quando integrar com API oficial do WhatsApp
    // const workers = new CRMWorkers(prisma);
    // workers.start();
    
    app.listen(3333, () => {
        console.log('🚀 Backend API-Driven (Node) operando na porta 3333!');
    });
}

bootstrap();

