<p align="center">
  <strong>🔗 EloBonus</strong><br>
  <em>Plataforma SaaS de Fidelização e Cashback por Pontos — Multi-Tenant</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss" />
</p>

---

## 📋 Sobre o Projeto

**EloBonus** é uma plataforma B2B2C completa de **fidelização por pontos e cashback**, projetada como um SaaS multi-tenant. Permite que múltiplas empresas (lojas, restaurantes, redes) operem de forma isolada na mesma infraestrutura, cada uma gerenciando seus próprios clientes, regras de pontuação, catálogo de recompensas e equipe de operadores.

O sistema abrange o ciclo completo de fidelização:
1. **Cadastro e pontuação** do cliente no ponto de venda (PDV)
2. **Acúmulo** de pontos com base em regras configuráveis (percentual, conversão ou fixo)
3. **Resgate** de prêmios pelo consumidor via PWA mobile
4. **Controle anti-fraude** com fila de aprovação para entregas no balcão
5. **Remarketing automatizado** via WhatsApp (Baileys) para reativação de clientes inativos

---

## 🏛️ Arquitetura

O projeto segue uma **arquitetura em monorepo** com NPM Workspaces, separando responsabilidades em camadas independentes:

```
crm-bonus/
├── apps/
│   ├── web/                    # Frontend — Next.js 14 (App Router)
│   │   └── src/app/
│   │       ├── admin/          # Dashboard do lojista
│   │       │   ├── page.tsx            # Visão Estratégica (KPIs + Gráficos)
│   │       │   ├── pontuacao/          # Frente de Caixa (PDV)
│   │       │   ├── clientes/           # Diretório de clientes c/ CRM
│   │       │   ├── customer/[id]/      # Ficha 360° do cliente (Timeline + Notas)
│   │       │   ├── produtos/           # Catálogo de recompensas
│   │       │   ├── resgates/           # Fila de entregas (anti-fraude)
│   │       │   ├── settings/           # Configurações do tenant
│   │       │   ├── usuarios/           # Gestão de equipe (RBAC)
│   │       │   └── saas/              # Painel Super Admin (multi-tenant)
│   │       ├── cliente/        # PWA do consumidor final
│   │       │   ├── page.tsx            # Login + Carteira digital
│   │       │   └── loja/[slug]/        # Vitrine de prêmios + Resgate
│   │       └── login/          # Autenticação JWT
│   │
│   └── api/                    # Backend — Express + TypeScript
│       └── src/
│           ├── controllers/    # Lógica de negócio (POS, Dashboard, Consumer, Auth, etc.)
│           ├── middlewares/    # JWT Guard + RBAC (Super Admin / Owner / Operator)
│           ├── services/       # Camada de serviço (CustomerProfile)
│           ├── workers/        # Cron jobs (remarketing automático)
│           ├── whatsapp/       # Integração Baileys (QR Code + disparo)
│           └── utils/          # Utilitários (formatação de telefone)
│
└── packages/
    └── database/               # Prisma ORM compartilhado
        └── prisma/
            └── schema.prisma   # Schema unificado (10 models)
```

---

## 🧰 Tecnologias e Ferramentas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR, roteamento e componentização React |
| **Estilização** | TailwindCSS 3 | Design system responsivo (Glassmorphism) |
| **Gráficos** | Recharts | Visualização de dados (KPIs, projeção financeira) |
| **Ícones** | Lucide React | Iconografia consistente |
| **Backend** | Express 4 + TypeScript | API RESTful com tipagem estática |
| **Banco de Dados** | PostgreSQL (Supabase) | Persistência relacional em nuvem |
| **ORM** | Prisma 5 | Migrations, tipagem e queries type-safe |
| **Autenticação** | JWT + Bcrypt | Token-based auth com hash de senhas |
| **WhatsApp** | Baileys (WebSocket) | Mensageria automatizada sem custos de HSM |
| **Automação** | Node-Cron | Workers para remarketing de clientes inativos |
| **Monorepo** | NPM Workspaces | Gerenciamento unificado de dependências |

---

## 🧩 Funcionalidades Principais

