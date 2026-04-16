'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Pencil, X, Package, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API = 'http://localhost:3333/api/settings/burger-master';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCost, setPCost] = useState('');
  const [pImage, setPImage] = useState('');

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data.products || []);
    } catch { flash('Erro ao carregar catálogo.'); }
    setLoading(false);
  }

  function openProductForm(product?: any) {
    if (product) {
      setEditingProduct(product);
      setPName(product.name); setPDesc(product.description || '');
      setPCost(String(product.costInPoints)); setPImage(product.imageUrl || '');
    } else {
      setEditingProduct(null); setPName(''); setPDesc(''); setPCost(''); setPImage('');
    }
    setShowProductForm(true);
  }

  async function saveProduct() {
    const body = { name: pName, description: pDesc, costInPoints: pCost, imageUrl: pImage };
    if (editingProduct) {
      await fetch(`${API}/products/${editingProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      flash('✅ Produto atualizado!');
    } else {
      await fetch(`${API}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      flash('✅ Produto criado!');
    }
    setShowProductForm(false); loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Remover este produto?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    flash('🗑️ Produto removido!'); loadProducts();
  }

  async function toggleProduct(p: any) {
    await fetch(`${API}/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !p.isActive }) });
    loadProducts();
  }

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full pb-20 px-4 transition-colors">
      {toast && <div className="fixed top-6 right-6 z-50 bg-[#171717] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-[fadeIn_0.2s_ease-out]">{toast}</div>}

      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin" className="w-10 h-10 bg-white/50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 transition">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Vitrine de Prêmios</span>
      </div>

      <header className="mb-10">
        <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Catálogo<br/>de Produtos</h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Cadastre os prêmios que os seus clientes podem resgatar usando seus pontos.</p>
      </header>

      <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-10 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><Package size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciar Produtos</h2>
          </div>
          <button onClick={() => openProductForm()} className="px-5 py-2.5 bg-[#171717] dark:bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"><Plus size={16} /> Novo Produto</button>
        </div>

        {products.length === 0 && !showProductForm && (
          <div className="text-center py-16 text-slate-400 dark:text-zinc-500">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Nenhum produto cadastrado ainda.</p>
            <p className="text-sm mt-1">Crie o primeiro produto do catálogo de recompensas.</p>
          </div>
        )}

        {showProductForm && (
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-white/80 dark:border-zinc-700 rounded-[2rem] p-6 mb-8 shadow-xl animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Package size={16}/> {editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowProductForm(false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Nome do Produto</label>
                <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Ex: Hambúrguer Clássico" className="w-full bg-white/60 dark:bg-zinc-800/80 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Custo (Pontos)</label>
                 <input type="number" value={pCost} onChange={e => setPCost(e.target.value)} placeholder="Ex: 50" className="w-full bg-white/60 dark:bg-zinc-800/80 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Descrição Curta</label>
                 <input value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Descreva os ingredientes ou detalhes" className="w-full bg-white/60 dark:bg-zinc-800/80 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Link da Imagem (Opcional)</label>
                 <input value={pImage} onChange={e => setPImage(e.target.value)} placeholder="https://..." className="w-full bg-white/60 dark:bg-zinc-800/80 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
             <div className="flex justify-end gap-3">
               <button onClick={saveProduct} disabled={!pName || !pCost} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 flex items-center gap-2"><Save size={16} /> Gravar Produto no Catálogo</button>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p: any) => (
            <div key={p.id} className={`flex flex-col p-6 rounded-[2rem] border transition ${p.isActive ? 'bg-white/70 dark:bg-zinc-900/50 border-white/80 dark:border-zinc-800 shadow-sm' : 'bg-white/30 dark:bg-zinc-900/20 border-white/40 dark:border-zinc-800/50 opacity-60'}`}>
              <div className="flex items-start gap-4 mb-4">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-2xl object-cover border border-white/50 dark:border-zinc-700" /> : <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0"><Package size={24} className="text-emerald-600 dark:text-emerald-400" /></div>}
                <div className="flex-1">
                  <p className="font-black text-lg text-slate-800 dark:text-zinc-100 leading-tight mb-1">{p.name}</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-lg inline-block">{p.costInPoints} pts</p>
                  {p.description && <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-snug">{p.description}</p>}
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 flex items-center justify-between mt-auto">
                 <button onClick={() => toggleProduct(p)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}><Check size={14}/> {p.isActive ? 'Ativo' : 'Inativo'}</button>
                 <div className="flex items-center gap-2">
                    <button onClick={() => openProductForm(p)} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-indigo-500 transition"><Pencil size={14} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
