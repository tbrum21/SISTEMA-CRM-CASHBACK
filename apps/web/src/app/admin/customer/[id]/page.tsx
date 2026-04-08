'use client';
import { ArrowLeft, BarChart3, Users, Calendar, MoreHorizontal, Copy, Share2, Mail, Phone, Clock, Plus, Tag } from 'lucide-react';

export default function CustomerProfile() {
  return (
    <div className="w-full pb-20 transition-colors">
      {/* Header Info */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-10 px-4">
        <div className="flex items-center gap-6">
          <a href="/admin" className="w-12 h-12 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-white/10 transition shadow-sm border border-white/50 dark:border-white/5">
            <ArrowLeft size={20} />
          </a>
          <div>
             <h1 className="text-[2.75rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight transition-colors">Ficha de<br/>Cliente</h1>
          </div>
        </div>

        <div className="flex items-center gap-10 bg-white/20 dark:bg-[#0a0a0c]/60 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-full px-8 py-4 shadow-sm transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center shadow-sm"><BarChart3 size={20} className="text-slate-600 dark:text-zinc-300"/></div>
             <div>
               <p className="text-xl font-bold text-slate-900 dark:text-white">R$ 1.980 <span className="ml-2 text-[10px] bg-yellow-300 dark:bg-amber-500/20 dark:text-amber-300 text-black px-2 py-0.5 rounded-full font-bold">+11% s/m</span></p>
               <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium tracking-wide mt-0.5">Retorno de LTV (Life-time)</p>
             </div>
          </div>
          <div className="w-px h-10 bg-black/10 dark:bg-white/10"></div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center shadow-sm"><Users size={20} className="text-slate-600 dark:text-zinc-300"/></div>
             <div>
               <p className="text-xl font-bold text-slate-900 dark:text-white">7 <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">Recorrente</span></p>
               <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium tracking-wide mt-0.5">Visitas na Loja</p>
             </div>
          </div>
          <div className="w-px h-10 bg-black/10 dark:bg-white/10"></div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center shadow-sm"><Tag size={20} className="text-slate-600 dark:text-zinc-300"/></div>
             <div>
               <p className="text-xl font-bold text-slate-900 dark:text-white">R$ 45 <span className="ml-2 text-[10px] bg-[#dcfce7] dark:bg-emerald-500/20 text-[#166534] dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">1 expirando</span></p>
               <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium tracking-wide mt-0.5">Saldo em Cashback</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        
        {/* Left Area */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Interaction History Panel */}
           <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-3xl border border-white/60 dark:border-white/5 p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/50 transition-colors">
             <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Linha do Tempo LTV</h3>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-slate-400 dark:text-zinc-300 dark:hover:bg-white/10"><MoreHorizontal size={14}/></button>
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-slate-400 dark:text-zinc-300 dark:hover:bg-white/10"><ArrowLeft size={14} className="rotate-45"/></button>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               {/* Blue Card */}
               <div className="bg-[#2563eb] text-white p-6 rounded-[2rem] flex flex-col justify-between h-[230px] shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-transform">
                 <div className="flex justify-between items-start">
                   <div className="bg-white/20 px-3 py-1.5 text-[11px] rounded-full font-bold uppercase tracking-wider">Última Compra</div>
                   <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition"><MoreHorizontal size={16}/></button>
                 </div>
                 <div>
                   <p className="font-semibold text-lg leading-tight mb-4 pr-10">Cashback Acumulado Automático</p>
                   <div className="flex justify-between items-end">
                     <p className="text-[1.75rem] font-extrabold tracking-tight">+ R$ 25,00</p>
                     <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-[#2563eb] overflow-hidden"><img src="https://i.pravatar.cc/100?img=5"/></div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Teal Card */}
               <div className="bg-[#38b2ac] text-white p-6 rounded-[2rem] flex flex-col justify-between h-[230px] shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-transform">
                 <div className="flex justify-between items-start">
                   <div className="bg-white/20 px-3 py-1.5 text-[11px] rounded-full font-bold uppercase tracking-wider">Mensagem Ativa</div>
                   <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition"><MoreHorizontal size={16}/></button>
                 </div>
                 <div>
                   <p className="font-semibold text-lg leading-tight mb-4 pr-10">Aviso de Saldo WhatsApp</p>
                   <div className="flex justify-between items-end">
                     <p className="text-[1.6rem] font-extrabold tracking-tight">Sucesso 👀</p>
                     <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-[#38b2ac] overflow-hidden"><ArrowLeft size={12} className="rotate-45" /></div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Black Card */}
               <div className="bg-[#0f172a] dark:bg-black border border-transparent dark:border-white/10 text-white p-6 rounded-[2rem] flex flex-col justify-between h-[230px] shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform relative overflow-hidden">
                 <div className="absolute top-5 right-5 w-8 h-8 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-black dark:text-white shadow-lg cursor-pointer hover:scale-110 transition">
                   <ArrowLeft size={16} className="rotate-45" />
                 </div>
                 <div className="flex justify-between items-start">
                   <div className="bg-white/20 px-3 py-1.5 text-[11px] rounded-full font-bold uppercase tracking-wider">Resgate</div>
                 </div>
                 <div className="mt-8">
                   <p className="font-semibold text-lg leading-tight mb-4 pr-10">Bônus utilizado no Caixa</p>
                   <div className="flex justify-between items-end">
                     <p className="text-[1.75rem] font-extrabold tracking-tight text-red-400">- R$ 15,00</p>
                     <div className="flex -space-x-2">
                     </div>
                   </div>
                 </div>
               </div>

               {/* Yellow Card */}
               <div className="bg-[#fde047] dark:bg-amber-400 text-slate-900 p-6 rounded-[2rem] flex flex-col justify-between h-[230px] shadow-xl shadow-yellow-500/20 dark:shadow-amber-500/10 hover:scale-[1.02] transition-transform">
                 <div className="flex justify-between items-start">
                   <div className="bg-black/10 px-3 py-1.5 text-[11px] rounded-full font-bold uppercase tracking-wider">Promoção</div>
                   <button className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10 transition"><MoreHorizontal size={16}/></button>
                 </div>
                 <div>
                   <p className="font-semibold text-lg leading-tight mb-4 pr-10">Bônus de Aniversário (Setup)</p>
                   <div className="flex justify-between items-end">
                     <p className="text-[1.75rem] font-extrabold tracking-tight">+ R$ 50,00</p>
                   </div>
                 </div>
               </div>
               
               {/* Empty White/Glass Cards */}
               <div className="bg-white/50 dark:bg-white/5 border border-white/60 dark:border-transparent p-6 rounded-[2rem] flex flex-col justify-between h-[230px] shadow-sm hover:bg-white/70 dark:hover:bg-white/10 transition">
                  <div className="flex justify-between items-start">
                   <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold px-2 py-1">Setembro</div>
                   <button className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm text-slate-400 dark:text-zinc-500"><MoreHorizontal size={16}/></button>
                 </div>
                 <div>
                    <p className="font-semibold text-lg leading-tight mb-4 text-slate-700 dark:text-zinc-300 pr-10">Compra PDV Integrada</p>
                    <div className="flex justify-between items-end">
                     <p className="text-[1.75rem] font-bold tracking-tight text-emerald-500">R$ 150,00</p>
                   </div>
                 </div>
               </div>

             </div>
           </div>
        </div>

        {/* Right Area */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Profile Block */}
           <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center relative overflow-hidden transition-colors">
             
             {/* Top Quick Actions */}
             <div className="w-full flex justify-between absolute top-6 px-6">
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-black dark:hover:text-white"><Share2 size={14}/></button>
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-black dark:hover:text-white"><ArrowLeft size={14} className="-rotate-45"/></button>
                </div>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-black dark:hover:text-white"><MoreHorizontal size={14}/></button>
                </div>
             </div>

             <div className="w-[120px] h-[120px] rounded-[1.8rem] bg-indigo-50 mt-4 mb-6 border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden shadow-black/10">
                <img src="https://i.pravatar.cc/250?img=5" alt="Carlos" className="w-full h-full object-cover" />
             </div>
             
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Carlos Azevedo</h2>
             <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium text-center mb-8 px-4 leading-relaxed">Cliente VIP EloBonus<br/>Segmentação: Campeão</p>

             {/* Bottom Contact Actions */}
             <div className="flex items-center bg-white/60 dark:bg-white/5 backdrop-blur rounded-2xl p-2 w-full justify-between shadow-sm">
               <button className="flex-1 py-1.5 flex justify-center text-slate-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"><Copy size={16}/></button>
               <button className="flex-1 py-1.5 flex justify-center text-emerald-500 hover:text-emerald-600 transition"><Phone size={16}/></button>
               <button className="flex-1 py-1.5 flex justify-center text-slate-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"><Clock size={16}/></button>
             </div>
           </div>

           {/* Detailed Information */}
           <div className="bg-white/40 dark:bg-[#0a0a0c]/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm transition-colors">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-[1.1rem] font-bold text-slate-800 dark:text-white">Ficha Cadastral (LTV)</h3>
               <div className="flex gap-2">
                 <button className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-black dark:hover:text-white"><ArrowLeft size={14} className="rotate-45"/></button>
               </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users size={20} className="text-slate-400 dark:text-zinc-500 mt-1 shrink-0"/>
                  <div className="flex-1 flex justify-between border-b border-black/5 dark:border-white/10 pb-5">
                    <div><p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold mb-1">Nome Completo</p><p className="font-semibold text-slate-800 dark:text-zinc-200">Carlos</p></div>
                    <div className="mr-8"><p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold mb-1">Sobrenome</p><p className="font-semibold text-slate-800 dark:text-zinc-200">Azevedo</p></div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={20} className="text-slate-400 dark:text-zinc-500 mt-1 shrink-0"/>
                  <div className="flex-1 border-b border-black/5 dark:border-white/10 pb-5 flex justify-between items-center">
                    <div className="overflow-hidden">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold mb-1">Conta EloBonus</p>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200 truncate mr-2">123.456.789-00</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={20} className="text-slate-400 dark:text-zinc-500 mt-1 shrink-0"/>
                  <div className="flex-1 border-b border-black/5 dark:border-white/10 pb-5 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold mb-1">Número WhatsApp</p>
                      <p className="font-semibold text-slate-800 dark:text-zinc-200">+55 11 9999-9999</p>
                    </div>
                    <button className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm"><Phone size={12}/></button>
                  </div>
                </div>
             </div>

           </div>

        </div>

      </div>
    </div>
  );
}
