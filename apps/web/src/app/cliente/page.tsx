'use client';
import { Wallet, QrCode, ArrowUpRight, History, Star } from 'lucide-react';

export default function ClientePWA() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Mockup do Celular isolado no meio da tela limpa */}
      <div className="w-full max-w-[380px] bg-zinc-950 border-[6px] border-zinc-800 rounded-[3rem] overflow-hidden relative pb-10 ring-1 ring-black/10 my-10 shadow-2xl">
        <div className="w-32 h-6 bg-zinc-950 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2 z-20"></div>

        <div className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-800 p-8 pt-16 rounded-b-[2.5rem] relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white tracking-wider border border-white/20">MA</div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Olá, seja bem vindo</p>
                <p className="text-white font-extrabold tracking-tight text-lg">Marcos Almeida</p>
              </div>
            </div>
          </div>
          <div className="text-center pb-2">
            <p className="text-indigo-200 text-sm font-medium mb-1">Saldo em sua carteira</p>
            <h1 className="text-[3.5rem] leading-none font-extrabold text-white tracking-tighter mb-2">R$ 45<span className="text-2xl text-indigo-200">,00</span></h1>
          </div>
        </div>

        <div className="flex gap-4 px-6 -mt-7 relative z-10">
          <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-[1.5rem] p-5 shadow-2xl flex flex-col items-center gap-3 hover:bg-zinc-800 transition">
            <div className="bg-indigo-500 p-3 rounded-full text-white shadow-lg"><QrCode size={24} /></div>
            <span className="text-xs font-bold tracking-widest uppercase">Resgatar</span>
          </button>
          <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-[1.5rem] p-5 shadow-2xl flex flex-col items-center gap-3 hover:bg-zinc-800 transition">
            <div className="bg-zinc-800 p-3 rounded-full text-zinc-300"><History size={24} /></div>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Extrato</span>
          </button>
        </div>

        <div className="px-6 mt-10">
          <h3 className="text-zinc-100 font-bold text-lg mb-5 tracking-tight">Onde usar</h3>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 flex items-center justify-between mb-4 hover:bg-zinc-800 transition">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-amber-500 to-orange-500 p-[2px]">
                 <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center"><Star size={20} className="text-amber-500" /></div>
               </div>
               <div>
                 <h4 className="font-bold text-white text-md tracking-tight">Burger Master</h4>
                 <p className="text-[13px] font-semibold text-emerald-400 mt-0.5">Saldo: R$ 25,00</p>
               </div>
             </div>
             <ArrowUpRight size={20} className="text-zinc-500"/>
          </div>
          
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 flex items-center justify-between hover:bg-zinc-800 transition">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                 <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center"><Wallet size={20} className="text-cyan-500" /></div>
               </div>
               <div>
                 <h4 className="font-bold text-white text-md tracking-tight">Sneaker Store</h4>
                 <p className="text-[13px] font-semibold text-emerald-400 mt-0.5">Saldo: R$ 20,00</p>
               </div>
             </div>
             <ArrowUpRight size={20} className="text-zinc-500"/>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  );
}
