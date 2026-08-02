export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  phone: string | null;
  role: Role;
  walletBalance: number;
  loyaltyPoints: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  pointsValue: number;
  active: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  costPoints: number;
  active: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string | null;
  name: string | null;
  email: string;
  loyaltyPoints: number;
}

export interface OrderItemInput {
  menuItemId: string;
  quantity: number;
}
