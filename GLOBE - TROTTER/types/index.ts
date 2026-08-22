export type City = {
  id: string;
  name: string;
  country: string;
  cost_index: number;
  image_url: string | null;
};

export type Activity = {
  id: string;
  city_id: string;
  name: string;
  cost: number;
  duration_min: number;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation';
  image_url: string | null;
};

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string | null;
  cover_image_url: string | null;
  budget_cap: number | null;
  created_at: string;
};

export type TripMember = {
  id: string;
  trip_id: string;
  name: string;
  email: string | null;
  color: string;
  created_at: string;
};

export type Stop = {
  id: string;
  trip_id: string;
  city_id: string;
  title?: string;
  description?: string;
  budget?: number;
  category?: string;
  arrive_date: string;
  leave_date: string;
  order: number;
  cities?: City;
  stop_activities?: StopActivity[];
};

export type StopActivity = {
  id: string;
  stop_id: string;
  activity_id: string;
  scheduled_time: string | null;
  activities?: Activity;
};

export type Expense = {
  id: string;
  trip_id: string;
  stop_id: string | null;
  paid_by_member_id: string;
  amount: number;
  description: string;
  category: string;
  split_among: string[];
  created_at: string;
};

export type TripWithDetails = Trip & {
  stops?: Stop[];
  trip_members?: TripMember[];
};
