'use client';

import { useState, useMemo } from 'react';
import {
  Plane,
  Hotel,
  Sparkles,
  Car,
  Utensils,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Wallet,
  PieChart as PieIcon,
  BarChart3,
  DollarSign,
  Download,
  Share2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  X,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Expense, TripWithDetails } from '@/types';

interface BudgetBreakdownProps {
  tripId?: string;
  trip?: TripWithDetails | null;
  onExpenseAdded?: () => void;
}

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface DayExpense {
  dayNumber: number;
  date: string;
  location: string;
  cost: number;
  dailyCap: number;
  isOverbudget: boolean;
  overAmount: number;
  items: string[];
}

const INITIAL_DAY_EXPENSES: DayExpense[] = [
  {
    dayNumber: 1,
    date: 'Sep 10, 2026',
    location: 'Paris Arrival',
    cost: 18500,
    dailyCap: 12000,
    isOverbudget: true,
    overAmount: 6500,
    items: ['International Flight Shuttle (₹4,500)', 'Boutique Hotel Deposit (₹10,500)', 'Bistro Welcome Dinner (₹3,500)'],
  },
  {
    dayNumber: 2,
    date: 'Sep 11, 2026',
    location: 'Paris Sightseeing',
    cost: 10200,
    dailyCap: 12000,
    isOverbudget: false,
    overAmount: 0,
    items: ['Louvre VIP Guided Tour (₹4,200)', 'Seine Sunset Cruise (₹3,800)', 'Café Lunch & Gelato (₹2,200)'],
  },
  {
    dayNumber: 3,
    date: 'Sep 14, 2026',
    location: 'Interlaken Transfer',
    cost: 21500,
    dailyCap: 14000,
    isOverbudget: true,
    overAmount: 7500,
    items: ['Glacier Express 1st Class Train (₹7,500)', 'Swiss Mountain Chalet Lodge (₹11,000)', 'Fondue Dinner (₹3,000)'],
  },
  {
    dayNumber: 4,
    date: 'Sep 15, 2026',
    location: 'Swiss Alps Excursion',
    cost: 19700,
    dailyCap: 14000,
    isOverbudget: true,
    overAmount: 5700,
    items: ['Jungfraujoch Top of Europe (₹14,500)', 'First Cliff Walk (₹3,800)', 'Alpine Snack & Souvenirs (₹1,400)'],
  },
  {
    dayNumber: 5,
    date: 'Sep 19, 2026',
    location: 'Rome Arrival & Colosseum',
    cost: 11400,
    dailyCap: 12000,
    isOverbudget: false,
    overAmount: 0,
    items: ['Colosseum Arena Floor (₹6,500)', 'Pantheon Walk (₹1,500)', 'Trastevere Pasta Tasting (₹3,400)'],
  },
  {
    dayNumber: 6,
    date: 'Sep 20, 2026',
    location: 'Vatican Treasures',
    cost: 9800,
    dailyCap: 12000,
    isOverbudget: false,
    overAmount: 0,
    items: ['Vatican Early Access (₹6,800)', 'Castel Sant’Angelo (₹1,800)', 'Aperitivo & Pizza (₹1,200)'],
  },
];

interface CategorySummary {
  category: 'transport' | 'stay' | 'activities' | 'meals' | 'other';
  label: string;
  amount: number;
  percentage: number;
  color: string;
  icon: any;
}

