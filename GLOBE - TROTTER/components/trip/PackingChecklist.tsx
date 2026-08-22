'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, Sparkles, ClipboardList, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Item {
  id: string;
  category: 'essentials' | 'clothing' | 'toiletries' | 'electronics' | 'pre-trip';
  text: string;
  done: boolean;
}

export function PackingChecklist({ tripName = 'Trip' }: { tripName?: string }) {
  const [activeTab, setActiveTab] = useState<'packing' | 'pretrip'>('packing');

  const [items, setItems] = useState<Item[]>([
    { id: '1', category: 'essentials', text: 'Backpack / Daypack', done: true },
    { id: '2', category: 'essentials', text: 'Boarding pass & Passport', done: true },
    { id: '3', category: 'essentials', text: 'Cash / foreign currency (EUR / JPY / IDR)', done: true },
    { id: '4', category: 'electronics', text: 'Universal power adapter & power bank', done: false },
    { id: '5', category: 'electronics', text: 'Noise-cancelling headphones & chargers', done: false },
    { id: '6', category: 'clothing', text: 'Comfortable walking / hiking shoes', done: true },
    { id: '7', category: 'clothing', text: 'Light rain jacket / layers', done: false },
    { id: '8', category: 'toiletries', text: 'Sunscreen, lip balm & basic meds kit', done: false },
    { id: '9', category: 'toiletries', text: 'Travel size toiletries kit (TSA friendly)', done: true },
    { id: '10', category: 'pre-trip', text: 'Notify bank about international travel', done: true },
    { id: '11', category: 'pre-trip', text: 'Purchase international eSIM / roaming plan', done: false },
    { id: '12', category: 'pre-trip', text: 'Download offline Google Maps & translation pack', done: true },
  ]);

  const [newText, setNewText] = useState('');

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
      category: activeTab === 'packing' ? 'essentials' : 'pre-trip',
      text: newText.trim(),
      done: false,
    };
    setItems([...items, newItem]);
    setNewText('');
    toast.success('Added item to checklist');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const currentTabItems = activeTab === 'packing'
    ? items.filter((it) => it.category !== 'pre-trip')
    : items.filter((it) => it.category === 'pre-trip');

  const completedCount = currentTabItems.filter((it) => it.done).length;
  const progressPercent = Math.round((completedCount / (currentTabItems.length || 1)) * 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Top Header matching Screen 10 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <CheckSquare size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Packing Checklist & Pre-Trip Tasks</h3>
            <p className="text-xs text-slate-500">
              Create and manage items to pack so you don&apos;t forget anything important
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.success('Template applied: 8 essential travel items loaded')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
        >
          <Sparkles size={13} />
          Add from a template
        </button>
      </div>

      {/* Sub Tabs: Packing lists / Pre-trip tasks (Screen 10) */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('packing')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'packing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Packing lists
          </button>
          <button
            onClick={() => setActiveTab('pretrip')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'pretrip'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pre-trip tasks
          </button>
        </div>

        <span className="text-xs font-bold font-mono text-slate-500">
          {completedCount} of {currentTabItems.length} selected ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-blue-600 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Section with Header (Screen 10: Essentials) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>{activeTab === 'packing' ? '✓ Essentials & Gear' : '✓ Pre-Departure Checklist'}</span>
        </div>

        <div className="space-y-2">
          {currentTabItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer rounded-2xl border p-3.5 transition flex items-center justify-between gap-3 text-xs ${
                item.done
                  ? 'border-blue-200 bg-blue-50/50 text-slate-800 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`grid h-5 w-5 place-items-center rounded-lg border transition ${
                    item.done
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {item.done && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="truncate">{item.text}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-slate-300 hover:text-red-500 p-1"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Item */}
      <form onSubmit={addItem} className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={`Add new ${activeTab === 'packing' ? 'packing item' : 'pre-trip task'}...`}
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white transition"
        />
        <button
          type="submit"
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}
