export interface Company {
  id: number;
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: number;
  created_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company_id?: number;
  role: 'APPLICANT' | 'ADMIN';
  created_at: string;
}

export interface Application {
  id?: number;
  user_id?: number;
  council_waiting_list_number?: string;
  name: string;
  surname: string;
  id_number: string;
  dob: string;
  residential_address: string;
  contact_numbers: string;
  employer?: string;
  department?: string;
  employment_number?: string;
  employer_contact?: string;
  status?: 'NOT YET APPROVED' | 'APPROVED' | 'DISAPPROVED';
  created_at?: string;
}

export interface NextOfKin {
  id?: number;
  application_id?: number;
  name: string;
  surname: string;
  id_number: string;
  dob: string;
  relation: string;
  profession?: string;
  address?: string;
  cell?: string;
}

export interface Spouse {
  id?: number;
  application_id?: number;
  name: string;
  surname: string;
  id_number: string;
  dob: string;
}

export interface Beneficiary {
  id?: number;
  application_id?: number;
  name: string;
  dob: string;
  id_number: string;
}

export interface Payment {
  id?: number;
  application_id?: number;
  amount: number;
  currency?: string;
  description?: string;
  receipt_number: string;
  created_at?: string;
}

export interface Document {
  id?: number;
  application_id?: number;
  kind: 'ID_SCAN' | 'PROOF_OF_RESIDENCE' | 'PAYSLIP' | 'SIGNATURE';
  path: string;
}

export interface ApplicationWithRelations extends Application {
  next_of_kin?: NextOfKin;
  spouse?: Spouse;
  beneficiaries?: Beneficiary[];
  documents?: Document[];
  payments?: Payment[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  company_id?: number;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  user_role: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}