'use client';

import { useState, useEffect } from 'react';
import {
  Zap, Link as LinkIcon, Menu, X,
  AlertTriangle, TrendingDown, Target, EyeOff,
  Gift, LayoutDashboard, BarChart3,
  ArrowRight, CheckCircle2, MessageCircle,
  ChevronRight, Shield, Clock, Users, Sparkles
} from 'lucide-react';

const WA_LINK = 'https://wa.me/5534992264329?text=Olá,%20gostaria%20de%20falar%20com%20um%20especialista%20sobre%20o%20EloBonus.';

/* ─── Reusable CTA Button ─── */
function CTAButton({ text = 'Fale com um Especialista', variant = 'primary', className = '' }: { text?: string; variant?: 'primary' | 'secondary' | 'giant'; className?: string }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 active:scale-95 group';
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5',
    secondary: 'bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 px-8 py-4 text-base shadow-lg hover:-translate-y-0.5',
    giant: 'bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-lg md:text-xl shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1',
  };
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={`${base} ${styles[variant]} ${className}`}>
      <MessageCircle size={variant === 'giant' ? 22 : 18} />
      {text}
      <ArrowRight size={variant === 'giant' ? 20 : 16} className="transition-transform group-hover:translate-x-1" />
    </a>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">

      {/* ─── HEADER ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <LinkIcon size={18} className="text-white -rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">EloBonus</span>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-3">
              <a href="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition">
                Login Lojista
              </a>
              <CTAButton text="Fale com um Especialista" variant="primary" className="!py-2.5 !px-6 !text-sm !shadow-lg" />
            </nav>
            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-in slide-in-from-top">
            <div className="p-4 space-y-3">
              <a href="/login" className="block text-center py-3 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl">Login Lojista</a>
              <CTAButton text="Fale com um Especialista" className="w-full !text-sm" />
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <Sparkles size={16} />
            Plataforma #1 de Cashback para o Varejo
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6">
            Seus clientes compram{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">uma vez</span>
            </span>{' '}
            e desaparecem?{' '}
            <span className="block mt-2 text-slate-500 text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold">
              Transforme visitantes em compradores fiéis.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed mb-10">
            O sistema de Cashback e CRM multi-tenant definitivo para o varejo. Aumente o LTV, recupere clientes inativos e tenha o controle total da sua base na palma da mão.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton text="Quero Fidelizar Clientes" variant="primary" />
            <CTAButton text="Fale com um Especialista" variant="secondary" />
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Shield size={15} className="text-green-500" /> Dados criptografados</span>
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-blue-500" /> Setup em 24h</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-indigo-500" /> Multi-tenant</span>
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO DE DORES ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-semibold mb-5">
              <AlertTriangle size={16} />
              O problema
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              O que acontece quando você{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">não conhece</span>{' '}
              seu cliente?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: TrendingDown,
                color: 'from-red-500 to-rose-600',
                shadow: 'shadow-red-500/20',
                bg: 'bg-red-50',
                title: 'Perda de Faturamento',
                desc: 'Clientes vão para o concorrente por falta de incentivo para voltar. Cada venda perdida é receita que nunca retorna.',
              },
              {
                icon: EyeOff,
                color: 'from-amber-500 to-orange-600',
                shadow: 'shadow-amber-500/20',
                bg: 'bg-amber-50',
                title: 'Marketing às Cegas',
                desc: 'Gastar com anúncios sem saber quem é o melhor cliente. Sem dados, toda campanha é um tiro no escuro.',
              },
              {
                icon: Target,
                color: 'from-slate-600 to-slate-800',
                shadow: 'shadow-slate-500/20',
                bg: 'bg-slate-50',
                title: 'Falta de Retenção',
                desc: 'Nenhum motivo financeiro para o cliente voltar rápido. Sem cashback, a recompra depende apenas da sorte.',
              },
            ].map((card, i) => (
              <div key={i} className={`relative group p-8 rounded-3xl border border-slate-100 ${card.bg} hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg flex items-center justify-center mb-6`}>
                  <card.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── A SOLUÇÃO ELOBONUS ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-5">
              <Zap size={16} />
              A solução
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              A tecnologia das grandes redes,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">agora na sua loja.</span>
            </h2>
          </div>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center mb-6">
                <Gift size={22} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Motor de Cashback Inteligente</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Configure a porcentagem, defina a validade e crie urgência. O cliente recebe um SMS/WhatsApp e volta para resgatar.
              </p>
              <ul className="space-y-3">
                {['Porcentagem configurável por loja', 'Validade que gera urgência', 'Notificação automática via WhatsApp'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 border border-emerald-100">
                <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Cashback configurado</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full">Ativo</span>
                  </div>
                  <div className="text-4xl font-black text-emerald-600">5%</div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-400">Validade: 30 dias · 127 resgates este mês</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div className="order-2 md:order-1 relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
                <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">LC</div>
                    <div>
                      <div className="font-bold text-sm">Loja Central</div>
                      <div className="text-xs text-slate-400">Painel exclusivo</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-blue-700">1.240</div>
                      <div className="text-xs text-slate-500">Clientes</div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-indigo-700">348</div>
                      <div className="text-xs text-slate-500">Resgates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/25 flex items-center justify-center mb-6">
                <LayoutDashboard size={22} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">CRM Multi-Tenant</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Cada loja com seu painel. Gestão completa de pontuação, resgates e histórico de compras.
              </p>
              <ul className="space-y-3">
                {['Um painel por loja, dados isolados', 'Histórico completo de transações', 'Gestão de equipe e permissões'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-600/25 flex items-center justify-center mb-6">
                <BarChart3 size={22} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Métricas que Importam</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Saiba exatamente qual cliente traz mais lucro e quem está prestes a abandonar sua marca.
              </p>
              <ul className="space-y-3">
                {['Ranking de clientes por faturamento', 'Alertas de inatividade', 'Relatórios em tempo real'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={18} className="text-violet-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-violet-100">
                <div className="bg-white rounded-2xl shadow-xl shadow-violet-900/5 p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-500">Taxa de retorno</span>
                    <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                      <ChevronRight size={14} className="rotate-[-90deg]" /> +35%
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-20">
                    {[30, 45, 35, 60, 50, 75, 65, 85, 70, 90, 80, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Últimos 12 meses · tendência crescente</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <CTAButton text="Quero Fidelizar Clientes" variant="primary" />
          </div>
        </div>
      </section>

      {/* ─── PROVA SOCIAL ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-8 backdrop-blur-sm">
                <BarChart3 size={16} />
                Resultado comprovado
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Aumento médio de{' '}
                <span className="text-amber-300">35%</span>{' '}
                na taxa de retorno
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                dos clientes nos primeiros 3 meses. Mais recompra, mais faturamento, mais previsibilidade.
              </p>
              <CTAButton text="Fale com um Especialista" variant="secondary" className="!bg-white !text-blue-700 !border-white/20 hover:!bg-blue-50" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            Pronto para parar de{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">perder vendas?</span>
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
            Converse agora com um especialista e descubra como o EloBonus pode transformar sua base de clientes em receita recorrente.
          </p>
          <CTAButton text="Quero Fidelizar Clientes" variant="giant" />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                <LinkIcon size={14} className="text-white -rotate-45" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">EloBonus</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/login" className="hover:text-white transition">Login Lojista</a>
              <span className="text-slate-700">·</span>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Contato</a>
              <span className="text-slate-700">·</span>
              <span>Termos de Uso</span>
            </div>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} EloBonus. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
