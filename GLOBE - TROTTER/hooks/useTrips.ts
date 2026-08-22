'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Trip, TripWithDetails, City, Activity, TripMember, Expense, Stop } from '@/types';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, refetch: fetchTrips };
}

export function useTrip(tripId: string | undefined) {
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, { credentials: 'include' });
      if (res.ok) {
        const data: TripWithDetails = await res.json();
        if (data?.stops) {
          data.stops.sort((a, b) => a.order - b.order);
        }
        setTrip(data);
      }
    } catch (err) {
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return { trip, loading, refetch: fetchTrip };
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cities:', err);
        setLoading(false);
      });
  }, []);

  return { cities, loading };
}

export function useCityActivities(cityId: string | undefined) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cityId) {
      setActivities([]);
      return;
    }
    setLoading(true);
    fetch(`/api/cities/${cityId}/activities`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching city activities:', err);
        setLoading(false);
      });
  }, [cityId]);

  return { activities, loading };
}

export function useTripMembers(tripId: string | undefined) {
  const [members, setMembers] = useState<TripMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, { credentials: 'include' });
      if (res.ok) {
        const data: TripWithDetails = await res.json();
        setMembers(data.trip_members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, refetch: fetchMembers };
}

export function useExpenses(tripId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, refetch: fetchExpenses };
}

export type { Trip, TripWithDetails, City, Activity, TripMember, Expense, Stop };
