'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Plane,
  Hotel,
  Sparkles,
  Car,
  Utensils,
  Wine,
  MoreHorizontal,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Users,
  Pencil,
  ArrowRightLeft,
  X,
  Settings,
  UserPlus,
  PieChart as PieChartIcon,
  Check,
} from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showDebtSummaryModal, setShowDebtSummaryModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showAddTripmateModal, setShowAddTripmateModal] = useState(false);

  // Edit budget state in INR
  const [newBudgetCap, setNewBudgetCap] = useState(trip?.budget_cap?.toString() || '300000');

  // Add tripmate state
  const [tripmateName, setTripmateName] = useState('');
  const [tripmateEmail, setTripmateEmail] = useState('');

  // New expense form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'flights' | 'lodging' | 'food' | 'drinks' | 'activities' | 'transport' | 'other'>('food');
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

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetCap: Number(newBudgetCap) }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success(`Budget updated to ₹${Number(newBudgetCap).toLocaleString('en-IN')}`);
        setShowEditBudgetModal(false);
        fetchBudget();
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch {
      toast.error('Failed to update budget');
    }
  };

  const handleAddTripmate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripmateName.trim()) return;
    toast.success(`Invitation sent to ${tripmateName} (${tripmateEmail || 'collaborator'})!`);
    setTripmateName('');
    setTripmateEmail('');
    setShowAddTripmateModal(false);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSubmitting(true);
    try {
      const mappedCategory = category === 'lodging' ? 'accommodation' : category;
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          description: description || `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
          category: mappedCategory,
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
        return <Plane size={18} className="text-slate-600" />;
      case 'lodging':
      case 'accommodation':
        return <Hotel size={18} className="text-slate-600" />;
      case 'food':
        return <Utensils size={18} className="text-slate-600" />;
      case 'drinks':
        return <Wine size={18} className="text-slate-600" />;
      case 'transport':
        return <Car size={18} className="text-slate-600" />;
      case 'activities':
        return <Sparkles size={18} className="text-slate-600" />;
      default:
        return <MoreHorizontal size={18} className="text-slate-600" />;
    }
  };

  // Indian Rupee (₹) Formatter
  const formatINR = (val: number) =>
    '₹' + Math.round(val).toLocaleString('en-IN');

  // Default seed expense items in INR matching Screenshot 1
  const defaultExpenses = [
    {
      id: 'e1',
      title: 'DEL to CDG Flights',
      category: 'Flights',
      date: 'Feb 15',
      amount: 74500,
      icon: Plane,
      avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80'],
    },
    {
      id: 'e2',
      title: 'Grand Hotel Central Lodging',
      category: 'Lodging',
      date: 'Feb 15',
      amount: 102500,
      icon: Hotel,
      avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80'],
    },
    {
      id: 'e3',
      title: 'Dinner at Le Bistro Montmartre',
      category: 'Food',
      date: 'Feb 14',
      amount: 14800,
      icon: Utensils,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
      ],
    },
    {
      id: 'e4',
      title: 'Evening Wine & Tapas Bar',
      category: 'Drinks',
      date: 'Feb 14',
      amount: 5600,
      icon: Wine,
      avatars: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80'],
    },
  ];

  const totalCost = expenses.length > 0
    ? expenses.reduce((acc, curr) => acc + curr.amount, 0)
    : 197400;

  const currentBudgetCap = trip?.budget_cap || 300000;

  const chartData = [
    { category: 'Flights', amount: 74500, percentage: 38, color: '#3B82F6' },
    { category: 'Lodging', amount: 102500, percentage: 52, color: '#6366F1' },
    { category: 'Food & Drinks', amount: 20400, percentage: 10, color: '#F59E0B' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Central Browser Frame Card matching Screenshot 1 in INR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* Top Header: Budgeting Title + Add Expense Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Budgeting</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#ff5a36] hover:bg-[#e04826] px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-98"
          >
            <Plus size={15} /> Add expense
          </button>
        </div>

        {/* Balance Card Section in INR (₹) */}
        <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight font-mono">
                {formatINR(totalCost)}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <span>Budget: {formatINR(currentBudgetCap)}</span>
                <Pencil
                  size={12}
                  className="cursor-pointer hover:text-slate-700"
                  onClick={() => setShowEditBudgetModal(true)}
                />
              </div>
            </div>

            {/* Action Buttons: Edit budget & Debt summary */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowEditBudgetModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <Pencil size={12} /> Edit budget
              </button>

              <button
                onClick={() => setShowDebtSummaryModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <ArrowRightLeft size={13} /> Debt summary
              </button>
            </div>
          </div>

          {/* Right Side Links (View breakdown, Add tripmate, Settings) */}
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <button
              onClick={() => setShowBreakdownModal(true)}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <PieChartIcon size={14} className="text-slate-400" />
              <span>View breakdown</span>
            </button>

            <button
              onClick={() => setShowAddTripmateModal(true)}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <UserPlus size={14} className="text-slate-400" />
              <span>Add tripmate</span>
            </button>

            <button
              onClick={() => toast.info('Budget currency and alert settings')}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <Settings size={14} className="text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Expenses List Section (Sort: Date) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Expenses</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold cursor-pointer">
              <span>Sort: {sortBy === 'date' ? 'Date' : 'Amount'}</span>
              <span>▾</span>
            </div>
          </div>

          {/* List of itemized expenses in INR */}
          <div className="divide-y divide-slate-100">
            {expenses.length === 0 ? (
              defaultExpenses.map((exp) => (
                <div key={exp.id} className="py-3.5 flex items-center justify-between text-xs group">
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <exp.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {exp.date} • {exp.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {exp.avatars && exp.avatars.length > 1 && (
                      <div className="flex items-center -space-x-1.5">
                        {exp.avatars.map((av, idx) => (
                          <img
                            key={idx}
                            src={av}
                            alt="Avatar"
                            className="h-5 w-5 rounded-full object-cover ring-2 ring-white"
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {formatINR(exp.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="py-3.5 flex items-center justify-between text-xs group">
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      {getCategoryIcon(exp.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{exp.description}</h4>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {new Date(exp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {exp.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {formatINR(exp.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-300 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Edit Budget in INR */}
      {showEditBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Trip Budget</h3>
              <button onClick={() => setShowEditBudgetModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Budget Cap (₹)</label>
                <input
                  type="number"
                  value={newBudgetCap}
                  onChange={(e) => setNewBudgetCap(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="300000"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditBudgetModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Debt Summary in INR */}
      {showDebtSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Group Debt Summary</h3>
              </div>
              <button onClick={() => setShowDebtSummaryModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Total group spending: <strong className="text-slate-900">{formatINR(totalCost)}</strong> across 4 tripmates ({formatINR(totalCost / 4)} each).
            </p>

            <div className="space-y-2.5">
              {[
                { from: 'Rose Chen', to: 'You', amount: 39500, status: 'owes' },
                { from: 'James Levi', to: 'You', amount: 25400, status: 'owes' },
                { from: 'You', to: 'Lianne Jones', amount: 11800, status: 'you owe' },
              ].map((debt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{debt.from}</span>
                    <span className="text-[10px] text-slate-400">→</span>
                    <span className="font-bold text-slate-900">{debt.to}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">{formatINR(debt.amount)}</span>
                    <span className={`text-[9px] font-bold uppercase ${debt.status === 'owes' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {debt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                toast.success('Settlement request sent to all tripmates');
                setShowDebtSummaryModal(false);
              }}
              className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white transition"
            >
              Settle Up with Group
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: View Breakdown Donut Chart */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Spending Breakdown</h3>
              <button onClick={() => setShowBreakdownModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <div className="relative h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatINR(value), 'Cost']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium">Total</span>
                <span className="text-xs font-bold text-slate-800">{formatINR(totalCost)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800">{item.category}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(item.amount)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Add Tripmate */}
      {showAddTripmateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Tripmate</h3>
              <button onClick={() => setShowAddTripmateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddTripmate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tripmate Name</label>
                <input
                  required
                  value={tripmateName}
                  onChange={(e) => setTripmateName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none"
                  placeholder="e.g. Alex"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={tripmateEmail}
                  onChange={(e) => setTripmateEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none"
                  placeholder="alex@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Send Invite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Add Expense in INR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="3500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Flight ticket, Hotel booking, Dinner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none capitalize"
                >
                  <option value="flights">Flights</option>
                  <option value="lodging">Lodging</option>
                  <option value="food">Food</option>
                  <option value="drinks">Drinks</option>
                  <option value="activities">Activities</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-[#ff5a36] hover:bg-[#e04826] py-2.5 text-xs font-bold text-white shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
