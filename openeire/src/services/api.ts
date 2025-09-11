import axios from 'axios';

// Create an Axios instance for our API
const api = axios.create({
  // This is the base URL for our Django backend
  // Make sure your Django dev server is running (e.g., on http://127.0.0.1:8000)
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
