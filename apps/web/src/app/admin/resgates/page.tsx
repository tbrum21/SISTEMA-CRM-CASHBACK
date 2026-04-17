'use client';
import { useState, useEffect } from 'react';
import { PackageOpen, Clock, CheckCircle2, User, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

const formatPhone = (v: string) => { const d = v.replace(/\D/g, '').slice(-11); if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; return v; };

const API = `${API_URL}/api`;

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => { loadQueue(); }, []);

  async function loadQueue(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`${API}/consumer/admin/queue/burger-master`);
      const data = await res.json();
      setQueue(data || []);
    } catch { 
      flash('Erro ao carregar a fila de resgates.'); 
    }
    setLoading(false);
    setRefreshing(false);
  }

  async function fulfillOrder(id: string) {
    if (!confirm('Confirmar a entrega do pedido ao cliente no balcão?')) return;
    
    try {
      await fetch(`${API}/consumer/admin/fulfill/${id}`, { method: 'POST' });
      flash('✅ Prêmio marcado como entregue!');
      loadQueue();
    } catch {
      flash('❌ Erro ao dar baixa.');
    }
  }

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full pb-20 px-4 transition-colors max-w-5xl mx-auto">
      {toast && <div className="fixed top-6 right-6 z-50 bg-[#171717] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-[fadeIn_0.2s_ease-out]">{toast}</div>}

      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin" className="w-10 h-10 bg-white/50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 transition">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Prevenção a Fraudes</span>
      </div>

      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
           <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Fila de Resgates</h1>
           <p className="text-slate-500 dark:text-zinc-400 font-medium">Controle os prêmios resgatados no PWA que estão esperando retirada no balcão.</p>
        </div>
        <button onClick={() => loadQueue(true)} disabled={refreshing} className="px-5 py-3 bg-white/60 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-full font-semibold shadow-sm transition-all flex items-center gap-2 group text-slate-700 dark:text-zinc-300">
           <RefreshCw size={16} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} /> Atualizar Fila
        </button>
      </header>

      {queue.length === 0 ? (
        <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-dashed border-slate-300 dark:border-zinc-700 rounded-[2.5rem] p-16 text-center shadow-sm transition-colors">
          <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} className="text-emerald-500" /></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-200 mb-2">Fila limpa!</h2>
          <p className="text-slate-500 dark:text-zinc-400">Nenhum pedido de resgate pendente no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map((order) => (
             <div key={order.id} className="bg-white/60 dark:bg-[#0a0a0c]/80 backdrop-blur-xl border border-amber-200/50 dark:border-amber-900/30 rounded-[2rem] p-6 shadow-xl shadow-amber-500/5 relative overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                
                <div className="flex items-center justify-between mb-4 mt-2">
                   <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={12} className="animate-pulse" /> Pendente
                   </div>
                   <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
                     {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>

                <div className="flex items-start gap-4 mb-6">
                   <div className="w-14 h-14 bg-amber-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100 dark:border-zinc-700/50">
                      {order.product?.imageUrl ? <img src={order.product.imageUrl} className="w-full h-full object-cover rounded-2xl" /> : <PackageOpen size={24} className="text-amber-500" />}
                   </div>
                   <div>
                      <p className="font-black text-lg text-slate-800 dark:text-zinc-100 leading-tight mb-1">{order.product?.name || 'Produto Removido'}</p>
                      <p className="text-sm font-bold text-amber-600 dark:text-amber-500"><span className="opacity-70 text-xs">Custo:</span> {Math.abs(order.amountPoints)} pts</p>
                   </div>
                </div>

                <div className="bg-white/50 dark:bg-zinc-900/50 rounded-xl p-4 mb-6 border border-white/60 dark:border-white/5 flex-1">
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">Cliente</p>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 text-sm font-semibold">
                         <User size={14} className="text-indigo-400" /> {order.customerProfile?.customer?.name || 'Sem nome'}
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 text-sm font-semibold">
                         <Phone size={14} className="text-emerald-400" /> {formatPhone(order.customerProfile?.customer?.phone || '')}
                      </div>
                   </div>
                </div>

                <button onClick={() => fulfillOrder(order.id)} className="w-full py-3.5 bg-[#121212] dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                   <CheckCircle2 size={18} /> Marcar como Entregue
                </button>
             </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
