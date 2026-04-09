'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Pencil, X, Package, Award, MessageSquare, Clock, Check } from 'lucide-react';

const API = 'http://localhost:3333/api/settings/burger-master';

export default function SettingsPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Tenant fields
  const [remarketingTemplate, setRemarketingTemplate] = useState('');
  const [birthdayTemplate, setBirthdayTemplate] = useState('');
  const [cashbackTtlDays, setCashbackTtlDays] = useState(90);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCost, setPCost] = useState('');
  const [pImage, setPImage] = useState('');

  // Rule form
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [rName, setRName] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rType, setRType] = useState('PERCENTAGE');
  const [rValue, setRValue] = useState('');
  const [rDay, setRDay] = useState('');
  const [rMin, setRMin] = useState('');

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTenant(data);
      setProducts(data.products || []);
      setRules(data.rewardRules || []);
      setRemarketingTemplate(data.remarketingTemplate || '');
      setBirthdayTemplate(data.birthdayTemplate || '');
      setCashbackTtlDays(data.cashbackTtlDays ?? 90);
    } catch { flash('Erro ao carregar configurações. Verifique se a API está rodando.'); }
    setLoading(false);
  }

  // ═══════════ TENANT CONFIG ═══════════
  async function saveTenant() {
    setSaving(true);
    await fetch(API, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarketingTemplate, birthdayTemplate, cashbackTtlDays })
    });
    flash('✅ Configurações salvas!');
    setSaving(false);
  }

  // ═══════════ PRODUCTS ═══════════
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
    setShowProductForm(false); loadAll();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Remover este produto?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    flash('🗑️ Produto removido!'); loadAll();
  }

  async function toggleProduct(p: any) {
    await fetch(`${API}/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !p.isActive }) });
    loadAll();
  }

  // ═══════════ RULES ═══════════
  function openRuleForm(rule?: any) {
    if (rule) {
      setEditingRule(rule);
      setRName(rule.name); setRDesc(rule.description || '');
      setRType(rule.type); setRValue(String(rule.value));
      setRDay(rule.dayOfWeek != null ? String(rule.dayOfWeek) : '');
      setRMin(rule.minPurchase != null ? String(rule.minPurchase) : '');
    } else {
      setEditingRule(null); setRName(''); setRDesc(''); setRType('PERCENTAGE'); setRValue(''); setRDay(''); setRMin('');
    }
    setShowRuleForm(true);
  }

  async function saveRule() {
    const body: any = { name: rName, description: rDesc, type: rType, value: rValue };
    if (rDay) body.dayOfWeek = rDay;
    if (rMin) body.minPurchase = rMin;
    if (editingRule) {
      await fetch(`${API}/rules/${editingRule.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      flash('✅ Regra atualizada!');
    } else {
      await fetch(`${API}/rules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      flash('✅ Regra criada!');
    }
    setShowRuleForm(false); loadAll();
  }

  async function deleteRule(id: string) {
    if (!confirm('Remover esta regra?')) return;
    await fetch(`${API}/rules/${id}`, { method: 'DELETE' });
    flash('🗑️ Regra removida!'); loadAll();
  }

  async function toggleRule(r: any) {
    await fetch(`${API}/rules/${r.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !r.isActive }) });
    loadAll();
  }

  const dayNames: Record<string, string> = { '0': 'Domingo', '1': 'Segunda', '2': 'Terça', '3': 'Quarta', '4': 'Quinta', '5': 'Sexta', '6': 'Sábado' };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full pb-20 px-4 transition-colors">
      {/* Toast */}
      {toast && <div className="fixed top-6 right-6 z-50 bg-[#171717] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-[fadeIn_0.2s_ease-out]">{toast}</div>}

      <header className="mb-10">
        <h1 className="text-[2.5rem] leading-[1.1] font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Configurações<br/>do Tenant</h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Gerencie mensagens, validades e catálogo de recompensas.</p>
      </header>

      {/* ═══════════ SECTION 1: TENANT CONFIG ═══════════ */}
      <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-10 transition-colors">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-indigo-600/20"><MessageSquare size={20} /></div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Mensagens & Validade</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">Mensagem de Remarketing (Saudade)</label>
            <textarea value={remarketingTemplate} onChange={e => setRemarketingTemplate(e.target.value)} rows={4} placeholder="Olá {name}! Sentimos sua falta. Você tem R$ {balance} em cashback esperando 🎁" className="w-full bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-2xl p-4 text-slate-800 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600" />
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">Variáveis: <code className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{'{name}'}</code> <code className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{'{balance}'}</code></p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">Mensagem de Aniversário</label>
            <textarea value={birthdayTemplate} onChange={e => setBirthdayTemplate(e.target.value)} rows={4} placeholder="Parabéns, {name}! 🎂 Aproveite um bônus especial de aniversário!!" className="w-full bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-2xl p-4 text-slate-800 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600" />
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">Variáveis: <code className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">{'{name}'}</code></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-2"><Clock size={14} /> Validade do Cashback (dias)</label>
            <input type="number" value={cashbackTtlDays} onChange={e => setCashbackTtlDays(Number(e.target.value))} className="w-[140px] bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-zinc-800 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 font-bold text-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition" />
          </div>
          <button onClick={saveTenant} disabled={saving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 disabled:opacity-50">
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </section>

      {/* ═══════════ SECTION 2: PRODUCT CATALOG ═══════════ */}
      <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-10 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><Package size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Catálogo de Produtos</h2>
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

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-white/80 dark:border-zinc-700 rounded-[2rem] p-6 mb-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowProductForm(false)} className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Nome do produto" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <input type="number" value={pCost} onChange={e => setPCost(e.target.value)} placeholder="Custo em pontos" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <input value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Descrição (opcional)" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <input value={pImage} onChange={e => setPImage(e.target.value)} placeholder="URL da imagem (opcional)" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <button onClick={saveProduct} disabled={!pName || !pCost} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 flex items-center gap-2"><Save size={14} /> Salvar</button>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3">
          {products.map((p: any) => (
            <div key={p.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition ${p.isActive ? 'bg-white/70 dark:bg-zinc-900/50 border-white/80 dark:border-zinc-800' : 'bg-white/30 dark:bg-zinc-900/20 border-white/40 dark:border-zinc-800/50 opacity-60'}`}>
              <div className="flex items-center gap-4">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-white/50 dark:border-zinc-700" /> : <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Package size={20} className="text-emerald-600 dark:text-emerald-400" /></div>}
                <div>
                  <p className="font-bold text-slate-800 dark:text-zinc-200">{p.name}</p>
                  {p.description && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{p.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{p.costInPoints} pts</span>
                <button onClick={() => toggleProduct(p)} title={p.isActive ? 'Desativar' : 'Ativar'} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${p.isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}><Check size={14} /></button>
                <button onClick={() => openProductForm(p)} className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-indigo-500 transition"><Pencil size={14} /></button>
                <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 3: REWARD RULES ═══════════ */}
      <section className="bg-white/40 dark:bg-[#0a0a0c]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-amber-500/20"><Award size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Regras de Recompensa</h2>
          </div>
          <button onClick={() => openRuleForm()} className="px-5 py-2.5 bg-[#171717] dark:bg-amber-600 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"><Plus size={16} /> Nova Regra</button>
        </div>

        {rules.length === 0 && !showRuleForm && (
          <div className="text-center py-16 text-slate-400 dark:text-zinc-500">
            <Award size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Nenhuma regra de cashback ainda.</p>
            <p className="text-sm mt-1">Crie uma regra para começar a dar pontos nas compras.</p>
          </div>
        )}

        {/* Rule Form Modal */}
        {showRuleForm && (
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-white/80 dark:border-zinc-700 rounded-[2rem] p-6 mb-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">{editingRule ? 'Editar Regra' : 'Nova Regra'}</h3>
              <button onClick={() => setShowRuleForm(false)} className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <input value={rName} onChange={e => setRName(e.target.value)} placeholder="Nome da regra" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              <select value={rType} onChange={e => setRType(e.target.value)} className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                <option value="PERCENTAGE">Percentual (%)</option>
                <option value="FIXED">Valor Fixo (R$)</option>
                <option value="CONVERSION">Conversão (R$ por ponto)</option>
              </select>
              <input type="number" value={rValue} onChange={e => setRValue(e.target.value)} placeholder={rType === 'PERCENTAGE' ? 'Ex: 5 (%)' : rType === 'CONVERSION' ? 'Ex: 20 (R$ por ponto)' : 'Ex: 10 (R$)'} className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              <input value={rDesc} onChange={e => setRDesc(e.target.value)} placeholder="Descrição (opcional)" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              <select value={rDay} onChange={e => setRDay(e.target.value)} className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                <option value="">Qualquer dia</option>
                <option value="0">Domingo</option><option value="1">Segunda</option><option value="2">Terça</option>
                <option value="3">Quarta</option><option value="4">Quinta</option><option value="5">Sexta</option><option value="6">Sábado</option>
              </select>
              <input type="number" value={rMin} onChange={e => setRMin(e.target.value)} placeholder="Compra mínima (opcional)" className="bg-white/60 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
            <button onClick={saveRule} disabled={!rName || !rValue} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-full font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 flex items-center gap-2"><Save size={14} /> Salvar</button>
          </div>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((r: any) => (
            <div key={r.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition ${r.isActive ? 'bg-white/70 dark:bg-zinc-900/50 border-white/80 dark:border-zinc-800' : 'bg-white/30 dark:bg-zinc-900/20 border-white/40 dark:border-zinc-800/50 opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Award size={20} className="text-amber-600 dark:text-amber-400" /></div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-zinc-200">{r.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {r.type === 'PERCENTAGE' ? `${r.value}% de cashback` : r.type === 'CONVERSION' ? `A cada R$ ${r.value} = 1 ponto` : `R$ ${r.value} fixo`}
                    {r.dayOfWeek != null && ` · ${dayNames[String(r.dayOfWeek)] || r.dayOfWeek}`}
                    {r.minPurchase != null && ` · Mín R$ ${r.minPurchase}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleRule(r)} title={r.isActive ? 'Desativar' : 'Ativar'} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${r.isActive ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}><Check size={14} /></button>
                <button onClick={() => openRuleForm(r)} className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-indigo-500 transition"><Pencil size={14} /></button>
                <button onClick={() => deleteRule(r.id)} className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-zinc-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