export function BudgetBreakdown({ tripId, trip, onExpenseAdded }: BudgetBreakdownProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'itemized'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Budget settings
  const budgetCap = trip?.budget_cap || 160000;

  // Custom added expenses
  const [customExpenses, setCustomExpenses] = useState<Expense[]>([
    { id: 'exp-1', trip_id: tripId || '1', category: 'transport', amount: 54000, description: 'Return International & Train Passes', paid_by_member_id: 'Manthan Saraiya', created_at: '2026-08-20' },
    { id: 'exp-2', trip_id: tripId || '1', category: 'accommodation', amount: 49000, description: '4-Star Boutique Hotels & Alpine Chalets', paid_by_member_id: 'Manthan Saraiya', created_at: '2026-08-21' },
    { id: 'exp-3', trip_id: tripId || '1', category: 'activities', amount: 29000, description: 'Museum, Summit & Cruise Tickets', paid_by_member_id: 'Manthan Saraiya', created_at: '2026-08-22' },
    { id: 'exp-4', trip_id: tripId || '1', category: 'food', amount: 12000, description: 'Traditional Trattoria Dinners & Wine Tastings', paid_by_member_id: 'Manthan Saraiya', created_at: '2026-08-22' },
    { id: 'exp-5', trip_id: tripId || '1', category: 'other', amount: 8000, description: 'Luggage Insurance & Alpine Souvenirs', paid_by_member_id: 'Manthan Saraiya', created_at: '2026-08-22' },
  ]);

  // Form State
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'transport' | 'accommodation' | 'activities' | 'food' | 'other'>('activities');

  // Total Estimated Cost
  const totalCost = useMemo(() => {
    return customExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [customExpenses]);

  // Average Daily Cost (across 14 travel days)
  const totalTripDays = 14;
  const avgCostPerDay = Math.round(totalCost / totalTripDays);

  // Category Breakdown
  const categories: CategorySummary[] = useMemo(() => {
    const map: Record<string, number> = {
      transport: 0,
      accommodation: 0,
      activities: 0,
      food: 0,
      other: 0,
    };
    customExpenses.forEach((e) => {
      const cat = e.category.toLowerCase();
      if (map[cat] !== undefined) {
        map[cat] += Number(e.amount);
      } else {
        map.other += Number(e.amount);
      }
    });

    return [
      { category: 'transport', label: 'Transport & Flights', amount: map.transport, percentage: Math.round((map.transport / totalCost) * 100) || 0, color: '#3B82F6', icon: Plane },
      { category: 'stay', label: 'Stay & Accommodation', amount: map.accommodation, percentage: Math.round((map.accommodation / totalCost) * 100) || 0, color: '#6366F1', icon: Hotel },
      { category: 'activities', label: 'Activities & Tours', amount: map.activities, percentage: Math.round((map.activities / totalCost) * 100) || 0, color: '#F97316', icon: Sparkles },
      { category: 'meals', label: 'Meals & Dining', amount: map.food, percentage: Math.round((map.food / totalCost) * 100) || 0, color: '#10B981', icon: Utensils },
      { category: 'other', label: 'Shopping & Miscellaneous', amount: map.other, percentage: Math.round((map.other / totalCost) * 100) || 0, color: '#8B5CF6', icon: Wallet },
    ];
  }, [customExpenses, totalCost]);

  // Overbudget days
  const overbudgetDays = INITIAL_DAY_EXPENSES.filter((d) => d.isOverbudget);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || Number(formAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      trip_id: tripId || '1',
      amount: Number(formAmount),
      description: formDesc || `${formCategory.charAt(0).toUpperCase() + formCategory.slice(1)} expense`,
      category: formCategory,
      paid_by_member_id: 'Manthan Saraiya',
      created_at: new Date().toISOString().split('T')[0],
    };

    setCustomExpenses((prev) => [newExp, ...prev]);
    setFormAmount('');
    setFormDesc('');
    setShowAddModal(false);
    toast.success('Expense recorded successfully!');
    if (onExpenseAdded) onExpenseAdded();
  };

  const handleDeleteExpense = (id: string) => {
    setCustomExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success('Expense removed');
  };

  const filteredExpenses = useMemo(() => {
    if (selectedCategoryFilter === 'all') return customExpenses;
    return customExpenses.filter((e) => e.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
  }, [customExpenses, selectedCategoryFilter]);

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP STATS BANNER: ESTIMATED COST, BUDGET CAP & DAILY AVG     */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/20 mb-2">
              <ShieldCheck size={13} /> Real-Time Financial Tracker
            </div>
            <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
              Total Estimated Trip Cost
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(totalCost)}
              </h1>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold">
                / Planned Cap: <strong className="text-white">{formatINR(budgetCap)}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Remaining Safe Balance: <strong className="text-emerald-400">{formatINR(Math.max(0, budgetCap - totalCost))}</strong> (
              {Math.round(((budgetCap - totalCost) / budgetCap) * 100)}% remaining)
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
            <div className="rounded-2xl bg-slate-800/90 p-4 border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Avg. Cost Per Day
              </span>
              <p className="text-base sm:text-lg font-black text-blue-400 mt-0.5">
                {formatINR(avgCostPerDay)}
                <span className="text-[11px] font-normal text-slate-400"> / day</span>
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Across {totalTripDays} travel days</span>
            </div>

            <div className="rounded-2xl bg-slate-800/90 p-4 border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Overbudget Alerts
              </span>
              <p className={`text-base sm:text-lg font-black mt-0.5 ${overbudgetDays.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {overbudgetDays.length} Days Exceeded
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Daily limit: ₹12k – ₹14k</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1.5">
            <span>Overall Budget Consumption</span>
            <span>{Math.round((totalCost / budgetCap) * 100)}% Used</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                totalCost > budgetCap ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (totalCost / budgetCap) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* OVERBUDGET DAYS ALERT NOTIFICATION BAR (Feature 9)           */}
      {/* ============================================================ */}
      {overbudgetDays.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 px-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-200 text-amber-900 flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                ⚠️ Budget Alert: {overbudgetDays.length} travel days exceeded daily spending caps
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Day 1 (Paris Arrival) & Day 3, 4 (Swiss Alps) exceeded the daily cap due to premium train & peak excursions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className="rounded-xl bg-amber-900 hover:bg-amber-950 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition flex-shrink-0"
          >
            Review Days →
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW MODE TABS: OVERVIEW (CHARTS) vs DAILY BREAKDOWN vs ITEMS */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieIcon size={14} /> Category Breakdown
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 size={14} /> Day-by-Day Timeline
          </button>
          <button
            onClick={() => setActiveTab('itemized')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'itemized'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard size={14} /> Itemized Receipts ({customExpenses.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const text = `Trip Budget Summary:\nTotal: ${formatINR(totalCost)}\nDaily Avg: ${formatINR(avgCostPerDay)}\nTransport: ₹54k, Stay: ₹49k, Activities: ₹29k`;
              navigator.clipboard.writeText(text);
              toast.success('Budget summary copied to clipboard!');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 size={13} /> Share Budget
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus size={15} /> + Add Expense
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CATEGORY BREAKDOWN (Transport, Stay, Activities, Food) */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-700 font-mono">
                      {cat.percentage}% of total
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {cat.label}
                    </h3>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      {formatINR(cat.amount)}
                    </p>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparative Summary Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Expense Allocation Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your largest expenditure is <strong>Transport & Flights (35%)</strong> and <strong>Accommodation (32%)</strong>, followed by experiences & sightseeing tours (19%). Dining and local activities remain comfortably within planned thresholds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl bg-blue-50/60 p-3.5 border border-blue-100 text-xs">
                <span className="font-bold text-blue-900 block">✈️ Long-Haul Flights</span>
                <p className="text-slate-600 mt-0.5">₹54,000 locked in early with luggage allowance included.</p>
              </div>
              <div className="rounded-2xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs">
                <span className="font-bold text-indigo-900 block">🏨 4-Star Stays</span>
                <p className="text-slate-600 mt-0.5">Average ₹3,500/night across boutique hotels & alpine chalets.</p>
              </div>
              <div className="rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900 block">🍷 Culinary & Food</span>
                <p className="text-slate-600 mt-0.5">₹850/meal budget per traveler with gourmet wine pairings.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: DAY-BY-DAY COST TIMELINE & OVERBUDGET HIGHLIGHTS      */}
      {/* ============================================================ */}
      {activeTab === 'daily' && (
        <div className="space-y-4 animate-in fade-in">
          {INITIAL_DAY_EXPENSES.map((day) => (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border p-5 shadow-sm transition ${
                day.isOverbudget
                  ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white font-black text-xs">
                    D{day.dayNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Day {day.dayNumber}: {day.location}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-semibold">{day.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {day.isOverbudget && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 border border-amber-200">
                      ⚠️ Over by {formatINR(day.overAmount)}
                    </span>
                  )}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Day Total</span>
                    <p className={`text-base font-black ${day.isOverbudget ? 'text-amber-700' : 'text-slate-900'}`}>
                      {formatINR(day.cost)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Day item list */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Day Schedule Expenses:
                </span>
                {day.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={13} className="text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: ITEMIZED RECEIPTS & EXPENSE LOGGER                    */}
      {/* ============================================================ */}
      {activeTab === 'itemized' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Itemized Expense Log</h3>
            <div className="flex items-center gap-1.5">
              {['all', 'transport', 'accommodation', 'activities', 'food', 'other'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {exp.description}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {exp.category} • Logged on {exp.created_at} by {exp.paid_by_member_id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                    {formatINR(exp.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete receipt"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD EXPENSE MODAL POPUP                                      */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log New Expense</h3>
                <p className="text-xs text-slate-500">Add an expenditure in ₹ INR with category</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Expense Amount (₹):</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description / Item:</label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Glacier Express Train pass or Colosseum tour"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 capitalize outline-none focus:border-blue-500"
                >
                  <option value="transport">Transport & Flights</option>
                  <option value="accommodation">Stay & Accommodation</option>
                  <option value="activities">Activities & Sightseeing</option>
                  <option value="food">Meals & Dining</option>
                  <option value="other">Shopping & Miscellaneous</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  + Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
