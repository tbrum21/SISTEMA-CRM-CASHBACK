'use client';
import { useState, useEffect } from 'react';
import { Wallet, Star, ArrowUpRight, Phone, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

const API = `${API_URL}/api/consumer`;

export default function ClienteCentralPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [phoneInput, setPhoneInput] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('consumer_session');
    if (saved) {
      setSession(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  async function handleLogin() {
    setLoggingIn(true);
    setErrorStatus('');
    try {
      const res = await fetch(`${API}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: phoneInput })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorStatus(data.error || 'Erro ao entrar.');
      } else {
        localStorage.setItem('consumer_session', JSON.stringify(data));
        setSession(data);
      }
    } catch {
      setErrorStatus('Erro de conexão. Tente novamente.');
    }
    setLoggingIn(false);
  }

  function handleLogout() {
    localStorage.removeItem('consumer_session');
    setSession(null);
  }

  if (loading) return null;

  // ═══════════ LAUNCHER O SCREEN (LOGIN) ═══════════
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] bg-white dark:bg-zinc-950 border-[6px] border-slate-200 dark:border-zinc-800 rounded-[3rem] px-8 py-12 relative shadow-2xl overflow-hidden">
          {/* Top Notch UI */}
          <div className="w-24 h-5 bg-slate-200 dark:bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>
          
          <div className="text-center mb-10 mt-6">
             <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
               <Wallet size={32} />
             </div>
             <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Sua Carteira<br/>Digital</h1>
             <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Acesse seus Prêmios e Cashback</p>
          </div>

          <div className="space-y-6">
            <div>
               <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-2 pl-2">Telefone com DDD</label>
               <input type="tel" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="(11) 99999-9999" className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium transition" />
            </div>

            {errorStatus && <p className="text-sm font-bold text-red-500 text-center">{errorStatus}</p>}

            <button onClick={handleLogin} disabled={loggingIn || phoneInput.length < 10} className="w-full py-4 bg-[#121212] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
               {loggingIn ? 'Acessando...' : 'Entrar na Carteira'} <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
    );
  }

  // ═══════════ WALLET DASHBOARD ═══════════
  const totalBalance = session.profiles.reduce((acc: number, p: any) => acc + p.balance, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex justify-center pb-20 p-4">
      <div className="w-full max-w-[380px] bg-white dark:bg-zinc-950 border-[6px] border-slate-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-2xl mt-4 shrink-0 flex flex-col h-[800px] max-h-[90vh]">
        
        {/* Hardware Notch Mock */}
        <div className="w-24 h-5 bg-slate-200 dark:bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20"></div>

        {/* Header Widget */}
        <div className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-800 p-8 pt-16 rounded-b-[2.5rem] relative shrink-0">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner"><User size={20}/></div>
              <div>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-0.5">Olá, bem vindo</p>
                <p className="text-white font-black tracking-tight text-lg leading-none">{session.name || 'Cliente'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs text-white/60 font-bold uppercase tracking-wider hover:text-white transition">Sair</button>
          </div>
          <div className="text-center pb-2">
            <p className="text-indigo-200 text-sm font-semibold mb-1">Saldo unificado em lojas</p>
            <h1 className="text-[3.5rem] leading-none font-bold text-white tracking-tighter mb-2">{totalBalance.toFixed(0)}<span className="text-xl text-indigo-300 font-medium pl-1">pts</span></h1>
          </div>
        </div>

        {/* Content (Stores List) */}
        <div className="px-6 mt-8 flex-1 overflow-y-auto no-scrollbar pb-6 relative">
          <h3 className="text-slate-800 dark:text-zinc-100 font-black text-lg mb-4 tracking-tight">Onde você tem saldo</h3>
          
          {session.profiles.length === 0 ? (
             <div className="text-center py-10 opacity-50">Você ainda não tem saldo em nenhuma loja.</div>
          ) : (
            <div className="space-y-3">
              {session.profiles.map((profile: any, i: number) => {
                 const gradients = ["from-amber-400 to-orange-500", "from-cyan-400 to-blue-600", "from-emerald-400 to-teal-500"];
                 const g = gradients[i % gradients.length];
                 return (
                  <Link href={`/cliente/loja/${profile.tenant.slug}?id=${session.id}`} key={profile.profileId} className="bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] p-4 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-tr ${g} p-[2px] shadow-lg`}>
                        <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center">
                           <Star size={18} className="text-slate-800 dark:text-white" opacity={0.8} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-[15px] tracking-tight">{profile.tenant.name}</h4>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tracking-wide">Saldo: {profile.balance.toFixed(0)} pts</p>
                      </div>
                    </div>
                    <ArrowUpRight size={20} className="text-slate-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors"/>
                  </Link>
                 )
              })}
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  );
}
