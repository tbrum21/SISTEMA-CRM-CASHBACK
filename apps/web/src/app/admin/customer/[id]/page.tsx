'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, Award, Target, Hash, MessageCircle, BarChart3, ShoppingBag, Gift, Clock, Save, Trash2, CalendarDays, Edit2, X, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function CustomerProfile({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [chartData, setChartData] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', cpf: '', birthDate: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customers/burger-master/${params.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.profile);
      setChartData(data.chartData);
      setTenant(data.tenant);
      if (data.profile) {
          setEditData({
              name: data.profile.customer.name || '',
              phone: data.profile.customer.phone || '',
              cpf: data.profile.customer.cpf || '',
              birthDate: data.profile.customer.birthDate ? new Date(data.profile.customer.birthDate).toISOString().split('T')[0] : ''
          });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    try {
      await fetch(`${API_URL}/api/customers/burger-master/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent, authorName: 'Admin do Sistema' })
      });
      setNoteContent('');
      fetchProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`${API_URL}/api/customers/burger-master/notes/${noteId}`, { method: 'DELETE' });
      fetchProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCustomer = async () => {
      try {
          await fetch(`${API_URL}/api/customers/burger-master/${params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editData)
          });
          setIsEditing(false);
          fetchProfile();
      } catch (e) {
          console.error(e);
      }
  };

  const handleDeleteCustomer = async () => {
      try {
          await fetch(`${API_URL}/api/customers/burger-master/${params.id}`, { method: 'DELETE' });
          router.push('/admin/clientes');
      } catch (e) {
          console.error(e);
      }
  };

  const buildWhatsAppLink = () => {
     if (!tenant || !profile) return `https://wa.me/${profile?.customer?.phone}`;
     let msg = tenant.remarketingTemplate || 'Olá {name}! Sentimos sua falta. Temos um recado pra você!';
     msg = msg.replace('{name}', profile.customer.name || 'amigo(a)').replace('{balance}', profile.balance.toFixed(0) + ' pts');
     return `https://wa.me/${profile.customer.phone}?text=${encodeURIComponent(msg)}`;
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!profile) return <div className="p-10 text-center text-slate-500">Cliente não encontrado.</div>;

  const getSegmentColor = (segment: string) => {
    const map: any = {
      CAMPEAO: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
      EM_RISCO: 'text-red-500 bg-red-100 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
      RECORRENTE: 'text-blue-500 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
      NOVATO: 'text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
    };
    return map[segment] || map['NOVATO'];
  };

  const getTxType = (type: string) => {
    switch(type) {
        case 'EARN': return { icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400' };
        case 'REDEEM': return { icon: Gift, color: 'text-red-500 bg-red-100 dark:bg-red-500/20 dark:text-red-400' };
        case 'MESSAGE': return { icon: MessageCircle, color: 'text-teal-500 bg-teal-100 dark:bg-teal-500/20 dark:text-teal-400' };
        default: return { icon: Clock, color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400' };
    }
  };

  return (
    <div className="w-full pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="flex items-center gap-6 mb-10 px-4">
        <a href="/admin/clientes" className="w-12 h-12 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-white/50 dark:border-white/5">
          <ArrowLeft size={20} />
        </a>
        <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight">
          Ficha do Cliente
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        
        {/* ESQUERDA: DASHBOARD LOGICO (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* KPI Health Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2"><Target size={16} className="text-slate-400 dark:text-zinc-500"/><span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">LTV</span></div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">R$ {profile.lifetimeValue.toFixed(2)}</p>
             </div>
             <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2"><BarChart3 size={16} className="text-slate-400 dark:text-zinc-500"/><span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Ticket M.</span></div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">R$ {(profile.totalTransactions > 0 ? profile.lifetimeValue / profile.totalTransactions : 0).toFixed(2)}</p>
             </div>
             <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2"><Hash size={16} className="text-slate-400 dark:text-zinc-500"/><span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Frequência</span></div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{profile.totalTransactions} <span className="text-sm border-l border-zinc-300 dark:border-zinc-700 pl-2 ml-1 text-slate-500 dark:text-zinc-400 font-medium">compras</span></p>
             </div>
             <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2"><Award size={16} className="text-emerald-500 dark:text-emerald-400"/><span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Saldo</span></div>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{profile.balance.toFixed(0)} pts</p>
             </div>
          </div>

          <div className="flex flex-col gap-8">
              {/* Gráfico Recharts */}
              <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm w-full">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 px-2">Consumo 6 Meses</h3>
                  <div className="w-full h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10}/>
                            <RechartsTooltip 
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
                                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Volume']}
                            />
                            <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={40}>
                                {chartData.map((e, idx) => (
                                    <Cell key={`cell-${idx}`} fill={`url(#colorGradient)`} />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                            </defs>
                         </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Timeline Horizontal */}
              <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm w-full overflow-x-auto no-scrollbar">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 px-2 sticky left-0 z-20">Linha do Tempo</h3>
                  
                  <div className="relative flex items-start gap-6 min-w-max px-4 pb-4 before:absolute before:top-[20px] before:left-0 before:w-full before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-white/10">
                     {profile.transactions.map((tx: any) => {
                         const style = getTxType(tx.type);
                         const Icon = style.icon;
                         return (
                            <div key={tx.id} className="relative flex flex-col items-center w-[180px] shrink-0 group">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0c] relative z-10 shrink-0 ${style.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon size={14} />
                                </div>
                                <div className="mt-4 w-full">
                                   <div className="p-3.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mb-2">
                                          {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </p>
                                      <p className="text-[13px] leading-snug font-bold text-slate-800 dark:text-zinc-200 mb-2 line-clamp-2" title={tx.description}>{tx.description}</p>
                                      {tx.amountPurchase > 0 && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ticket: R$ {tx.amountPurchase.toFixed(2)}</p>}
                                      {(tx.type === 'EARN' || tx.type === 'REDEEM') && <p className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-md ${tx.type === 'EARN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>{tx.type==='EARN'?'+':'-'} {Math.abs(tx.amountPoints).toFixed(0)} pts</p>}
                                   </div>
                                </div>
                            </div>
                         );
                     })}
                     {profile.transactions.length === 0 && <p className="text-center text-sm text-slate-500 pb-8 pt-4 w-full">Nenhuma interação registrada.</p>}
                  </div>
              </div>
          </div>
        </div>

        {/* DIREITA: PERFIL & NOTAS (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Card Perfil Destaque */}
            <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center relative overflow-hidden transition-colors">
                 
                 <div className="absolute top-6 right-6 flex items-center gap-2">
                     <button onClick={() => setIsEditing(true)} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition tooltip-tl">
                        <Edit2 size={16} />
                     </button>
                     <button onClick={() => setIsDeleting(true)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition tooltip-tl">
                        <Trash2 size={16} />
                     </button>
                 </div>

                 <div className="w-[120px] h-[120px] rounded-[1.8rem] bg-indigo-50 mt-2 mb-5 border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden shadow-black/10 flex items-center justify-center text-indigo-300">
                    <User size={64} />
                 </div>
                 
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight text-center">{profile.customer.name || 'Cliente'}</h2>
                 
                 <div className={`mb-6 px-3 py-1 border rounded-full text-xs font-bold ${getSegmentColor(profile.rfmSegment)}`}>
                     {profile.rfmSegment.replace('_', ' ')}
                 </div>

                 <div className="w-full space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
                     <div className="flex items-center gap-3">
                         <Phone size={16} className="text-slate-400 dark:text-zinc-500"/>
                         <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{profile.customer.phone}</span>
                     </div>
                     {profile.customer.cpf && (
                         <div className="flex items-center gap-3">
                             <Mail size={16} className="text-slate-400 dark:text-zinc-500"/>
                             <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{profile.customer.cpf}</span>
                         </div>
                     )}
                     {profile.customer.birthDate && (
                         <div className="flex items-center gap-3">
                             <CalendarDays size={16} className="text-slate-400 dark:text-zinc-500"/>
                             <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{new Date(profile.customer.birthDate).toLocaleDateString()}</span>
                         </div>
                     )}
                 </div>

                 <button 
                     onClick={() => window.open(buildWhatsAppLink(), '_blank')}
                     className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                 >
                     <MessageCircle size={18} /> Impactar via WhatsApp
                 </button>
            </div>

            {/* Notas do Cliente */}
            <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center relative transition-colors flex-1 min-h-[300px]">
                 <div className="w-full flex items-center justify-between mb-4 px-2">
                     <h3 className="font-bold text-slate-800 dark:text-white">Notas Compartilhadas</h3>
                     <span className="bg-black/5 dark:bg-white/10 text-xs font-bold px-2 py-0.5 rounded-full">{profile.notes.length}</span>
                 </div>

                 <div className="w-full relative mb-6">
                     <textarea 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Adicione uma observação sobre o cliente..."
                        className="w-full h-24 bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-zinc-200 resize-none transition-all"
                     />
                     <button 
                        onClick={handleAddNote}
                        disabled={!noteContent.trim()}
                        className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
                     >
                         <Save size={16} />
                     </button>
                 </div>

                 <div className="w-full space-y-3 overflow-y-auto max-h-[250px] no-scrollbar px-1">
                     {profile.notes.map((n: any) => (
                         <div key={n.id} className="p-4 bg-yellow-50 dark:bg-amber-900/10 border border-yellow-200 dark:border-amber-500/20 rounded-2xl group relative">
                             <p className="text-sm text-slate-700 dark:text-zinc-300 pr-6">{n.content}</p>
                             <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">{n.authorName} • {new Date(n.createdAt).toLocaleDateString()}</span>
                                <button onClick={() => handleDeleteNote(n.id)} className="text-red-400 hover:text-red-600 dark:text-red-500/70 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                </button>
                             </div>
                         </div>
                     ))}
                     {profile.notes.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Nenhuma nota cadastrada.</p>}
                 </div>
            </div>

        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#12121a] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Editar Perfil</h3>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Nome Completo</label>
                        <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Telefone (WhatsApp)</label>
                        <input type="text" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">CPF</label>
                        <input type="text" value={editData.cpf} onChange={e => setEditData({...editData, cpf: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Data de Nascimento</label>
                        <input type="date" value={editData.birthDate} onChange={e => setEditData({...editData, birthDate: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 bg-slate-50 dark:bg-white/5">
                    <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 transition">Cancelar</button>
                    <button onClick={handleUpdateCustomer} className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition">Salvar Alterações</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL DE CONFORMAÇÃO DE EXCLUSÃO */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#12121a] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Inativar Cliente?</h3>
                    <p className="text-slate-500 dark:text-zinc-400 mb-8">Esta ação irá ocultar o cliente <strong>{profile.customer.name}</strong> do diretório. O histórico de compras e saldo permanecerão a salvo no banco de dados.</p>
                    
                    <div className="w-full flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setIsDeleting(false)} className="flex-1 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition">Manter Cliente</button>
                        <button onClick={handleDeleteCustomer} className="flex-1 py-3.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition">Sim, Inativar</button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
