'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }

      // Store in localStorage
      localStorage.setItem('@elobonus:token', data.token);
      localStorage.setItem('@elobonus:user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'SUPER_ADMIN') {
         router.push('/admin/saas'); // Temporary, or just /admin
      } else {
         router.push('/admin');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0c] flex items-center justify-center p-4 transition-colors relative overflow-hidden">
        
       {/* Background Decors */}
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-400/20 dark:bg-amber-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten"></div>

       <div className="w-full max-w-md relative z-10">
          
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                <Zap size={32} className="text-white fill-white"/>
             </div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">EloBonus Acesso</h1>
             <p className="text-slate-500 dark:text-zinc-400">Insira suas credenciais corporativas</p>
          </div>

          <div className="bg-white/60 dark:bg-[#12121a]/80 backdrop-blur-2xl border border-white/80 dark:border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5">
             <form onSubmit={handleLogin} className="space-y-6">
                
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                        <ShieldCheck size={18} /> {error}
                    </div>
                )}

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">E-mail</label>
                   <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20}/>
                       <input 
                          type="email" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
                          placeholder="seu@email.com.br"
                          required
                       />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Senha</label>
                   <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20}/>
                       <input 
                          type="password" 
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
                          placeholder="••••••••"
                          required
                       />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-95 disabled:opacity-70"
                >
                  {loading ? 'Validando...' : 'Acessar Painel'} <ArrowRight size={18} />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}
