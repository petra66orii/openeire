import axios from "axios";

// Create an Axios instance for our API
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- UNIFIED INTERCEPTOR ---
// This handles BOTH User Authentication and Gallery Access
api.interceptors.request.use(
  (config) => {
    // 1. Handle User Auth (Login)
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Handle Gallery Guest Pass (The new feature)
    const gallerySession = localStorage.getItem('gallery_access');
    if (gallerySession) {
      try {
        const { code } = JSON.parse(gallerySession);
        if (code) {
          // This header tells the backend: "I have the password for the vault"
          config.headers['X-Gallery-Access-Token'] = code;
        }
      } catch (e) {
        console.error("Error parsing gallery access token", e);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- TYPES ---
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

export interface UserProfileUpdateData {
  username?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  default_phone_number?: string | null;
  default_street_address1?: string | null;
  default_street_address2?: string | null;
  default_town?: string | null;
  default_county?: string | null;
  default_postcode?: string | null;
  default_country?: string | null;
}

interface RegisterData {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
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
  user: string;
  rating: number;
  comment: string | null;
  created_at: string;
  admin_reply?: string | null;
}

export interface GalleryItem {
  id: number;
  title: string;
  preview_image?: string;
  thumbnail_image?: string;
  price: string;
  price_hd?: string;
  product_type: "photo" | "video" | "physical";
  starting_price?: string | number;
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

export interface OrderHistoryItem {
  id: number;
  quantity: number;
  item_total: string;
  details: any;
  product: GalleryItem;
}

export interface OrderHistory {
  order_number: string;
  date: string;
  order_total: string;
  total_price: string;
  street_address1: string;
  town: string;
  country: string;
  items: OrderHistoryItem[];
}

interface ChangeEmailData {
  new_email: string;
  password: string;
}

interface VerifyEmailResponse {
  message: string;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface ProductVariant {
  id: number;
  material: string;
  material_display: string;
  size: string;
  size_display: string;
  price: string;
  sku: string | null;
}

export interface PhotoDetail extends GalleryItem {
  description: string;
  collection: string;
  high_res_file: string;
  price_4k: string;
  tags: string | null;
  created_at: string;
  variants: ProductVariant[]; 
  related_products: GalleryItem[];
}

export interface VideoDetail extends GalleryItem {
  description: string;
  collection: string;
  video_file: string;
  price_4k: string;
  tags: string | null;
  created_at: string;
  duration?: number;
  resolution?: string;
  frame_rate?: string;
  related_products: GalleryItem[];
}

export interface ProductDetail extends GalleryItem {
  photo: PhotoDetail; 
  material: string;
  size: string;
  sku: string | null;
  material_display?: string; 
  size_display?: string;
}

export type ProductDetailItem = PhotoDetail | VideoDetail | ProductDetail;

export interface ReviewSubmitData {
  rating: number;
  comment?: string; // Optional as per requirement
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API METHODS
export const getOrderHistory = async (): Promise<OrderHistory[]> => {
  try {
    const response = await api.get("checkout/order-history/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const registerUser = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("auth/register/", {
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

export const changePassword = async (
  data: ChangePasswordData
): Promise<{ message: string }> => {
  try {
    const response = await api.put("auth/password/change/", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get<Testimonial[]>("home/testimonials/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const newsletterSignup = async (
  email: string
): Promise<{ email: string }> => {
  try {
    const response = await api.post("home/newsletter-signup/", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getComments = async (postSlug: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(
      `blog/posts/${postSlug}/comments/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const postComment = async (
  postSlug: string,
  content: string
): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(
      `blog/posts/${postSlug}/comments/`,
      { content }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const verifyEmail = async (
  token: string
): Promise<VerifyEmailResponse> => {
  try {
    const response = await api.post<VerifyEmailResponse>(
      "auth/verify-email/confirm/",
      { token }
    );
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
    const response = await api.post<LoginResponse>("auth/login/", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("auth/password/reset/", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const confirmPasswordReset = async (
  password: string,
  confirm_password: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("auth/password/reset/confirm/", {
      password,
      confirm_password,
      token,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("auth/profile/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateProfile = async (
  profileData: UserProfileUpdateData
): Promise<UserProfile> => {
  try {
    const response = await api.patch<UserProfile>("auth/profile/", profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get('auth/countries/'); 
  return response.data;
};

export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("auth/resend-verification/", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getGalleryProducts = async (
  type: "digital" | "physical" | "all",
  collection?: string,
  search?: string,
  sort?: string
): Promise<PaginatedResponse<GalleryItem>> => {
  try {
    const response = await api.get<PaginatedResponse<GalleryItem>>("gallery/", {
      params: {
        type: type === "all" ? undefined : type,
        collection: collection === "all" ? undefined : collection,
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

export const getProductDetail = async (
  type: string,
  id: string
): Promise<ProductDetailItem> => {
  let url = "";
  switch (type) {
    case "photo":
      url = `photos/${id}/`; // Uses DigitalPhotoDetailView (Protected)
      break;
    case "video":
      url = `videos/${id}/`; // Uses VideoDetailView (Protected)
      break;
    case "physical":
      url = `products/${id}/`; // Uses PhysicalPhotoDetailView (Public)
      break;
    default:
      throw new Error("Invalid product type");
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

export const submitProductReview = async (
  productType: string,
  productId: string,
  reviewData: ReviewSubmitData
): Promise<any> => {
  try {
    const response = await api.post(
      `${productType}/${productId}/reviews/`,
      reviewData
    );
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
    const response = await api.get<ProductReview[]>(
      `${productType}/${productId}/reviews/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getBlogPosts = async (): Promise<
  PaginatedResponse<BlogPostListItem>
> => {
  try {
    const response = await api.get<PaginatedResponse<BlogPostListItem>>(
      "blog/posts/"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getBlogPostDetail = async (
  slug: string
): Promise<BlogPostDetail> => {
  try {
    const response = await api.get<BlogPostDetail>(`blog/posts/${slug}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const sendContactMessage = async (contactData: ContactData) => {
  try {
    const response = await api.post("home/contact/", contactData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const changeEmail = async (data: ChangeEmailData) => {
  const response = await api.post('auth/email/change', data);
  return response.data;
};

export const deleteAccount = async (password: string) => {
  const response = await api.delete('auth/delete/', {
    data: { password }
  });
  return response.data;
};

export const requestGalleryAccess = async (email: string) => {
  const response = await api.post("gallery-request/", { email });
  return response.data;
};

export const verifyGalleryAccess = async (access_code: string) => {
  const response = await api.post("gallery-verify/", { access_code });
  return response.data;
};

export const getShoppingBagRecommendations = async (): Promise<GalleryItem[]> => {
  const response = await api.get('/products/recommendations/');
  return response.data;
};