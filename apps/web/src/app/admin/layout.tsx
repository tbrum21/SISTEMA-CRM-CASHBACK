'use client';
import { Home, Settings as SettingsIcon, Sun, Moon, Link as LinkIcon, Award, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex w-full min-h-screen p-4 pl-6 gap-8">
      
      {/* Floating Sidebar (Left) */}
      <aside className="w-[68px] my-auto bg-[#171717] dark:bg-[#0a0a0c] border border-transparent dark:border-white/5 rounded-full flex flex-col items-center py-8 gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 h-[340px] sticky top-[calc(50vh-170px)] shrink-0 transition-colors">
        <a href="/admin" title="Visão Geral" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isActive('/admin') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}>
          <Home size={20} />
        </a>
        <a href="/admin/pontuacao" title="Lançar Pontuação" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isActive('/admin/pontuacao') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}>
          <Award size={20} />
        </a>
        <a href="/admin/clientes" title="Diretório de Clientes" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isActive('/admin/clientes') || pathname.includes('/admin/customer/') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}>
          <Users size={20} />
        </a>
        <div className="w-8 h-px bg-zinc-800"></div>
        <a href="/admin/settings" title="Configurações" className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isActive('/admin/settings') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}>
          <SettingsIcon size={20} />
        </a>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-full max-w-[calc(100vw-120px)]">
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-6 px-4 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30">
               <LinkIcon size={16} className="-rotate-45" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-800 dark:text-white transition-colors">EloBonus</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-500 dark:text-zinc-400">
            <a href="/admin" className={`transition ${isActive('/admin') ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}>Visão Geral</a>
            <a href="/admin/pontuacao" className={`transition ${isActive('/admin/pontuacao') ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}>Pontuação</a>
            <a href="/admin/settings" className={`transition ${isActive('/admin/settings') ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}>Configurações</a>
            <a href="/admin/clientes" className="px-5 py-2 bg-[#171717] dark:bg-[#1a1a24] dark:border dark:border-white/10 dark:text-white text-white rounded-full shadow-lg shadow-black/20 transition-colors">Diretório de Clientes</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 dark:border dark:border-white/10 dark:text-zinc-300 backdrop-blur-md flex items-center justify-center shadow-sm text-slate-600 hover:bg-white dark:hover:bg-white/10 transition">
              {isDark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 w-full pt-4">
          {children}
        </div>
      </main>

    </div>
  )
}
