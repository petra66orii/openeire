export interface UserProfile {
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  is_staff: boolean;
  default_phone_number: string | null;
  default_street_address1: string | null;
  default_street_address2: string | null;
  default_town: string | null;
  default_county: string | null;
  default_postcode: string | null;
  country: string | null;
  can_access_gallery?: boolean;
}

export interface Country {
  code: string;
  name: string;
}

export interface ProfileUpdatePayload {
  username: string;
  first_name?: string;
  last_name?: string;
  default_phone_number?: string | null;
  default_street_address1?: string | null;
  default_street_address2?: string | null;
  default_town?: string | null;
  default_county?: string | null;
  default_postcode?: string | null;
  country?: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface GoogleLoginPayload {
  code: string;
}

export interface RegisterPayload {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface RefreshPayload {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  password: string;
  confirm_password: string;
  token: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}
