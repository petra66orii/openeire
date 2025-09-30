import axios from 'axios';

// Create an Axios instance for our API
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserProfile {
  username: string;
  first_name: string | null;
  last_name: string | null;
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

export interface ProductReview {
  id: number;
  user: string; // The username of the reviewer
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  preview_image?: string; // For Photos and Physical Products
  thumbnail_image?: string; // For Videos
  price: string; // From physical products
  price_hd?: string; // From digital products
  product_type: 'photo' | 'video' | 'physical';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  author: string;
  featured_image: string | null;
  excerpt: string;
  created_at: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  updated_at: string;
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

export interface Comment {
  id: number;
  user: string; // Username
  content: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get<Testimonial[]>('home/testimonials/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const newsletterSignup = async (email: string): Promise<{ email: string }> => {
  try {
    const response = await api.post('home/newsletter-signup/', { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const getComments = async (postSlug: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`blog/posts/${postSlug}/comments/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const postComment = async (postSlug: string, content: string): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`blog/posts/${postSlug}/comments/`, { content });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

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
    const response = await api.get<UserProfile>('auth/profile/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const updateProfile = async (profileData: UserProfileUpdateData): Promise<UserProfile> => {
  try {
    // We use a PUT request to the same profile endpoint
    const response = await api.put<UserProfile>('auth/profile/', profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};


export const getGalleryProducts = async (
  type: 'digital' | 'physical' | 'all',
  collection?: string,
  search?: string,
  sort?: string
): Promise<PaginatedResponse<GalleryItem>> => {
  try {
    const response = await api.get<PaginatedResponse<GalleryItem>>('gallery/', {
      params: { 
        type: type === 'all' ? undefined : type,
        collection: collection === 'all' ? undefined : collection,
        search: search ? search : undefined,
        sort: sort ? sort : undefined,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export interface PhotoDetail extends GalleryItem {
  description: string;
  collection: string;
  high_res_file: string;
  price_4k: string;
  tags: string | null;
  created_at: string;
}

export interface VideoDetail extends GalleryItem {
  description: string;
  collection: string;
  video_file: string;
  price_4k: string;
  tags: string | null;
  created_at: string;
}

export interface ProductDetail extends GalleryItem {
  photo: PhotoDetail; // The full photo details are nested
  material: string;
  size: string;
  sku: string | null;
}

// A union type for any possible detail item
export type ProductDetailItem = PhotoDetail | VideoDetail | ProductDetail;

export const getProductDetail = async (
  type: string,
  id: string
): Promise<ProductDetailItem> => {
  let url = '';
  // Determine the correct endpoint based on the product type
  switch (type) {
    case 'photo':
      url = `photos/${id}/`;
      break;
    case 'video':
      url = `videos/${id}/`;
      break;
    case 'physical':
      url = `products/${id}/`;
      break;
    default:
      throw new Error('Invalid product type');
  }

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};


export interface ReviewSubmitData {
  rating: number;
  comment?: string; // Optional as per requirement
}

export const submitProductReview = async (
  productType: string,
  productId: string,
  reviewData: ReviewSubmitData
): Promise<any> => {
  try {
    const response = await api.post(`${productType}/${productId}/reviews/`, reviewData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getProductReviews = async (
  productType: string,
  productId: string
): Promise<ProductReview[]> => {
  try {
    const response = await api.get<ProductReview[]>(`${productType}/${productId}/reviews/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getBlogPosts = async (): Promise<PaginatedResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedResponse<BlogPostListItem>>('blog/posts/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};

export const getBlogPostDetail = async (slug: string): Promise<BlogPostDetail> => {
  try {
    const response = await api.get<BlogPostDetail>(`blog/posts/${slug}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) { throw error.response.data; }
    throw error;
  }
};