export interface User {
  user_id: number;
  business_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PendingAccount extends User {
  verify_id: number;
  token: string;
  action?: 'accept' | 'decline';
} 