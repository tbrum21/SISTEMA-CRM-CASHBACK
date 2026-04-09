'use client';
import { useState, useEffect } from 'react';
import { Search, Users, AlertTriangle, Wallet, Cake, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDirectory() {
    const [customers, setCustomers] = useState([]);
    const [metrics, setMetrics] = useState({ totalAtivos: 0, emRisco: 0, cashbackPendente: 0, aniversariantesMes: 0 });
    const [search, setSearch] = useState('');
    const [segment, setSegment] = useState('TODOS');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchCustomers = async () => {
             const qs = new URLSearchParams();
             if (debouncedSearch) qs.append('search', debouncedSearch);
             if (segment) qs.append('segment', segment);
             
             try {
                const res = await fetch(`http://localhost:3333/api/customers/burger-master?${qs.toString()}`);
                const data = await res.json();
                if (data.customers) setCustomers(data.customers);
                if (data.metrics) setMetrics(data.metrics);
             } catch (e) {
                 console.error(e);
             }
        };
        fetchCustomers();
    }, [debouncedSearch, segment]);

    const tabs = [
        { id: 'TODOS', label: 'Todos' },
        { id: 'CAMPEAO', label: 'Campeões ⭐' },
        { id: 'EM_RISCO', label: 'Em Risco ⚠️' },
        { id: 'RECORRENTE', label: 'Recorrentes 🔄' },
        { id: 'NOVATO', label: 'Novatos 🆕' },
    ];

    const formatRelativeTime = (dateStr: string) => {
        if (!dateStr) return 'Nunca';
        const days = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
        if (days === 0) return 'Hoje';
        if (days === 1) return 'Ontem';
        return `Há ${days} dias`;
    };

    const StatusBadge = ({ segment }: { segment: string }) => {
        const styles: Record<string, string> = {
            CAMPEAO: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
            EM_RISCO: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
            RECORRENTE: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
            NOVATO: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border-gray-200 dark:border-zinc-700'
        };
        const labels: Record<string, string> = {
            CAMPEAO: 'Campeão', EM_RISCO: 'Em Risco', RECORRENTE: 'Recorrente', NOVATO: 'Novato'
        };
        const s = styles[segment] || styles['NOVATO'];
        return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${s}`}>{labels[segment] || segment}</span>;
    };

    return (
        <div className="w-full pb-20 px-4 transition-colors">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight">Diretório de<br/>Clientes</h1>
                 
                 <div className="relative w-full md:w-[350px]">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
                     <input 
                         type="text"
                         placeholder="Buscar por nome ou telefone..."
                         value={search}
                         onChange={e => setSearch(e.target.value)}
                         className="w-full pl-12 pr-4 py-3.5 bg-white/60 dark:bg-[#1a1a24]/60 backdrop-blur-md border border-white dark:border-white/10 rounded-full text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
                     />
                 </div>
             </div>

             {/* Metric Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                 <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                     <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Users size={20} /></div>
                     <div><p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Ativos</p><p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalAtivos}</p></div>
                 </div>
                 <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                     <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center"><AlertTriangle size={20} /></div>
                     <div><p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Em Risco</p><p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.emRisco}</p></div>
                 </div>
                 <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                     <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Wallet size={20} /></div>
                     <div><p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Cashback</p><p className="text-2xl font-black text-slate-900 dark:text-white">R$ {metrics.cashbackPendente.toFixed(2)}</p></div>
                 </div>
                 <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                     <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center"><Cake size={20} /></div>
                     <div><p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Aniversários</p><p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.aniversariantesMes}</p></div>
                 </div>
             </div>

             {/* Table Container */}
             <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/50 overflow-hidden">
                 
                 {/* Tabs */}
                 <div className="flex items-center gap-2 px-6 pt-6 pb-4 overflow-x-auto border-b border-black/5 dark:border-white/5 no-scrollbar">
                     {tabs.map(t => (
                         <button 
                             key={t.id}
                             onClick={() => setSegment(t.id)}
                             className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${segment === t.id ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md' : 'text-slate-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                         >
                             {t.label}
                         </button>
                     ))}
                 </div>

                 {/* Table */}
                 <div className="w-full overflow-x-auto">
                     <table className="w-full min-w-[800px] text-left border-collapse">
                         <thead>
                             <tr className="border-b border-black/5 dark:border-white/5">
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Cliente</th>
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Última Compra</th>
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">LTV</th>
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Saldo</th>
                                 <th className="px-6 py-4 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-right">Ações</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-black/5 dark:divide-white/5">
                             {customers.map((c: any) => (
                                 <tr key={c.profile_id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                                                 {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                                             </div>
                                             <div>
                                                 <p className="font-bold text-slate-900 dark:text-white text-[15px]">{c.name || 'Cliente Sem Nome'}</p>
                                                 <p className="text-xs text-slate-500 dark:text-zinc-400">{c.phone}</p>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="px-6 py-4"><StatusBadge segment={c.computed_segment} /></td>
                                     <td className="px-6 py-4">
                                         <p className="font-semibold text-slate-700 dark:text-zinc-300 text-[14px]">{formatRelativeTime(c.lastPurchaseAt)}</p>
                                         <p className="text-xs text-slate-400 dark:text-zinc-500">{c.frequency} compras</p>
                                     </td>
                                     <td className="px-6 py-4 font-bold text-slate-700 dark:text-zinc-300">R$ {c.ltv.toFixed(2)}</td>
                                     <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">R$ {c.balance.toFixed(2)}</td>
                                     <td className="px-6 py-4 text-right">
                                         <div className="flex items-center justify-end gap-2">
                                             <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition" title="WhatsApp">
                                                 <MessageCircle size={16} />
                                             </a>
                                             <Link href={`/admin/customer/${c.profile_id}`} className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition" title="Ver Ficha">
                                                 <FileText size={16} />
                                             </Link>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                             {customers.length === 0 && (
                                 <tr>
                                     <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-zinc-400 font-medium">Nenhum cliente encontrado.</td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>
    );
}
