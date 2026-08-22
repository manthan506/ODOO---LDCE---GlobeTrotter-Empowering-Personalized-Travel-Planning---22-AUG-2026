'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MASTER_TRIP,
  MASTER_ACTIVITIES,
  MASTER_SECTIONS,
  MASTER_CALENDAR_SPANS,
  MASTER_DAY_SCHEDULE,
  ActivityItem,
  SectionItem,
  TripSpanItem,
  DayPlan,
} from '@/lib/tripDataSync';
import { toast } from 'sonner';

export interface UserProfileState {
  name: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
  language: string;
  currency: string;
}

export interface CustomExpense {
  id: string;
  category: 'transport' | 'accommodation' | 'activities' | 'food' | 'other';
  amount: number;
  description: string;
  paidBy: string;
  date: string;
}

interface TripSyncContextType {
  // Master Trip Info
  masterTrip: typeof MASTER_TRIP;
  updateMasterTrip: (updates: Partial<typeof MASTER_TRIP>) => void;

  // Sections (Builder Screen 5)
  sections: SectionItem[];
  addSection: (sec: SectionItem) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIdx: number, toIdx: number) => void;
  updateSection: (id: string, updates: Partial<SectionItem>) => void;

  // Day Schedules (Calendar Screen 10/11 & View Screen 6/7)
  daySchedule: Record<number, DayPlan>;
  addActivityToDay: (day: number, activity: ActivityItem) => void;
  removeActivityFromDay: (day: number, activityId: string) => void;
  reorderActivitiesInDay: (day: number, fromIdx: number, toIdx: number) => void;

  // Master Activities (Search & Explore Feature 8)
  activities: ActivityItem[];
  addedActivityIds: string[];
  toggleAddActivity: (activity: ActivityItem) => void;

  // Calendar Spans
  calendarSpans: TripSpanItem[];

  // Expenses & Budget (Budget Screen Feature 9)
  expenses: CustomExpense[];
  addExpense: (expense: Omit<CustomExpense, 'id'>) => void;
  removeExpense: (id: string) => void;
  totalCalculatedCost: number;
  totalBudgetCap: number;
  remainingBalance: number;
  avgDailyCost: number;

  // User Profile (Profile Screen 7)
  userProfile: UserProfileState;
  updateUserProfile: (updates: Partial<UserProfileState>) => void;

  // Saved Destinations
  savedDestinations: Array<{ id: string; name: string; country: string; img: string }>;
  removeSavedDestination: (id: string) => void;
  addSavedDestination: (dest: { id: string; name: string; country: string; img: string }) => void;

  // Reset to Demo Defaults
  resetAllToDemoDefaults: () => void;
}

const TripSyncContext = createContext<TripSyncContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRIP: 'globetrotter_sync_trip_v2',
  SECTIONS: 'globetrotter_sync_sections_v2',
  DAY_SCHEDULE: 'globetrotter_sync_days_v2',
  ACTIVITIES: 'globetrotter_sync_acts_v2',
  ADDED_ACT_IDS: 'globetrotter_sync_added_ids_v2',
  EXPENSES: 'globetrotter_sync_expenses_v2',
  USER_PROFILE: 'globetrotter_sync_profile_v2',
  SAVED_DESTS: 'globetrotter_sync_saved_v2',
};

const DEFAULT_EXPENSES: CustomExpense[] = [
  { id: 'exp-1', category: 'transport', amount: 54000, description: 'Return International Flights & Swiss Glacier Passes', paidBy: 'Manthan Saraiya', date: '2026-08-20' },
  { id: 'exp-2', category: 'accommodation', amount: 49000, description: '4-Star Boutique Hotels & Alpine Chalets', paidBy: 'Manthan Saraiya', date: '2026-08-21' },
  { id: 'exp-3', category: 'activities', amount: 29000, description: 'Louvre, Jungfraujoch & Colosseum Tickets', paidBy: 'Manthan Saraiya', date: '2026-08-22' },
  { id: 'exp-4', category: 'food', amount: 12000, description: 'Bistro Dinners, Swiss Fondue & Trastevere Tastings', paidBy: 'Manthan Saraiya', date: '2026-08-22' },
  { id: 'exp-5', category: 'other', amount: 8000, description: 'Luggage Insurance & Alpine Souvenirs', paidBy: 'Manthan Saraiya', date: '2026-08-22' },
];

const DEFAULT_PROFILE: UserProfileState = {
  name: 'Manthan Saraiya',
  email: 'manthan@globetrotter.io',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
  location: 'Ahmedabad, India',
  bio: 'Passionate global explorer, mountaineer, and digital nomad crafting high-altitude adventures.',
  language: 'English (US)',
  currency: '₹ INR (Indian Rupee)',
};

