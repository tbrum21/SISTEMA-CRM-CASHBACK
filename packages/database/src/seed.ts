import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Inicializando o Seeding da Nuvem Supabase...');
    
    // 0. Recriar View RFM
    console.log('🔧 Configurando a View RFM (vw_customer_rfm)...');
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE VIEW vw_customer_rfm AS
      SELECT
        cp.id               AS profile_id,
        cp."tenantId",
        cp."customerId",
        c.name,
        c.phone,
        c."birthDate",
        cp.balance,
        cp."lifetimeValue"  AS ltv,
        cp."totalTransactions" AS frequency,
        cp."lastPurchaseAt",
        cp."rfmSegment",
        COALESCE(
          EXTRACT(DAY FROM (NOW() - cp."lastPurchaseAt")),
          9999
        )::int AS recency_days,
        CASE
          WHEN cp."totalTransactions" >= 10 THEN 'CAMPEAO'
          WHEN cp."lastPurchaseAt" IS NULL THEN 'NOVATO'
          WHEN cp."lastPurchaseAt" < (NOW() - INTERVAL '30 days') THEN 'EM_RISCO'
          WHEN cp."totalTransactions" >= 3 THEN 'RECORRENTE'
          ELSE 'NOVATO'
        END AS computed_segment
      FROM "CustomerProfile" cp
      JOIN "Customer" c ON c.id = cp."customerId";
    `);

    // 1. O Tenant Lojista
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'burger-master' },
        update: {},
        create: {
            name: 'Burger Master',
            slug: 'burger-master',
            document: '12.345.678/0001-90',
            remarketingTemplate: 'Oi {name}! Seu saldo de R$ {balance} no Burger Master expira em breve. Venha resgatar!'
        }
    });

    // 2. A Regra do Cashback
    await prisma.rewardRule.upsert({
        where: { id: 'default-rule' },
        update: {},
        create: {
            id: 'default-rule',
            tenantId: tenant.id,
            name: 'Cashback Padrão 10%',
            type: 'PERCENTAGE',
            value: 10
        }
    }).catch(async () => {
        // Fallback for duplicates if without id constraint
        const rule = await prisma.rewardRule.findFirst({ where: { name: 'Cashback Padrão 10%', tenantId: tenant.id }});
        if(!rule) {
            await prisma.rewardRule.create({
                data: { tenantId: tenant.id, name: 'Cashback Padrão 10%', type: 'PERCENTAGE', value: 10 }
            });
        }
    });

    // 3. Clientes Demo (Oito Perfis Variados)
    const mockCustomers = [
        { phone: '5511999999999', name: 'Carlos Azevedo', segment: 'CAMPEAO', ltv: 4500, balance: 450, daysAgo: 2, tx: 12 },
        { phone: '5511988887777', name: 'Mariana Silva', segment: 'CAMPEAO', ltv: 3200, balance: 320, daysAgo: 5, tx: 10 },
        { phone: '5511977776666', name: 'João Pedro Oliveira', segment: 'RECORRENTE', ltv: 1800, balance: 95, daysAgo: 12, tx: 6 },
        { phone: '5511966665555', name: 'Ana Beatriz Costa', segment: 'RECORRENTE', ltv: 950, balance: 65, daysAgo: 8, tx: 4 },
        { phone: '5511955554444', name: 'Lucas Mendes', segment: 'EM_RISCO', ltv: 600, balance: 30, daysAgo: 45, tx: 2 },
        { phone: '5511944443333', name: 'Fernanda Rocha', segment: 'EM_RISCO', ltv: 350, balance: 18, daysAgo: 60, tx: 1 },
        { phone: '5511933332222', name: 'Gustavo Henrique', segment: 'NOVATO', ltv: 120, balance: 12, daysAgo: 3, tx: 1 },
        { phone: '5511922221111', name: 'Patrícia Lemos', segment: 'NOVATO', ltv: 70, balance: 7, daysAgo: 1, tx: 1 },
    ];

    for (let i = 0; i < mockCustomers.length; i++) {
        const mock = mockCustomers[i];
        
        const cust = await prisma.customer.upsert({
            where: { phone: mock.phone },
            update: { name: mock.name },
            create: { phone: mock.phone, name: mock.name, birthDate: new Date(1990, i, 15) }
        });

        const txDate = new Date();
        txDate.setDate(txDate.getDate() - mock.daysAgo);

        const profile = await prisma.customerProfile.upsert({
            where: { tenantId_customerId: { tenantId: tenant.id, customerId: cust.id } },
            update: {
                balance: mock.balance,
                lifetimeValue: mock.ltv,
                totalTransactions: mock.tx,
                rfmSegment: mock.segment,
                lastPurchaseAt: txDate
            },
            create: {
                tenantId: tenant.id,
                customerId: cust.id,
                balance: mock.balance,
                lifetimeValue: mock.ltv,
                totalTransactions: mock.tx,
                rfmSegment: mock.segment,
                lastPurchaseAt: txDate
            }
        });

        // Add dummy transactions to represent history
        const hasTx = await prisma.transaction.findFirst({ where: { customerProfileId: profile.id } });
        if (!hasTx) {
            await prisma.transaction.create({
                data: {
                  tenantId: tenant.id,
                  customerProfileId: profile.id,
                  type: 'EARN',
                  amountPurchase: mock.ltv,
                  amountPoints: mock.balance,
                  description: 'Compra PDV Integrada',
                  createdAt: txDate,
                  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
                }
            });
            
            // Adding a random message timeline event for visual
            if (mock.daysAgo > 10) {
               await prisma.transaction.create({
                    data: {
                      tenantId: tenant.id,
                      customerProfileId: profile.id,
                      type: 'MESSAGE',
                      amountPurchase: 0,
                      amountPoints: 0,
                      description: 'Aviso de Saldo WhatsApp',
                      createdAt: new Date(txDate.getTime() + 1000 * 60 * 60 * 24),
                    }
                });
            }
        }
    }
    
    console.log('✅ Base preenchida lindamente com Mocks do Mundo Real!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
