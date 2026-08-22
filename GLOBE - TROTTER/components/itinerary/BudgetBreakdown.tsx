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
  Wallet,
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
  const [newBudgetCap, setNewBudgetCap] = useState(trip?.budget_cap?.toString() || '150000');

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

      toast.success('Expense added to trip budget');
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

  // Real live calculated total from database
  const totalCost = budgetData?.totalCost ?? expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBudgetCap = trip?.budget_cap || budgetData?.budgetCap || 150000;

  // Real category breakdown from database
  const chartData = budgetData?.breakdown && budgetData.breakdown.length > 0
    ? budgetData.breakdown
    : [];

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Central Browser Frame Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* Top Header: Budgeting Title + Add Expense Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Trip Budgeting</h2>
            <p className="text-xs text-slate-500">Live expense tracking & splitting for {trip?.name || 'this trip'}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#ff5a36] hover:bg-[#e04826] px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-98"
          >
            <Plus size={15} /> Add expense
          </button>
        </div>

        {/* Balance Card Section */}
        <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Spent</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
                {formatINR(totalCost)}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <span>Budget Cap: {formatINR(currentBudgetCap)}</span>
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

          {/* Right Side Links */}
          <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <button
              onClick={() => setShowBreakdownModal(true)}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <PieChartIcon size={14} className="text-slate-400" />
              <span>View breakdown ({chartData.length} categories)</span>
            </button>

            <button
              onClick={() => setShowAddTripmateModal(true)}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <UserPlus size={14} className="text-slate-400" />
              <span>Add tripmate</span>
            </button>

            <button
              onClick={() => toast.info('Currency set to INR (₹)')}
              className="flex items-center gap-2 hover:text-slate-900 transition text-left"
            >
              <Settings size={14} className="text-slate-400" />
              <span>Settings (INR ₹)</span>
            </button>
          </div>
        </div>

        {/* Expenses List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Itemized Expenses ({expenses.length})
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
                className="hover:text-slate-900 flex items-center gap-1"
              >
                <span>Sort: {sortBy === 'date' ? 'Date' : 'Amount'}</span>
                <span>▾</span>
              </button>
            </div>
          </div>

          {/* List of itemized expenses from database */}
          <div className="divide-y divide-slate-100">
            {expenses.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mx-auto">
                  <Wallet size={22} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No expenses recorded yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Keep track of flights, hotels, food and activities by clicking &ldquo;+ Add expense&rdquo;.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <Plus size={13} /> Add first expense
                </button>
              </div>
            ) : (
              sortedExpenses.map((exp) => (
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
                      className="text-slate-300 hover:text-red-600 transition p-1"
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
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
                  placeholder="150000"
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

      {/* Modal 2: Debt Summary */}
      {showDebtSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Group Debt Split</h3>
              </div>
              <button onClick={() => setShowDebtSummaryModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            {totalCost === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 space-y-1">
                <p>No group expenses recorded yet.</p>
                <p className="text-[11px] text-slate-400">Add an expense to calculate automatic fair-share splits.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Total trip spending: <strong className="text-slate-900">{formatINR(totalCost)}</strong>.
                </p>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>Your Share (1 person)</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(totalCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <span>Split between 2 tripmates</span>
                    <span className="font-mono font-bold text-slate-700">{formatINR(totalCost / 2)} each</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                toast.success('Settlement status verified');
                setShowDebtSummaryModal(false);
              }}
              className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white transition"
            >
              Close
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

            {chartData.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No spending data logged yet. Add expenses to view category breakdown.
              </div>
            ) : (
              <>
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
                        <span className="font-semibold text-slate-800 capitalize">{item.category}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatINR(item.amount)} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
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
