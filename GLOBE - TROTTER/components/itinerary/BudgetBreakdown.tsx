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
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTripSync } from '@/context/TripSyncContext';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface CategorySummary {
  category: 'transport' | 'stay' | 'activities' | 'meals' | 'other';
  label: string;
  amount: number;
  percentage: number;
  color: string;
  icon: any;
}

export function BudgetBreakdown({ tripId }: { tripId?: string } = {}) {
  const {
    masterTrip,
    expenses,
    addExpense,
    removeExpense,
    totalCalculatedCost,
    totalBudgetCap,
    remainingBalance,
    avgDailyCost,
    daySchedule,
    resetAllToDemoDefaults,
  } = useTripSync();

  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'itemized'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form State
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'transport' | 'accommodation' | 'activities' | 'food' | 'other'>('activities');

  // Category Breakdown dynamically calculated from synchronized expenses
  const categories: CategorySummary[] = useMemo(() => {
    const map: Record<string, number> = {
      transport: 0,
      accommodation: 0,
      activities: 0,
      food: 0,
      other: 0,
    };

    expenses.forEach((e) => {
      const cat = e.category.toLowerCase();
      if (map[cat] !== undefined) {
        map[cat] += Number(e.amount);
      } else {
        map.other += Number(e.amount);
      }
    });

    const tot = totalCalculatedCost || 1;

    return [
      { category: 'transport', label: 'Transport & Flights', amount: map.transport, percentage: Math.round((map.transport / tot) * 100) || 0, color: '#3B82F6', icon: Plane },
      { category: 'stay', label: 'Stay & Accommodation', amount: map.accommodation, percentage: Math.round((map.accommodation / tot) * 100) || 0, color: '#6366F1', icon: Hotel },
      { category: 'activities', label: 'Activities & Tours', amount: map.activities, percentage: Math.round((map.activities / tot) * 100) || 0, color: '#F97316', icon: Sparkles },
      { category: 'meals', label: 'Meals & Dining', amount: map.food, percentage: Math.round((map.food / tot) * 100) || 0, color: '#10B981', icon: Utensils },
      { category: 'other', label: 'Shopping & Misc', amount: map.other, percentage: Math.round((map.other / tot) * 100) || 0, color: '#8B5CF6', icon: Wallet },
    ];
  }, [expenses, totalCalculatedCost]);

  // Day-wise calculation from daySchedule
  const dayTimeline = useMemo(() => {
    return Object.entries(daySchedule).map(([dayKey, plan]) => {
      const dayCost = plan.activities.reduce((s, a) => s + a.cost, 0);
      const isOver = dayCost > plan.dailyCap;
      return {
        dayNumber: Number(dayKey),
        date: plan.date,
        location: `${plan.city} (${plan.title})`,
        cost: dayCost,
        dailyCap: plan.dailyCap,
        isOverbudget: isOver,
        overAmount: Math.max(0, dayCost - plan.dailyCap),
        items: plan.activities.map((a) => `${a.name} (${formatINR(a.cost)})`),
      };
    });
  }, [daySchedule]);

  const overbudgetDays = dayTimeline.filter((d) => d.isOverbudget);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || Number(formAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: Number(formAmount),
      description: formDesc || `${formCategory.charAt(0).toUpperCase() + formCategory.slice(1)} expense`,
      category: formCategory,
      paidBy: 'Manthan Saraiya',
      date: new Date().toISOString().split('T')[0],
    });

    setFormAmount('');
    setFormDesc('');
    setShowAddModal(false);
  };

  const filteredExpenses = useMemo(() => {
    if (selectedCategoryFilter === 'all') return expenses;
    return expenses.filter((e) => e.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
  }, [expenses, selectedCategoryFilter]);

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* TOP STATS BANNER: ESTIMATED COST, BUDGET CAP & DAILY AVG     */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/20 mb-2">
              <ShieldCheck size={13} /> Synchronized Financial Tracker
            </div>
            <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
              {masterTrip.name} • Total Cost
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(totalCalculatedCost)}
              </h1>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold">
                / Planned Cap: <strong className="text-white">{formatINR(totalBudgetCap)}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Remaining Safe Balance: <strong className="text-emerald-400">{formatINR(remainingBalance)}</strong> (
              {Math.round((remainingBalance / totalBudgetCap) * 100)}% remaining)
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
            <div className="rounded-2xl bg-slate-800/90 p-4 border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Avg. Cost Per Day
              </span>
              <p className="text-base sm:text-lg font-black text-blue-400 mt-0.5">
                {formatINR(avgDailyCost)}
                <span className="text-[11px] font-normal text-slate-400"> / day</span>
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Across {masterTrip.daysCount || 14} days</span>
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
            <span>{Math.round((totalCalculatedCost / totalBudgetCap) * 100)}% Used</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                totalCalculatedCost > totalBudgetCap ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (totalCalculatedCost / totalBudgetCap) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* OVERBUDGET DAYS ALERT BAR */}
      {overbudgetDays.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 px-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-200 text-amber-900 flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                ⚠️ Budget Alert: {overbudgetDays.length} travel days exceeded daily caps
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Excursions and pass bookings exceeded the standard daily cap.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className="rounded-xl bg-amber-900 hover:bg-amber-950 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition flex-shrink-0"
          >
            Review Timeline →
          </button>
        </div>
      )}

      {/* VIEW MODE TABS */}
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
            <CreditCard size={14} /> Itemized Expenses ({expenses.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAllToDemoDefaults}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition"
            title="Reset to Demo Defaults"
          >
            <RotateCcw size={13} /> Reset Demo
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

      {/* TAB 1: CATEGORIES */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
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
                      {cat.percentage}%
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
        </div>
      )}

      {/* TAB 2: DAILY TIMELINE */}
      {activeTab === 'daily' && (
        <div className="space-y-4 animate-in fade-in">
          {dayTimeline.map((day) => (
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

              {day.items.length > 0 && (
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Day Schedule Experiences:
                  </span>
                  {day.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={13} className="text-blue-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ITEMIZED EXPENSES */}
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
                      {exp.category} • Logged on {exp.date} by {exp.paidBy}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                    {formatINR(exp.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExpense(exp.id)}
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

      {/* ADD EXPENSE MODAL */}
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
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
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
