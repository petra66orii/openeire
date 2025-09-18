import axios from 'axios';

// Create an Axios instance for our API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserProfile {
  username: string;
  email: string;
  default_phone_number: string | null;
  default_street_address1: string | null;
  default_street_address2: string | null;
  default_town: string | null;
  default_county: string | null;
  default_postcode: string | null;
  default_country: string | null;
}
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  // We won't get the password back, but other user details might be here
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

// Axios Interceptor: This function will run before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type UserProfileUpdateData = Partial<UserProfile>;

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('auth/register/', {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    // This is crucial for handling errors from the backend
    if (axios.isAxiosError(error) && error.response) {
      // The backend will send error details in error.response.data
      throw error.response.data;
    }
    throw error;
  }
};

interface VerifyEmailResponse {
  message: string;
}

export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  try {
    const response = await api.post<VerifyEmailResponse>('auth/verify-email/confirm/', { token });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/login/', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await api.post('auth/password/reset/', { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const confirmPasswordReset = async (password: string, confirm_password: string, token: string): Promise<{ message: string }> => {
  try {
    const response = await api.post('auth/password/reset/confirm/', { password, confirm_password, token });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>('profile/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const updateProfile = async (profileData: UserProfileUpdateData): Promise<UserProfile> => {
  try {
    // We use a PUT request to the same profile endpoint
    const response = await api.put<UserProfile>('profile/', profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};