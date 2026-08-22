'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Item {
  id: string;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents';
  text: string;
  done: boolean;
}

export function PackingChecklist({ tripName = 'Trip' }: { tripName?: string }) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', category: 'documents', text: 'Passport & Visa copies', done: true },
    { id: '2', category: 'documents', text: 'Travel insurance & flight tickets', done: true },
    { id: '3', category: 'electronics', text: 'Universal power adapter & power bank', done: false },
    { id: '4', category: 'electronics', text: 'Noise-cancelling headphones & chargers', done: false },
    { id: '5', category: 'clothing', text: 'Comfortable walking / hiking shoes', done: true },
    { id: '6', category: 'clothing', text: 'Light rain jacket / layers', done: false },
    { id: '7', category: 'toiletries', text: 'Sunscreen, lip balm & basic meds kit', done: false },
    { id: '8', category: 'toiletries', text: 'Travel size toiletries kit (TSA friendly)', done: true },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'clothing' | 'toiletries' | 'electronics' | 'documents'>('clothing');

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      category: newCategory,
      text: newText.trim(),
      done: false,
    };
    setItems([...items, newItem]);
    setNewText('');
    toast.success('Item added to checklist');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const completedCount = items.filter((it) => it.done).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((it) => it.category === activeCategory);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Packing Checklist</h3>
            <span className="text-[10px] text-slate-400">
              {completedCount} of {items.length} items packed ({progressPercent}%)
            </span>
          </div>
        </div>

        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {['all', 'clothing', 'electronics', 'documents', 'toiletries'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-3 py-1 font-semibold capitalize transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item List */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`cursor-pointer rounded-2xl border p-2.5 transition flex items-center justify-between gap-3 text-xs ${
              item.done
                ? 'border-emerald-200 bg-emerald-50/40 text-slate-400 line-through'
                : 'border-slate-100 bg-slate-50/70 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`grid h-5 w-5 place-items-center rounded-lg border transition ${
                  item.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {item.done && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="truncate font-medium">{item.text}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item.id);
              }}
              className="text-slate-300 hover:text-red-500 p-1"
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item Form */}
      <form onSubmit={addItem} className="flex gap-2 pt-2 border-t border-slate-100">
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs outline-none capitalize"
        >
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="documents">Documents</option>
          <option value="toiletries">Toiletries</option>
        </select>
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add packing item..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <Plus size={15} />
        </button>
      </form>
    </div>
  );
}