### 🏪 Painel Administrativo (Lojista)
- **Dashboard Estratégico** — KPIs de faturamento, base de clientes e ticket médio com gráfico de projeção financeira dos últimos 7 dias (atualização manual via botão refresh)
- **Frente de Caixa (PDV)** — Busca inteligente de clientes por telefone, CPF ou nome com fallback para dados legados, validação anti-duplicidade de CPF e popup de upsell "Quase Lá"
- **CRM Completo** — Diretório de clientes com segmentação RFM (Campeão, Recorrente, Em Risco, Novato), ficha 360° com timeline de transações, gráfico de consumo mensal e notas compartilhadas
- **Catálogo de Produtos** — Gestão de prêmios resgatáveis por pontos (nome, descrição, imagem, custo em pontos, ativar/desativar)
- **Fila de Resgates** — Painel de controle anti-fraude estilo "delivery" onde o funcionário confirma a entrega presencial do prêmio
- **Configurações** — Templates de WhatsApp (remarketing e aniversário), regras de cashback configuráveis e validade de pontos
- **Gestão de Equipe** — RBAC hierárquico (Super Admin > Owner > Operator)

### 📱 PWA do Consumidor
- **Login sem senha** — Acesso pela chave do telefone/CPF (passwordless)
- **Carteira Universal** — Visualização do saldo de pontos em todas as lojas cadastradas
- **Vitrine de Prêmios** — Catálogo visual por loja com indicação de disponibilidade
- **Resgate Seguro** — Solicitação gera pedido pendente (status `PENDING`) que só é concluído após a entrega no balcão

### 🤖 Automações
- **Remarketing Automático** — Worker identifica clientes inativos e dispara mensagens via WhatsApp
- **WhatsApp via QR Code** — Conexão direta sem API paga (Baileys/WebSocket)

---

## 🗄️ Modelagem do Banco de Dados

O schema Prisma contém **10 models** que cobrem toda a lógica multi-tenant:

| Model | Responsabilidade |
|---|---|
| `Tenant` | Empresa/loja (multi-tenant isolado por `slug`) |
| `User` | Operadores e admins com role (`SUPER_ADMIN`, `OWNER`, `MERCHANT`) |
| `Customer` | Cliente global (telefone e CPF únicos) |
| `CustomerProfile` | Vínculo cliente ↔ tenant (saldo de pontos, LTV, segmento RFM) |
| `Transaction` | Histórico de movimentações (`EARN`, `REDEEM`, `EXPIRE`) |
| `RewardRule` | Regras de pontuação (percentual, conversão, fixo) |
| `Product` | Prêmios resgatáveis com custo em pontos |
| `CustomerNote` | Anotações internas do CRM sobre o cliente |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- Node.js **18+**
- NPM **9+**
- PostgreSQL (ou conta no [Supabase](https://supabase.com))

### 1. Clone e instale as dependências

```bash
git clone https://github.com/seu-usuario/crm-bonus.git
cd crm-bonus
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` preenchendo:
- `DATABASE_URL` — Connection string do PostgreSQL/Supabase
- `JWT_SECRET` — Chave secreta para assinatura de tokens

### 3. Sincronize o banco de dados

```bash
cd packages/database
npx prisma db push
cd ../..
```

### 4. Inicie os servidores

Em dois terminais separados na raiz do projeto:

```bash
# Terminal 1 — Backend (porta 3333)
npm run dev --workspace=@repo/api

# Terminal 2 — Frontend (porta 3000)
npm run dev --workspace=@repo/web
```

### 5. Acesse a plataforma

| Interface | URL |
|---|---|
| Dashboard Admin | `http://localhost:3000/admin` |
| Login | `http://localhost:3000/login` |
| PWA do Cliente | `http://localhost:3000/cliente` |

---

## 🔒 Segurança

- Todas as credenciais ficam exclusivamente no `.env` (listado no `.gitignore`)
- Autenticação via **JWT** com hash **bcrypt** para senhas
- Middleware de autorização por roles (`SUPER_ADMIN`, `OWNER`, `MERCHANT`)
- Transações financeiras (débito de pontos) protegidas com `prisma.$transaction`
- Resgate de prêmios exige confirmação presencial do lojista (anti-fraude)

---

## 📄 Licença

Este projeto é proprietário e de uso restrito. Todos os direitos reservados.
