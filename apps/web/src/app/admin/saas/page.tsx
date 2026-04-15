'use client';
import { useState } from 'react';
import { Building2, ShieldCheck, Plus, Store } from 'lucide-react';

export default function SaasDashboard() {
  const [formData, setFormData] = useState({ companyName: '', companySlug: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
              setSuccess(`Empresa ${data.tenant.name} criada com sucesso! O proprietário ${data.user.email} já pode acessar o sistema.`);
              setFormData({ companyName: '', companySlug: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
          } else {
              setError(data.error);
          }
      } catch(err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="w-full pb-20 px-4 transition-colors">
       <header className="mb-8">
         <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Portal<br/>EloBonus SaaS</h1>
         <p className="text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2"><ShieldCheck size={18} className="text-purple-500"/> Visão restrita do Super Administrador</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
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
           
           <div className="space-y-6">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] shadow-xl text-white">
                   <h3 className="text-2xl font-black mb-2">Expansão de Clientes</h3>
                   <p className="text-indigo-100 mb-6">Você está autenticado no Core do SaaS. Lojistas não podem acessar esse painel central.</p>
                   <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/20">
                       <Store size={32} />
                       <div>
                           <div className="text-sm text-indigo-200 font-bold uppercase tracking-wider">Lojas Ativas</div>
                           <div className="text-3xl font-black">2</div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}
