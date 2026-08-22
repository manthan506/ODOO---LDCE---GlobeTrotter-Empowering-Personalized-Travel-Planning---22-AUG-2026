'use client';

import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ChevronDown,
  ChevronRight,
  X,
  ClipboardList,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface Item {
  id: string;
  category: string;
  text: string;
  done: boolean;
}

export function PackingChecklist({ tripName = 'Trip' }: { tripName?: string }) {
  const [activeTab, setActiveTab] = useState<'packing' | 'pretrip'>('packing');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string>('Essentials');

  // Active items list
  const [items, setItems] = useState<Item[]>([
    { id: '1', category: 'Essentials', text: 'Backpack', done: true },
    { id: '2', category: 'Essentials', text: 'Boarding pass', done: true },
    { id: '3', category: 'Essentials', text: 'Cash / foreign currency', done: true },
    { id: '4', category: 'Essentials', text: 'Credit and debit cards', done: true },
    { id: '5', category: 'Essentials', text: "Driver's license", done: true },
    { id: '6', category: 'Essentials', text: 'Universal power adapter', done: false },
    { id: '7', category: 'Accessories', text: 'Polarized sunglasses', done: false },
    { id: '8', category: 'Accessories', text: 'Refillable water bottle', done: true },
    { id: '9', category: 'Pre-trip', text: 'Notify bank of international travel', done: true },
    { id: '10', category: 'Pre-trip', text: 'Download offline maps & translation', done: true },
  ]);

  // Template Modal State matching Screenshot 10
  const [templateTab, setTemplateTab] = useState<'packing' | 'pretrip'>('packing');
  const templateCategories = [
    {
      name: 'Essentials',
      items: [
        'Backpack',
        'Boarding pass',
        'Cash / foreign currency',
        'Credit and debit cards',
        "Driver's license",
        'Passport / Visa',
        'Universal power adapter',
        'Noise-cancelling headphones',
      ],
    },
    {
      name: 'Accessories',
      items: ['Sunglasses', 'Travel umbrella', 'Refillable water bottle', 'Eye mask & earplugs'],
    },
    {
      name: 'Backpack / Carry On',
      items: ['Change of clothes in carry-on', 'Medication kit', 'Power bank', 'Travel pillow'],
    },
    {
      name: 'Beach',
      items: ['Swimsuit', 'Reef-safe sunscreen', 'Beach towel', 'Waterproof phone pouch'],
    },
    {
      name: 'Biking',
      items: ['Biking gloves', 'Hydration pack', 'Bike lock'],
    },
    {
      name: 'Camping',
      items: ['Sleeping bag', 'Headlamp', 'Multi-tool knife', 'Bug spray'],
    },
  ];

  const [selectedTemplateItems, setSelectedTemplateItems] = useState<string[]>([
    'Backpack',
    'Boarding pass',
    'Cash / foreign currency',
    'Credit and debit cards',
    "Driver's license",
    'Passport / Visa',
    'Universal power adapter',
    'Noise-cancelling headphones',
    'Sunglasses',
    'Travel umbrella',
    'Power bank',
    'Medication kit',
  ]);

  const toggleTemplateItem = (itemText: string) => {
    setSelectedTemplateItems((prev) =>
      prev.includes(itemText)
        ? prev.filter((i) => i !== itemText)
        : [...prev, itemText]
    );
  };

  const handleApplyTemplate = () => {
    const newItems: Item[] = selectedTemplateItems.map((text, idx) => ({
      id: `tmpl-${Date.now()}-${idx}`,
      category: 'Essentials',
      text,
      done: false,
    }));

    setItems([...items, ...newItems]);
    setShowTemplateModal(false);
    toast.success(`Added ${selectedTemplateItems.length} items to your packing checklist!`);
  };

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
      category: activeTab === 'packing' ? 'Essentials' : 'Pre-trip',
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

  const currentTabItems =
    activeTab === 'packing'
      ? items.filter((it) => it.category !== 'Pre-trip')
      : items.filter((it) => it.category === 'Pre-trip');

  const completedCount = currentTabItems.filter((it) => it.done).length;
  const progressPercent = Math.round((completedCount / (currentTabItems.length || 1)) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 10 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Create checklists for your trip</h2>
      </div>

      {/* Main Checklist Frame */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Packing & Pre-trip Checklists</h3>
              <p className="text-xs text-slate-500">
                Select from templates or add custom items to stay organized
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTemplateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ff5a36] hover:bg-[#e04826] px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-95"
          >
            <Sparkles size={14} />
            Add from a template
          </button>
        </div>

        {/* Sub Tabs: Packing lists / Pre-trip tasks (Screenshot 10) */}
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

        {/* Checklist Section with Blue Checkmarks (Screenshot 10) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span>{activeTab === 'packing' ? '✓ Essentials & Gear' : '✓ Pre-Departure Checklist'}</span>
          </div>

          <div className="space-y-2">
            {currentTabItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer rounded-2xl border p-3.5 transition flex items-center justify-between gap-3 text-xs ${
                  item.done
                    ? 'border-blue-200 bg-blue-50/40 text-slate-900 font-semibold'
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
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Item Form */}
        <form onSubmit={addItem} className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={`Add new ${activeTab === 'packing' ? 'packing item' : 'pre-trip task'}...`}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>

      {/* MODAL: Add from a Template matching Screenshot 10 */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header & Selected Count (Screenshot 10) */}
            <div className="text-center space-y-1 relative">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="absolute right-0 top-0 text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
              <h3 className="text-xl font-black text-slate-900">Add from a template</h3>
              <p className="text-xs font-bold font-mono text-slate-500">
                {selectedTemplateItems.length} items selected
              </p>
            </div>

            {/* Sub Tabs: Packing lists / Pre-trip tasks (Screenshot 10) */}
            <div className="flex justify-center">
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setTemplateTab('packing')}
                  className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                    templateTab === 'packing'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Packing lists
                </button>
                <button
                  onClick={() => setTemplateTab('pretrip')}
                  className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                    templateTab === 'pretrip'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pre-trip tasks
                </button>
              </div>
            </div>

            {/* Accordion Categories List matching Screenshot 10 */}
            <div className="space-y-2.5 divide-y divide-slate-100">
              {templateCategories.map((cat) => {
                const isExpanded = expandedCategory === cat.name;
                return (
                  <div key={cat.name} className="pt-2 first:pt-0">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? '' : cat.name)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-800 hover:text-slate-900"
                    >
                      <span className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {cat.items.length} items
                      </span>
                    </button>

                    {/* Expanded Checklist Items with Blue Boxes (Screenshot 10) */}
                    {isExpanded && (
                      <div className="space-y-2 pl-6 pt-1 pb-2">
                        {cat.items.map((itemText) => {
                          const isSelected = selectedTemplateItems.includes(itemText);
                          return (
                            <div
                              key={itemText}
                              onClick={() => toggleTemplateItem(itemText)}
                              className="flex items-center justify-between cursor-pointer text-xs py-1.5 hover:text-blue-600 text-slate-700"
                            >
                              <span>{itemText}</span>
                              <div
                                className={`grid h-4 w-4 place-items-center rounded border transition ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check size={11} strokeWidth={3} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA: Add X items to checklist (Screenshot 10) */}
            <button
              onClick={handleApplyTemplate}
              className="w-full rounded-2xl bg-[#ff5a36] hover:bg-[#e04826] py-3 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition active:scale-98"
            >
              Add {selectedTemplateItems.length} items to checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
