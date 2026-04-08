'use client';
import { Search, Share2, Upload, Star, Plus, Shield, Layout, PenTool, Database, Bell, UserCircle, Link as LinkIcon, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sincroniza com a classe nativa do Tailwind
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <div className="flex w-full min-h-screen p-4 pl-6 gap-8">
      
      {/* Floating Sidebar (Left) */}
      <aside className="w-[68px] my-auto bg-[#171717] dark:bg-[#0a0a0c] border border-transparent dark:border-white/5 rounded-full flex flex-col items-center py-8 gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 h-[80vh] sticky top-10 shrink-0 transition-colors">
        <button className="text-zinc-500 hover:text-white transition"><Search size={22} /></button>
        <button className="text-zinc-500 hover:text-white transition"><Share2 size={22} /></button>
        <button className="text-zinc-500 hover:text-white transition"><Upload size={22} /></button>
        <div className="w-8 h-px bg-zinc-800 my-2"></div>
        <button className="text-zinc-500 hover:text-white transition"><Star size={22} /></button>
        <button className="text-zinc-500 hover:text-white transition"><Plus size={22} /></button>
        <button className="text-zinc-500 hover:text-white transition"><Shield size={22} /></button>
        <button className="text-zinc-500 hover:text-white transition"><Layout size={22} /></button>
        <div className="mt-auto flex flex-col gap-6">
          <button className="text-zinc-500 hover:text-white transition"><PenTool size={22} /></button>
          <button className="text-zinc-500 hover:text-white transition"><Database size={22} /></button>
        </div>
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
            <a href="/admin" className="hover:text-black dark:hover:text-white transition">Visão Geral</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Gestão</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Integrações Omnichannel</a>
            <a href="/admin/customer/123" className="px-5 py-2 bg-[#171717] dark:bg-[#1a1a24] dark:border dark:border-white/10 dark:text-white text-white rounded-full shadow-lg shadow-black/20 transition-colors">Diretório de Clientes</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 dark:border dark:border-white/10 dark:text-zinc-300 backdrop-blur-md flex items-center justify-center shadow-sm text-slate-600 hover:bg-white dark:hover:bg-white/10 transition">
              {isDark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 dark:border dark:border-white/10 dark:text-zinc-300 backdrop-blur-md flex items-center justify-center shadow-sm text-slate-600 hover:bg-white dark:hover:bg-white/10 transition"><Bell size={18} /></button>
            <div className="w-10 h-10 rounded-full bg-[#171717] dark:bg-indigo-600 shadow-lg dark:shadow-indigo-600/20 flex items-center justify-center text-white cursor-pointer transition-colors"><UserCircle size={22}/></div>
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
