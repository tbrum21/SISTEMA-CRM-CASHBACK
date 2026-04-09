'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Wallet, Zap, ArrowUpRight, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [kpis, setKpis] = useState({ receitaBase: 0, fidelizados: 0, ticketMedio: 0 });
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:3333/api/dashboard/burger-master')
      .then(res => res.json())
      .then(res => {
         if (res.kpis) setKpis(res.kpis);
         if (res.chartData) setChartData(res.chartData);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full pb-20 px-4 transition-colors">
      <header className="mb-8">
        <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Visão<br/>Estratégica</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Faturamento (Cashback)" value={`R$ ${kpis.receitaBase.toFixed(2)}`} icon={<TrendingUp size={20} />} trend="+14% mensal" color="blue" />
        <KPICard title="Base de Clientes (LTV)" value={kpis.fidelizados} icon={<Users size={20} />} trend="Em Alta" color="teal" />
        <KPICard title="Ticket Médio Fidelidade" value={`R$ ${kpis.ticketMedio.toFixed(2)}`} icon={<Wallet size={20} />} trend="+28% lucro" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Projeção Financeira</h3>
            <div className="px-4 py-1.5 bg-white dark:bg-zinc-800 dark:border-zinc-700/50 rounded-full text-xs font-bold text-slate-500 dark:text-zinc-400 shadow-sm border border-white transition-colors">Previsão Semanal</div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '16px', color: '#fff', padding: '12px' }} 
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cashback" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white dark:bg-white/10 shadow-sm border border-white/50 dark:border-white/5 rounded-full flex items-center justify-center text-slate-800 dark:text-amber-400 transition-colors"><Zap size={20} /></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Ações Rápidas</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            
            <a href="/admin/customer/123" className="bg-white/70 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 border border-white/80 dark:border-zinc-800 p-5 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow-md block">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2563eb] rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/20"><Users size={18}/></div>
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-[15px]">Ver Diretório de Clientes</p>
                </div>
                <ArrowUpRight size={20} className="text-slate-400 dark:text-zinc-500"/>
            </a>

            <a href="/admin/settings" className="bg-[#121212] dark:bg-indigo-900 hover:bg-black dark:hover:bg-indigo-800 p-5 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition shadow-xl shadow-black/20 mt-auto group border border-transparent dark:border-indigo-500/30 block">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 dark:bg-indigo-500/30 rounded-full text-white flex items-center justify-center"><Settings size={18}/></div>
                    <p className="font-bold text-white text-[15px]">Configurações do Tenant</p>
                </div>
                <ArrowUpRight size={20} className="text-white bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition"/>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }: any) {
  const bgColors = {
    blue: "bg-[#2563eb] text-white shadow-blue-600/30",
    teal: "bg-[#38b2ac] text-white shadow-teal-500/30",
    yellow: "bg-[#fde047] text-slate-900 shadow-yellow-500/30 dark:bg-amber-400"
  };
  
  const iconColors = {
    blue: "bg-white/20",
    teal: "bg-white/20",
    yellow: "bg-black/10"
  };

  const trendColors = {
    blue: "bg-white/20 text-white",
    teal: "bg-white/20 text-white",
    yellow: "bg-black/10 text-slate-900"
  };

  return (
    <div className={`${(bgColors as any)[color]} p-6 rounded-[2.5rem] flex flex-col justify-between h-[210px] shadow-xl hover:-translate-y-1 transition-transform border border-white/10 dark:border-white/5`}>
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-full ${(iconColors as any)[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${(trendColors as any)[color]}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="font-medium opacity-90 mb-2 text-sm tracking-wide">{title}</h4>
        <p className="text-[2.2rem] leading-none font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
