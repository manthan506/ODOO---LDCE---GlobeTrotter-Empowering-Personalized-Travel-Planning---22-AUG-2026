'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plane, Hotel, Sparkles, Car, Utensils, MoreHorizontal, Plus, Trash2, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Expense, TripWithDetails } from '@/types';

interface BudgetBreakdownProps {
  tripId: string;
  trip?: TripWithDetails | null;
  onExpenseAdded?: () => void;
}

interface BudgetData {
  totalCost: number;
  budgetCap: number | null;
  remainingBudget: number | null;
  isOverBudget: boolean;
  breakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

export function BudgetBreakdown({ tripId, trip, onExpenseAdded }: BudgetBreakdownProps) {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayCostModal, setShowDayCostModal] = useState(false);

  // New expense form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'flights' | 'accommodation' | 'activities' | 'transport' | 'food' | 'other'>('activities');
  const [submitting, setSubmitting] = useState(false);

  const fetchBudget = async () => {
    try {
      const [budgetRes, expensesRes] = await Promise.all([
        fetch(`/api/trips/${tripId}/budget`, { credentials: 'include' }),
        fetch(`/api/trips/${tripId}/expenses`, { credentials: 'include' }),
      ]);

      if (budgetRes.ok) {
        const bData = await budgetRes.json();
        setBudgetData(bData);
      }
      if (expensesRes.ok) {
        const eData = await expensesRes.json();
        setExpenses(eData);
      }
    } catch (err) {
      console.error('Error loading budget:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchBudget();
  }, [tripId]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          description: description || `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
          category,
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to add expense');

      toast.success('Expense added successfully');
      setAmount('');
      setDescription('');
      setShowAddModal(false);
      fetchBudget();
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      toast.error('Error adding expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Expense removed');
        fetchBudget();
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'flights':
        return <Plane size={18} className="text-blue-500" />;
      case 'accommodation':
        return <Hotel size={18} className="text-indigo-500" />;
      case 'activities':
        return <Sparkles size={18} className="text-orange-500" />;
      case 'transport':
        return <Car size={18} className="text-emerald-500" />;
      case 'food':
        return <Utensils size={18} className="text-amber-500" />;
      default:
        return <MoreHorizontal size={18} className="text-purple-500" />;
    }
  };

  // Format currency in Indian Rupees ₹
  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  const chartData = (budgetData?.breakdown && budgetData.breakdown.length > 0)
    ? budgetData.breakdown
    : [
        { category: 'Flights', amount: 54000, percentage: 35, color: '#3B82F6' },
        { category: 'Accommodation', amount: 49000, percentage: 32, color: '#6366F1' },
        { category: 'Activities', amount: 29000, percentage: 19, color: '#F97316' },
        { category: 'Transport', amount: 12000, percentage: 8, color: '#10B981' },
        { category: 'Food', amount: 8000, percentage: 6, color: '#F59E0B' },
      ];

  const totalCost = budgetData?.totalCost || chartData.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Estimated Cost</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-extrabold text-slate-900">{formatINR(totalCost)}</h2>
              {trip?.budget_cap && (
                <span className="text-xs text-slate-500 font-medium">
                  / Cap: {formatINR(trip.budget_cap)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>

        {/* Over budget alert */}
        {trip?.budget_cap && totalCost > trip.budget_cap && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-800 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <span>You have exceeded your budgeted cap of {formatINR(trip.budget_cap)}.</span>
          </div>
        )}

        {/* Donut Chart and Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart */}
          <div className="relative h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatINR(value), 'Cost']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Total</span>
              <span className="text-sm font-bold text-slate-800">{formatINR(totalCost)}</span>
            </div>
          </div>

          {/* Legend with amounts & % */}
          <div className="space-y-3">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-700 capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{formatINR(item.amount)}</span>
                  <span className="text-slate-400 w-10 text-right">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Cost by Day Action Button (Screen 11) */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowDayCostModal(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 transition"
          >
            <Calendar size={16} /> View Cost by Day
          </button>
        </div>
      </div>

      {/* Itemized Expenses List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Itemized Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No individual expenses logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <div key={expense.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{expense.description}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{expense.category} • Paid by {expense.paid_by_member_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">{formatINR(expense.amount)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-slate-400 hover:text-red-600 transition"
                    title="Delete expense"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. 3500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Flight ticket, Museum entry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white capitalize"
                >
                  <option value="flights">Flights</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="activities">Activities</option>
                  <option value="transport">Transport</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day by Day Cost Modal */}
      {showDayCostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Cost by Day Breakdown</h3>
              <button
                onClick={() => setShowDayCostModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {[
                { day: 'Day 1 (Arrival & Paris)', cost: 18500, desc: 'Flight + Airport Taxi + Dinner' },
                { day: 'Day 2 (Paris Sightseeing)', cost: 7700, desc: 'Louvre Museum + Seine Cruise' },
                { day: 'Day 3 (Swiss Alps Transfer)', cost: 22000, desc: 'High-speed Train + Swiss Hotel' },
                { day: 'Day 4 (Jungfraujoch Peak)', cost: 16500, desc: 'Top of Europe Excursion' },
                { day: 'Day 5 (Rome Exploration)', cost: 11200, desc: 'Colosseum VIP + Trastevere Walk' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{row.day}</h5>
                    <p className="text-[10px] text-slate-500">{row.desc}</p>
                  </div>
                  <span className="font-bold text-blue-700">{formatINR(row.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
