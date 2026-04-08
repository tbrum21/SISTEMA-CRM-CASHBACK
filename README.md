# EloBonus 🔗 - Loyalty & Cashback SaaS

**EloBonus** é uma plataforma inovadora B2B2C focada em LTV (Lifetime Value) e retenção automatizada. Estruturada como um Motor de Cashback multi-tenant, permitindo diversas redes lojistas operarem isoladamente gerenciando réguas de engajamento via Web e através de notificações de **WhatsApp**.

## 🚀 A Stack Tecnológica
- **Next.js (App Router)**: Dashboard Lojista com UI Premium Salesforce-like, com transições fluídas de Light/Dark Mode (Soft Glassmorphism).
- **Node.js (Express)**: Backend RESTful isolado operando como integrador (Webhooks para PDV).
- **PostgreSQL + Prisma**: Infraestrutura de nuvem (`Supabase`) com alta tipagem e segurança em transações de balanço de moedas.
- **WhatsApp WebSockets (Baileys)**: Conexão real-time via QR Code para mensagens instantâneas e campanhas automáticas sem custos por HSM Meta.
- **Workers (Node-Cron)**: Máquina autônoma engatilhando SMS de saudade para clientes de cohort adormecidos.

## 📁 Arquitetura em Monorepo (NPM Workspaces)
A aplicação está dividida modularmente de forma escalável:
```text
/crm-bonus
├── apps/
│   ├── web/          # Interface React (Dashboard Admin/UI Cliente)
│   └── api/          # Back-End, Automações e Endpoints
├── packages/
│   └── database/     # Prisma ORM encapsulado exportando módulos tipados
```

## 🛠️ Guia de Start Rápido Local

Para que tudo funcione simultaneamente pela primeira vez na sua máquina corporativa:

**1. Dependências do Repositório**
Na pasta raiz, puxe todo o esqueleto global do Node_Modules:
```bash
npm install
```

**2. As Variáveis de Ambiente (`.env`)**
Assegure-se de injetar a Connection String do **Supabase** no file de configuração no nível `/packages/database/.env`, e rode o Push do schema.

**3. Iniciar a Plataforma Completa**
Abra dois terminais distintos na raiz:
- Terminal 1 (Servidor React): `npm run dev --workspace=@repo/web`
- Terminal 2 (Motor Back-End): `npm run dev --workspace=@repo/api`

## ✨ Highlights das Funcionalidades
- **Ficha Cadastral 360**: "Linha do Tempo LTV" mapeada perfeitamente no painel.
- **Disparo Silencioso Pós-Venda**: Cada compra mapeada no Backend engatilha o Zap na hora, fidelizando o cliente que já saiu do balcão.
- **PWA Mobile**: Consumidor resgata através do navegador via URL direta, simulando a sensação de App Nativo.
