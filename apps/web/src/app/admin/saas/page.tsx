'use client';
import { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Plus, Store, Users, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SaasDashboard() {
  const [formData, setFormData] = useState({ companyName: '', companySlug: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('@elobonus:user');
    if (!userStr) {
       router.replace('/login');
       return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'SUPER_ADMIN') {
       router.replace('/admin');
       return;
    }
    setAuthChecking(false);
    fetchTenants();
  }, [router]);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('@elobonus:token');
      const res = await fetch('http://localhost:3333/api/saas/companies', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
          const data = await res.json();
          setTenants(data.tenants || []);
      }
    } catch(e) {
        console.error('Erro ao buscar tenants', e);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');
      try {
          const token = localStorage.getItem('@elobonus:token');
          const res = await fetch('http://localhost:3333/api/saas/companies', {
              method: 'POST',
              headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json' 
              },
              body: JSON.stringify(formData)
          });
          const data = await res.json();
          if (res.ok) {
              setSuccess(`Empresa ${data.tenant.name} criada com sucesso!`);
              setFormData({ companyName: '', companySlug: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
              fetchTenants();
          } else {
              setError(data.error);
          }
      } catch(err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  if (authChecking) return <div className="h-screen flex items-center justify-center p-10"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full pb-20 px-4 transition-colors">
       <header className="mb-8">
         <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Portal<br/>EloBonus SaaS</h1>
         <p className="text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2"><ShieldCheck size={18} className="text-purple-500"/> Visão restrita do Super Administrador</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* CREATE COMPANY (Col-5) */}
           <div className="lg:col-span-5 bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
               <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                       <Building2 size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">Criar Nova Empresa (Tenant)</h3>
               </div>
               
               {success && <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-sm">{success}</div>}
               {error && <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-medium text-sm">{error}</div>}

               <form onSubmit={handleCreateCompany} className="space-y-4">
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Nome da Empresa</label>
                       <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white" placeholder="Ex: Padaria do João"/>
                   </div>
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Slug (URL de Sistema)</label>
                       <input required type="text" value={formData.companySlug} onChange={e => setFormData({...formData, companySlug: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white" placeholder="ex: padaria-do-joao"/>
                   </div>

                   <hr className="border-black/5 dark:border-white/5 my-6"/>

                   <h4 className="font-bold text-slate-700 dark:text-white mb-4">Acesso Proprietário</h4>

                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Nome do Sócio/Proprietário</label>
                       <input required type="text" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"/>
                   </div>
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">E-mail de Login Base</label>
                       <input required type="email" value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"/>
                   </div>
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Senha Inicial Temporária</label>
                       <input required type="text" value={formData.ownerPassword} onChange={e => setFormData({...formData, ownerPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"/>
                   </div>

                   <button type="submit" disabled={loading} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95 disabled:opacity-70">
                       <Plus size={20} /> Cadastrar e Provisionar Tenant
                   </button>
               </form>
           </div>
           
           {/* TENANTS LIST (Col-7) */}
           <div className="lg:col-span-7 space-y-6">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                       <h3 className="text-2xl font-black mb-2">Expansão de Clientes</h3>
                       <p className="text-indigo-100 mb-0">Você está autenticado no Core do SaaS.</p>
                   </div>
                   <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/20">
                       <Store size={32} />
                       <div>
                           <div className="text-sm text-indigo-200 font-bold uppercase tracking-wider">Lojas Ativas</div>
                           <div className="text-3xl font-black">{tenants.length}</div>
                       </div>
                   </div>
               </div>

               <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Empresas e Sócios</h3>
                    
                    <div className="w-full overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Empresa (Tenant)</th>
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Membros</th>
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-center">Carteira</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                {tenants.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-slate-900 dark:text-white text-[15px]">{t.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1"><FileText size={12}/>{t.slug}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {t.users.map((u: any) => (
                                                <div key={u.id} className="mb-1">
                                                    <p className="text-[13px] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                                        <ShieldCheck size={12} className={u.role === 'SUPER_ADMIN' ? 'text-purple-500' : 'text-blue-500'}/> {u.name || u.email}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">{u.email}</p>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold text-sm rounded-full">
                                                <Users size={14} /> {t.customerCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {tenants.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Nenhum Tenant registrado na rede ainda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
}
