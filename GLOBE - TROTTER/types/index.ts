export type City = {
  id: string;
  name: string;
  country: string;
  region?: string;
  cost_index: number;
  image_url: string | null;
  description?: string;
  lat?: number;
  lng?: number;
};

export type Activity = {
  id: string;
  city_id: string;
  name: string;
  cost: number;
  duration_min: number;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation';
  image_url: string | null;
  description?: string;
  includes?: string[];
  best_time?: string;
  lat?: number;
  lng?: number;
};

export type Lodging = {
  name?: string;
  checkIn?: string;
  checkOut?: string;
  confirmationCode?: string;
  address?: string;
};

export type Reservation = {
  id?: string;
  type: string;
  name: string;
  time?: string;
  confirmationCode?: string;
};

export type Attachment = {
  id?: string;
  name: string;
  url: string;
  type?: string;
};

export type StopActivity = {
  id: string;
  stop_id: string;
  activity_id: string;
  scheduled_time: string | null;
  activities?: Activity;
};

export type Stop = {
  id: string;
  trip_id: string;
  city_id: string;
  arrive_date: string;
  leave_date: string;
  order: number;
  cities?: City;
  stop_activities?: StopActivity[];
  lodging?: Lodging;
  reservations?: Reservation[];
  attachments?: Attachment[];
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
