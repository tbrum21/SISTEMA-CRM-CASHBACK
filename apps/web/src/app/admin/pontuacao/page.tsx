'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, DollarSign, Award, AlertTriangle, CheckCircle2, ArrowLeft, User, Phone, CreditCard, Sparkles } from 'lucide-react';

const API = 'http://localhost:3333/api/pos/burger-master';

type Step = 'IDENTIFY' | 'AMOUNT' | 'RESULT';

export default function POSPage() {
  const [step, setStep] = useState<Step>('IDENTIFY');
  
  // Customer
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [existingBalance, setExistingBalance] = useState(0);
  const [searching, setSearching] = useState(false);
  const [customerId, setCustomerId] = useState('');

  // Purchase
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [rules, setRules] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Near-miss popup
  const [showNearMiss, setShowNearMiss] = useState(false);
  const [nearMissGap, setNearMissGap] = useState(0);
  const [nearMissRule, setNearMissRule] = useState('');

  // Result
  const [result, setResult] = useState<any>(null);

  const amountRef = useRef<HTMLInputElement>(null);

  // Load active rules on mount
  useEffect(() => {
    fetch(`${API}/rules`).then(r => r.json()).then(setRules).catch(() => {});
  }, []);

  // ═══════════ PHONE LOOKUP ═══════════
  async function lookupPhone() {
    if (phone.replace(/\D/g, '').length < 10) return;
    setSearching(true);
    try {
      const res = await fetch(`${API}/customer?phone=${phone.replace(/\D/g, '')}`);
      const data = await res.json();
      if (data.found) {
        setIsExisting(true);
        setCustomerName(data.customer.name || '');
        setCustomerCpf(data.customer.cpf || '');
        setCustomerId(data.customer.id);
        setExistingBalance(data.customer.profile?.balance || 0);
      } else {
        setIsExisting(false);
        setCustomerName(''); setCustomerCpf(''); setCustomerId('');
        setExistingBalance(0);
      }
    } catch {}
    setSearching(false);
  }

  function goToAmount() {
    if (!phone) return;
    setStep('AMOUNT');
    setTimeout(() => amountRef.current?.focus(), 100);
  }

  // ═══════════ PURCHASE SUBMISSION ═══════════
  function checkAndSubmit() {
    const amount = Number(purchaseAmount);
    if (!amount || amount <= 0) return;

    // Check near-miss: if purchase is below minPurchase but close (within 20% or R$5)
    for (const rule of rules) {
      if (rule.minPurchase && amount < rule.minPurchase) {
        const gap = rule.minPurchase - amount;
        const threshold = Math.min(rule.minPurchase * 0.2, 5);
        if (gap <= threshold) {
          setNearMissGap(gap);
          setNearMissRule(rule.name);
          setShowNearMiss(true);
          return;
        }
      }
    }

    doSubmit();
  }

  async function doSubmit() {
    setShowNearMiss(false);
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          name: customerName || undefined,
          cpf: customerCpf || undefined,
          purchaseAmount: Number(purchaseAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setStep('RESULT');
      }
    } catch {}
    setSubmitting(false);
  }

  function resetAll() {
    setStep('IDENTIFY');
    setPhone(''); setCustomerName(''); setCustomerCpf('');
    setIsExisting(false); setExistingBalance(0); setCustomerId('');
    setPurchaseAmount(''); setResult(null);
    setShowNearMiss(false);
  }

  // ═══════════ PHONE MASK ═══════════
  function formatPhone(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return (
    <div className="w-full pb-20 px-4 transition-colors">
      <header className="mb-10">
        <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Lançamento<br/>de Pontuação</h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Frente de Caixa — Registre compras e pontue clientes.</p>
      </header>

      {/* ═══════════ STEP 1: IDENTIFY CUSTOMER ═══════════ */}
      {step === 'IDENTIFY' && (
        <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-colors max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-indigo-600/20"><Search size={20} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Identificar Cliente</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Digite o telefone para buscar ou cadastrar</p>
            </div>
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-2"><Phone size={14} /> Telefone do Cliente</label>
            <div className="flex gap-3">
              <input value={phone} onChange={e => { setPhone(formatPhone(e.target.value)); setIsExisting(false); }} placeholder="(11) 99999-9999" className="flex-1 bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-xl px-4 py-4 text-slate-800 dark:text-zinc-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
              <button onClick={lookupPhone} disabled={phone.replace(/\D/g, '').length < 10 || searching} className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 flex items-center gap-2">
                <Search size={18} /> {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Existing customer banner */}
          {isExisting && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 mb-6 flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-10 h-10 bg-emerald-500 rounded-full text-white flex items-center justify-center"><CheckCircle2 size={20} /></div>
              <div className="flex-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300">Cliente encontrado!</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{customerName || 'Sem nome'} · Saldo: <strong>R$ {existingBalance.toFixed(2)}</strong></p>
              </div>
            </div>
          )}

          {/* Name and CPF fields */}
          {(phone.replace(/\D/g, '').length >= 10) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-2"><User size={14} /> Nome</label>
                <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nome do cliente" className="w-full bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-2"><CreditCard size={14} /> CPF (opcional)</label>
                <input value={customerCpf} onChange={e => setCustomerCpf(e.target.value)} placeholder="000.000.000-00" className="w-full bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
              </div>
            </div>
          )}

          <button onClick={goToAmount} disabled={!phone || phone.replace(/\D/g, '').length < 10} className="w-full py-4 bg-[#121212] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3">
            <DollarSign size={20} /> Registrar Compra
          </button>
        </section>
      )}

      {/* ═══════════ STEP 2: PURCHASE AMOUNT ═══════════ */}
      {step === 'AMOUNT' && (
        <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-colors max-w-2xl mx-auto">
          <button onClick={() => setStep('IDENTIFY')} className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white text-sm font-semibold mb-6 transition">
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><DollarSign size={20} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Valor da Compra</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Cliente: <strong>{customerName || phone}</strong></p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">Valor Total (R$)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-zinc-500">R$</span>
              <input ref={amountRef} type="number" value={purchaseAmount} onChange={e => setPurchaseAmount(e.target.value)} placeholder="0,00" className="w-full bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-2xl pl-16 pr-6 py-6 text-slate-800 dark:text-zinc-200 text-4xl font-black text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>
          </div>

          {/* Show active rules info */}
          {rules.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl p-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Regras Ativas</p>
              {rules.map((r: any) => (
                <p key={r.id} className="text-sm text-amber-800 dark:text-amber-300">
                  • {r.name}: {r.type === 'PERCENTAGE' ? `${r.value}%` : r.type === 'CONVERSION' ? `A cada R$ ${r.value} = 1 pt` : `R$ ${r.value} fixo`}
                  {r.minPurchase && ` (mín R$ ${r.minPurchase})`}
                </p>
              ))}
            </div>
          )}

          <button onClick={checkAndSubmit} disabled={!purchaseAmount || Number(purchaseAmount) <= 0 || submitting} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3">
            <Award size={20} /> {submitting ? 'Processando...' : 'Finalizar e Pontuar'}
          </button>
        </section>
      )}

      {/* ═══════════ STEP 3: RESULT ═══════════ */}
      {step === 'RESULT' && result && (
        <section className="max-w-2xl mx-auto text-center animate-[fadeIn_0.4s_ease-out]">
          <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-colors">
            
            <div className="w-20 h-20 bg-emerald-500 rounded-full text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30 animate-[bounce_1s_ease-in-out]">
              <CheckCircle2 size={40} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Compra Registrada!</h2>
            <p className="text-slate-500 dark:text-zinc-400 mb-8">Pontuação aplicada com sucesso para <strong className="text-slate-800 dark:text-zinc-200">{result.customerName}</strong></p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-600/20">
                <div className="flex items-center justify-center gap-2 mb-2"><Sparkles size={18} /></div>
                <p className="text-[2.5rem] font-black leading-none mb-1">{result.pointsEarned}</p>
                <p className="text-sm font-semibold text-indigo-200">Pontos ganhos</p>
              </div>
              <div className="bg-[#121212] dark:bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl shadow-black/20 border border-transparent dark:border-zinc-800">
                <div className="flex items-center justify-center gap-2 mb-2"><Award size={18} /></div>
                <p className="text-[2.5rem] font-black leading-none mb-1">{result.totalBalance.toFixed(0)}</p>
                <p className="text-sm font-semibold text-zinc-400">Saldo total</p>
              </div>
            </div>

            {result.pointsEarned === 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 mb-6 text-amber-800 dark:text-amber-300 text-sm font-semibold">
                ⚠️ O valor da compra não atingiu o mínimo para pontuação, mas foi registrada no histórico.
              </div>
            )}

            <button onClick={resetAll} className="w-full py-4 bg-[#121212] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3">
              Nova Venda
            </button>
          </div>
        </section>
      )}

      {/* ═══════════ NEAR-MISS POPUP ═══════════ */}
      {showNearMiss && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/80 dark:border-zinc-800 animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Quase lá!</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Falta apenas <strong className="text-amber-600 dark:text-amber-400">R$ {nearMissGap.toFixed(2)}</strong> para este cliente pontuar na regra <strong>"{nearMissRule}"</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowNearMiss(false); amountRef.current?.focus(); }} className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95">
                Alterar Valor
              </button>
              <button onClick={doSubmit} className="flex-1 py-3.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-zinc-700 transition-all hover:scale-[1.02] active:scale-95">
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
