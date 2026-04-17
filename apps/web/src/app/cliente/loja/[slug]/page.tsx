'use client';
import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Package, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '@/lib/api';

const API = `${API_URL}/api/consumer`;

function LojaContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState('');
  
  // Redeem state
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
        setErrorStatus('Sessão inválida.');
        setLoading(false);
        return;
    }
    loadData();
  }, [slug, customerId]);

  async function loadData() {
    try {
      const res = await fetch(`${API}/wallet/${slug}/${customerId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro na loja.');
      setData(json);
    } catch (e: any) {
      setErrorStatus(e.message);
    }
    setLoading(false);
  }

  async function handleRedeem(productId: string) {
    if (!confirm('Deseja realmente resgatar este produto? Seus pontos serão deduzidos e o lojista será notificado.')) return;
    
    setRedeeming(productId);
    try {
       const res = await fetch(`${API}/redeem`, {
           method: 'POST', headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ tenantSlug: slug, customerId, productId })
       });
       const json = await res.json();
       if (!res.ok) {
           alert(json.error || 'Erro ao resgatar.');
       } else {
           alert('Pedido Enviado! Dirija-se ao balcão para retirar seu produto.');
           loadData(); // recarrega a tela para deduzir o saldo e mostrar na fila
       }
    } catch(e) {
       alert('Erro de conexão ao resgatar.');
    }
    setRedeeming(null);
  }

  if (loading) return <div className="text-center p-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  if (errorStatus) return <div className="p-8 text-center text-red-500 font-bold">{errorStatus}</div>;

  return (
    <>
      {/* HEADER WIDGET */}
      <div className="bg-gradient-to-br from-[#121212] to-zinc-900 border-b border-white/5 p-8 pt-12 pb-10 rounded-b-[2.5rem] relative shrink-0">
        <div className="flex items-center gap-4 mb-6">
           <Link href="/cliente" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"><ArrowLeft size={16} /></Link>
           <h2 className="text-white font-bold text-lg">{data.tenantName}</h2>
        </div>
        
        <div className="text-center">
          <p className="text-zinc-400 text-sm font-semibold mb-1 uppercase tracking-widest">Saldo Disponível</p>
          <div className="flex items-center justify-center gap-2">
             <Sparkles className="text-amber-400" size={24} />
             <h1 className="text-[3.5rem] leading-none font-black text-white tracking-tighter">
                {data.balance.toFixed(0)}<span className="text-xl text-zinc-400 font-medium pl-1">pts</span>
             </h1>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 flex-1 overflow-y-auto no-scrollbar pb-6 relative">
          
        {/* PENDING QUEUE ALERT */}
        {data.pendingRedemptions && data.pendingRedemptions.length > 0 && (
           <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40 rounded-[1.5rem] p-4 mb-6 animate-[slideUp_0.3s_ease-out]">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                 <Clock size={16} className="animate-pulse" /> <span className="text-xs font-bold uppercase tracking-wider">Aguardando no balcão</span>
              </div>
              <div className="space-y-2">
                 {data.pendingRedemptions.map((tx: any) => (
                    <div key={tx.id} className="text-sm font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/50 px-3 py-2 rounded-xl flex items-center justify-between">
                       <span>{tx.product?.name || 'Prêmio'}</span>
                       <span className="opacity-70 text-xs">Preparando...</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <h3 className="text-slate-800 dark:text-zinc-100 font-black text-lg mb-4 tracking-tight flex items-center gap-2">
            Vitrine de Prêmios <span className="text-xs font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 px-2 py-0.5 rounded-md">{data.products.length}</span>
        </h3>

        {data.products.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-sm">Esta loja ainda não disponibilizou prêmios para o Clube.</div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {data.products.map((p: any) => {
                    const canAfford = data.balance >= p.costInPoints;
                    const isRedeeming = redeeming === p.id;
                    
                    return (
                        <div key={p.id} className={`bg-white dark:bg-zinc-900 border ${canAfford ? 'border-amber-200 dark:border-amber-900/40 shadow-xl shadow-amber-500/5' : 'border-slate-100 dark:border-zinc-800 shadow-sm opacity-80 grayscale-[40%]'} rounded-[1.5rem] overflow-hidden flex flex-col`}>
                            {p.imageUrl && (
                                <div className="h-32 w-full bg-slate-100 dark:bg-zinc-800 relative">
                                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                                    {canAfford && <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 flex flex-col">Disponível</div>}
                                </div>
                            )}
                            
                            <div className="p-4 flex-1 flex flex-col">
                                {!p.imageUrl && canAfford && <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 w-max text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 flex items-center gap-1"><CheckCircle2 size={12}/> Pode resgatar</div>}
                                
                                <h4 className="font-black text-lg text-slate-800 dark:text-white leading-tight mb-1">{p.name}</h4>
                                <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 mb-3">{p.description}</p>
                                
                                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                    <p className="font-bold text-amber-600 dark:text-amber-500">{p.costInPoints} pts</p>
                                    
                                    <button 
                                      onClick={() => handleRedeem(p.id)} 
                                      disabled={!canAfford || (redeeming !== null)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20 hover:-translate-y-0.5' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed'}`}
                                    >
                                        {isRedeeming ? 'Processando...' : canAfford ? 'Resgatar' : 'Faltam Pontos'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
      </div>
    </>
  )
}

export default function LojaPWA({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex justify-center pb-20 p-4">
      <div className="w-full max-w-[380px] bg-white dark:bg-zinc-950 border-[6px] border-slate-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-2xl mt-4 shrink-0 flex flex-col h-[800px] max-h-[90vh]">
        
        {/* Hardware Notch Mock */}
        <div className="w-24 h-5 bg-slate-200 dark:bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20"></div>

        <Suspense fallback={<div className="p-10 text-center">Carregando loja...</div>}>
           <LojaContent slug={params.slug} />
        </Suspense>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  );
}