const DEFAULT_SAVED_DESTS = [
  { id: 'sd-1', name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { id: 'sd-2', name: 'Interlaken', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
  { id: 'sd-3', name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
  { id: 'sd-4', name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { id: 'sd-5', name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 'sd-6', name: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
];

export function TripSyncProvider({ children }: { children: React.ReactNode }) {
  // 1. Master Trip State
  const [masterTrip, setMasterTrip] = useState<typeof MASTER_TRIP>(() => {
    if (typeof window === 'undefined') return MASTER_TRIP;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIP);
      return stored ? JSON.parse(stored) : MASTER_TRIP;
    } catch {
      return MASTER_TRIP;
    }
  });

  // 2. Sections State
  const [sections, setSections] = useState<SectionItem[]>(() => {
    if (typeof window === 'undefined') return MASTER_SECTIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return stored ? JSON.parse(stored) : MASTER_SECTIONS;
    } catch {
      return MASTER_SECTIONS;
    }
  });

  // 3. Day Schedule State
  const [daySchedule, setDaySchedule] = useState<Record<number, DayPlan>>(() => {
    if (typeof window === 'undefined') return MASTER_DAY_SCHEDULE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAY_SCHEDULE);
      return stored ? JSON.parse(stored) : MASTER_DAY_SCHEDULE;
    } catch {
      return MASTER_DAY_SCHEDULE;
    }
  });

  // 4. Activities & Added List
  const [activities] = useState<ActivityItem[]>(MASTER_ACTIVITIES);
  const [addedActivityIds, setAddedActivityIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['p-1', 'p-2', 'p-3', 's-1', 's-2', 's-3', 'r-1', 'r-2', 'r-3'];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADDED_ACT_IDS);
      return stored ? JSON.parse(stored) : ['p-1', 'p-2', 'p-3', 's-1', 's-2', 's-3', 'r-1', 'r-2', 'r-3'];
    } catch {
      return ['p-1', 'p-2', 'p-3', 's-1', 's-2', 's-3', 'r-1', 'r-2', 'r-3'];
    }
  });

  // 5. Custom Expenses State
  const [expenses, setExpenses] = useState<CustomExpense[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_EXPENSES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return stored ? JSON.parse(stored) : DEFAULT_EXPENSES;
    } catch {
      return DEFAULT_EXPENSES;
    }
  });

  // 6. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfileState>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 7. Saved Destinations State
  const [savedDestinations, setSavedDestinations] = useState<Array<{ id: string; name: string; country: string; img: string }>>(() => {
    if (typeof window === 'undefined') return DEFAULT_SAVED_DESTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_DESTS);
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_DESTS;
    } catch {
      return DEFAULT_SAVED_DESTS;
    }
  });

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIP, JSON.stringify(masterTrip));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
      localStorage.setItem(STORAGE_KEYS.DAY_SCHEDULE, JSON.stringify(daySchedule));
      localStorage.setItem(STORAGE_KEYS.ADDED_ACT_IDS, JSON.stringify(addedActivityIds));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEYS.SAVED_DESTS, JSON.stringify(savedDestinations));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [masterTrip, sections, daySchedule, addedActivityIds, expenses, userProfile, savedDestinations]);

  // Derived Financial Calculations
  const totalCalculatedCost = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const totalBudgetCap = masterTrip.budgetCap || 160000;
  const remainingBalance = Math.max(0, totalBudgetCap - totalCalculatedCost);
  const avgDailyCost = Math.round(totalCalculatedCost / (masterTrip.daysCount || 14));

  // Handlers
  const updateMasterTrip = (updates: Partial<typeof MASTER_TRIP>) => {
    setMasterTrip((prev) => ({ ...prev, ...updates }));
    toast.success('Trip details updated and synchronized across all views!');
  };

  const addSection = (newSec: SectionItem) => {
    setSections((prev) => [...prev, newSec]);
    // Auto increment expense for accommodation / section budget
    setExpenses((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        category: newSec.category === 'hotel' ? 'accommodation' : newSec.category === 'travel' ? 'transport' : 'activities',
        amount: newSec.budget,
        description: `Budget allocation for ${newSec.title}`,
        paidBy: userProfile.name,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    toast.success(`Section "${newSec.title}" added and synchronized!`);
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    toast.success('Section removed and synchronized');
  };

  const reorderSections = (fromIdx: number, toIdx: number) => {
    setSections((prev) => {
      const list = [...prev];
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list;
    });
    toast.success('Sections order updated!');
  };

  const updateSection = (id: string, updates: Partial<SectionItem>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    toast.success('Section updated!');
  };

  const addActivityToDay = (day: number, activity: ActivityItem) => {
    setDaySchedule((prev) => {
      const existing = prev[day] || {
        dayNumber: day,
        date: `Sep ${day}, 2026`,
        dayOfMonth: day,
        city: activity.city,
        country: activity.country,
        title: `${activity.city} Exploration`,
        dailyCap: 12000,
        activities: [],
      };
      return {
        ...prev,
        [day]: {
          ...existing,
          activities: [...existing.activities, activity],
        },
      };
    });

    // Also track in added IDs
    setAddedActivityIds((prev) => (prev.includes(activity.id) ? prev : [...prev, activity.id]));

    // Synchronize expense
    setExpenses((prev) => [
      ...prev,
      {
        id: `exp-act-${activity.id}-${Date.now()}`,
        category: 'activities',
        amount: activity.cost,
        description: `${activity.name} (${activity.city})`,
        paidBy: userProfile.name,
        date: `2026-09-${String(day).padStart(2, '0')}`,
      },
    ]);

    toast.success(`Added "${activity.name}" to Sep ${day}!`);
  };

  const removeActivityFromDay = (day: number, activityId: string) => {
    setDaySchedule((prev) => {
      if (!prev[day]) return prev;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          activities: prev[day].activities.filter((a) => a.id !== activityId),
        },
      };
    });
    toast.success('Activity removed from day schedule');
  };

  const reorderActivitiesInDay = (day: number, fromIdx: number, toIdx: number) => {
    setDaySchedule((prev) => {
      if (!prev[day]) return prev;
      const acts = [...prev[day].activities];
      const [moved] = acts.splice(fromIdx, 1);
      acts.splice(toIdx, 0, moved);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          activities: acts,
        },
      };
    });
  };

  const toggleAddActivity = (act: ActivityItem) => {
    const isAdded = addedActivityIds.includes(act.id);
    if (isAdded) {
      setAddedActivityIds((prev) => prev.filter((id) => id !== act.id));
      toast.info(`Removed "${act.name}" from customized stops`);
    } else {
      setAddedActivityIds((prev) => [...prev, act.id]);
      toast.success(`Added "${act.name}" to stop experiences!`);
    }
  };

  const addExpense = (newExp: Omit<CustomExpense, 'id'>) => {
    const created: CustomExpense = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [created, ...prev]);
    toast.success(`Recorded expense of ₹${newExp.amount.toLocaleString('en-IN')}!`);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success('Expense deleted');
  };

  const updateUserProfile = (updates: Partial<UserProfileState>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    toast.success('Profile details updated across all screens!');
  };

  const removeSavedDestination = (id: string) => {
    setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const addSavedDestination = (dest: { id: string; name: string; country: string; img: string }) => {
    setSavedDestinations((prev) => (prev.some((d) => d.id === dest.id) ? prev : [...prev, dest]));
    toast.success(`Saved ${dest.name} to wishlist!`);
  };

  const resetAllToDemoDefaults = () => {
    localStorage.clear();
    setMasterTrip(MASTER_TRIP);
    setSections(MASTER_SECTIONS);
    setDaySchedule(MASTER_DAY_SCHEDULE);
    setAddedActivityIds(['p-1', 'p-2', 'p-3', 's-1', 's-2', 's-3', 'r-1', 'r-2', 'r-3']);
    setExpenses(DEFAULT_EXPENSES);
    setUserProfile(DEFAULT_PROFILE);
    setSavedDestinations(DEFAULT_SAVED_DESTS);
    toast.success('All demo data restored to pristine synchronization!');
  };

  return (
    <TripSyncContext.Provider
      value={{
        masterTrip,
        updateMasterTrip,
        sections,
        addSection,
        removeSection,
        reorderSections,
        updateSection,
        daySchedule,
        addActivityToDay,
        removeActivityFromDay,
        reorderActivitiesInDay,
        activities,
        addedActivityIds,
        toggleAddActivity,
        calendarSpans: MASTER_CALENDAR_SPANS,
        expenses,
        addExpense,
        removeExpense,
        totalCalculatedCost,
        totalBudgetCap,
        remainingBalance,
        avgDailyCost,
        userProfile,
        updateUserProfile,
        savedDestinations,
        removeSavedDestination,
        addSavedDestination,
        resetAllToDemoDefaults,
      }}
    >
      {children}
    </TripSyncContext.Provider>
  );
}

export function useTripSync() {
  const context = useContext(TripSyncContext);
  if (!context) {
    throw new Error('useTripSync must be used within a TripSyncProvider');
  }
  return context;
}
