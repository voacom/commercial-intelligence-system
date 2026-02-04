/**
 * Single Source of Truth for API Definitions
 * 
 * All backend Pydantic models and Frontend Interfaces must align with these definitions.
 * 
 * @backend_path backend/models.py
 * @frontend_usage Imported in API services
 */

export interface User {
  id: string; // UUID
  email: string;
  name: string | null;
  role: 'admin' | 'manager' | 'member';
  company_id: string | null; // UUID
  created_at: string; // ISO DateTime
  disabled?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string; // This maps to email in our system
  password: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// --- Feature Specific Schemas ---

export interface CRMClient {
  id: number;
  name: string;
  status: 'Potential' | 'Signed' | 'Negotiating';
  last_contact: string;
}

export interface DashboardStats {
  total_projects: number;
  active_clients: number;
  conversion_rate: string;
  revenue: string;
}
