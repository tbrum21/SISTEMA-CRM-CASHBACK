import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Inicializando o Seeding da Nuvem Supabase...');
    
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
    await prisma.rewardRule.create({
        data: {
            tenantId: tenant.id,
            name: 'Cashback Padrão 10%',
            type: 'PERCENTAGE',
            value: 10
        }
    });

    // 3. O Cliente Consumidor Universal
    const cust = await prisma.customer.upsert({
        where: { phone: '5511999999999' },
        update: {},
        create: {
            phone: '5511999999999',
            name: 'Carlos Azevedo',
            cpf: '123.456.789-00'
        }
    });

    // 4. A Conta Corrente Pivot (LTV na Loja)
    const profile = await prisma.customerProfile.upsert({
        where: { tenantId_customerId: { tenantId: tenant.id, customerId: cust.id } },
        update: {},
        create: {
            tenantId: tenant.id,
            customerId: cust.id,
            balance: 45.0,
            lifetimeValue: 450.0,
            totalTransactions: 2,
            rfmSegment: 'CAMPEAO',
            lastPurchaseAt: new Date()
        }
    });

    // 5. Histórico da Transação Real
    await prisma.transaction.create({
        data: {
          tenantId: tenant.id,
          customerProfileId: profile.id,
          type: 'EARN',
          amountPurchase: 250.0,
          amountPoints: 25.0,
          description: 'Regra Aplicada: Cashback Padrão 10%',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // + 30 dias de validade
        }
    });
    
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
