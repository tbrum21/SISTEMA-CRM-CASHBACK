'use client';
import { useState, useEffect } from 'react';
import { Users2, Shield, Plus, X, Trash2, Mail, Edit2 } from 'lucide-react';

export default function UsersManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'OPERATOR' });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('@elobonus:token');
            const res = await fetch('http://localhost:3333/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('@elobonus:token');
            const res = await fetch('http://localhost:3333/api/users', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ name: '', email: '', password: '', role: 'OPERATOR' });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const roleColors: Record<string, string> = {
        SUPER_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
        OWNER: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        MANAGER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        OPERATOR: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
    };

    return (
        <div className="w-full pb-20 px-4 transition-colors">
             <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Equipe de<br/>Operação</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Controle os acessos ao sistema e defina as restrições</p>
                 </div>
                 <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
                     <Plus size={20} /> Cadastrar Colaborador
                 </button>
             </header>

             <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                 {loading ? (
                     <div className="h-40 flex items-center justify-center">
                         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                 ) : (
                     <div className="w-full overflow-x-auto no-scrollbar">
                         <table className="w-full min-w-[700px] text-left border-collapse">
                             <thead>
                                <tr className="border-b border-black/5 dark:border-white/5">
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Cargo / Credencial</th>
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Acesso</th>
                                    <th className="px-4 py-3 text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-right">Ação</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">{u.name.charAt(0).toUpperCase()}</div>
                                                 <div>
                                                     <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                                                     <p className="text-xs text-slate-500">{u.email}</p>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[u.role] || roleColors['OPERATOR']}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-zinc-400">
                                            Desde {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="p-2 bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 rounded-xl hover:bg-slate-100 transition inline-flex mr-2"><Edit2 size={16}/></button>
                                            <button className="p-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 transition inline-flex"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>

             {/* MODAL DE CRIAÇÃO */}
             {showModal && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#12121a] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Novo Colaborador</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Nome do Funcionário</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">E-mail de Acesso</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Senha Temporária</label>
                                    <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">Nível de Acesso (Cargo)</label>
                                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white appearance-none">
                                        <option value="OPERATOR">Operador (Caixa) - Lançamento Apenas</option>
                                        <option value="MANAGER">Gerente - Visão Completa</option>
                                        <option value="OWNER">Fundador / Administrador</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 bg-slate-50 dark:bg-white/5">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 transition">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition">Finalizar Cadastro</button>
                            </div>
                        </form>
                    </div>
                 </div>
             )}
        </div>
    );
}
