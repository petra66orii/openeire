import axios from "axios";
import { emitErrorRoute } from "../utils/errorRouting";
import { normalizeApiPath } from "../utils/apiPath";
import { API_BASE_URL } from "../config/backend";

// Create an Axios instance for our API
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getRequestPath = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname.replace(/^\/api\//, "");
    } catch {
      return "";
    }
  }
  return normalizeApiPath(url);
};

export const isGalleryAccessScopedPath = (requestPath: string): boolean =>
  requestPath.startsWith("photos/") ||
  requestPath.startsWith("videos/") ||
  requestPath.startsWith("gallery/");

const isAbsoluteUrl = (url: string): boolean =>
  url.startsWith("http://") || url.startsWith("https://");

export const isSameApiOriginRequest = (
  url?: string,
  baseUrl?: string,
): boolean => {
  if (!url || !isAbsoluteUrl(url)) {
    return true;
  }

  if (!baseUrl) {
    return false;
  }

  try {
    const requestOrigin = new URL(url).origin;
    const apiOrigin = new URL(baseUrl).origin;
    return requestOrigin === apiOrigin;
  } catch {
    return false;
  }
};

export const shouldAttachGalleryAccessToken = (
  url?: string,
  baseUrl?: string,
): boolean =>
  isGalleryAccessScopedPath(getRequestPath(url)) &&
  isSameApiOriginRequest(url, baseUrl);

const shouldSkipForbiddenRouteRedirect = (requestPath: string): boolean =>
  isGalleryAccessScopedPath(requestPath);

const shouldHandleGlobalErrorRoute = (method?: string): boolean =>
  (method ?? "get").toLowerCase() === "get";

// --- UNIFIED INTERCEPTOR ---
// This handles BOTH User Authentication and Gallery Access
api.interceptors.request.use(
  (config) => {
    // 1. Handle User Auth (Login)
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Handle Gallery Guest Pass (Only for scoped digital-gallery endpoints)
    const gallerySession = localStorage.getItem("gallery_access");
    const apiBaseUrl =
      typeof config.baseURL === "string" ? config.baseURL : api.defaults.baseURL;
    if (
      gallerySession &&
      shouldAttachGalleryAccessToken(config.url, apiBaseUrl)
    ) {
      try {
        const { code } = JSON.parse(gallerySession);
        if (code) {
          // This header tells the backend: "I have the password for the vault"
          config.headers["X-Gallery-Access-Token"] = code;
        }
      } catch (e) {
        console.error("Error parsing gallery access token", e);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const method = error.config?.method;
      if (!shouldHandleGlobalErrorRoute(method)) {
        return Promise.reject(error);
      }

      const statusCode = error.response?.status;
      const requestPath = getRequestPath(error.config?.url);

      if (
        statusCode === 403 &&
        !shouldSkipForbiddenRouteRedirect(requestPath)
      ) {
        emitErrorRoute("/403");
      } else if (typeof statusCode === "number" && statusCode >= 500) {
        emitErrorRoute("/500");
      }
    }

    return Promise.reject(error);
  },
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

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export interface GalleryItem {
  id: number;
  title: string;
  preview_image?: string;
  thumbnail_image?: string;
  collection: string;
  price: string;
  product_type: "photo" | "video" | "physical";
  starting_price?: string | number;
  file?: string;
  location?: string;
  photo_id?: number;
  material_display?: string; 
  size_display?: string;
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
  tags: string[]; 
  likes_count: number;
  has_liked?: boolean;
}

export interface LikeResponse {
    liked: boolean;
    likes_count: number;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  updated_at: string;
  has_liked: boolean;
  related_posts: RelatedPost[];
}

export interface RelatedPost {
  title: string;
  slug: string;
  featured_image: string | null;
  created_at: string;
}

export interface OrderHistoryItem {
  id: number;
  quantity: number;
  item_total: string;
  details: {
    material?: string;
    size?: string;
    variantId?: number;
    sourceProductId?: number;
  } | null;
  product: GalleryItem;
  download_url?: string | null;
  personal_terms_version?: string | null;
  personal_terms_url?: string | null;
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
  delivery_cost: string | number;
  shipping_method: string;
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
  product_type: "photo";
  description: string;
  collection: string;
  download_url?: string | null;
  tags: string | null;
  created_at: string;
  variants: ProductVariant[]; 
  related_products: GalleryItem[];
}

export interface VideoDetail extends GalleryItem {
  product_type: "video";
  description: string;
  collection: string;
  download_url?: string | null;
  tags: string | null;
  created_at: string;
  duration?: number;
  resolution?: string;
  frame_rate?: string;
  related_products: GalleryItem[];
}

export interface ProductDetail extends GalleryItem {
  product_type: "physical";
  photo: PhotoDetail; 
  material: string;
  size: string;
  sku: string | null;
  material_display?: string; 
  size_display?: string;
}

export interface PhysicalDetailFlat extends GalleryItem {
  product_type: "physical";
  description?: string;
  variants: ProductVariant[];
  related_products: GalleryItem[];
}

export type PhysicalDetail = ProductDetail | PhysicalDetailFlat;
export type ProductDetailItem = PhotoDetail | VideoDetail | PhysicalDetail;

export interface ReviewSubmitData {
  rating: number;
  comment?: string; // Optional as per requirement
}

export type ReviewProductType = "photo" | "video";
export type ReviewSubmissionResponse = ProductReview | { message: string };

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LicenseRequestPayload {
  asset_type: "photo" | "video";
  asset_id: number;
  client_name: string;
  company?: string;
  email: string;
  project_type:
    | "REAL_ESTATE"
    | "CORPORATE"
    | "EDITORIAL"
    | "COMMERCIAL"
    | "OTHER";
  duration:
    | "1_MONTH"
    | "3_MONTHS"
    | "6_MONTHS"
    | "1_YEAR"
    | "2_YEARS"
    | "5_YEARS"
    | "PERPETUAL"
    | "OTHER";
  territory:
    | "IRELAND"
    | "EU"
    | "US_NA"
    | "SOUTH_AMERICA"
    | "ASIA"
    | "AFRICA"
    | "OCEANIA"
    | "WORLDWIDE";
  permitted_media:
    | "WEB_SOCIAL"
    | "PAID_DIGITAL"
    | "PRINT_BROCHURE"
    | "BROADCAST"
    | "ALL_MEDIA";
  exclusivity: "NON_EXCLUSIVE" | "CATEGORY" | "FULL";
  reach_caps?: string;
  message?: string;
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

export const getBlogPosts = async (
  tag?: string
): Promise<PaginatedResponse<BlogPostListItem>> => {
  try {
    // If a tag is provided, append it to the URL query params
    const url = tag ? `blog/?tag=${tag}` : `blog/`;
    
    const response = await api.get<PaginatedResponse<BlogPostListItem>>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// 2. Fetch Single Blog Post
export const getBlogPostDetail = async (
  slug: string
): Promise<BlogPostDetail> => {
  try {
    // Updated path to match backend: /blog/<slug>/
    const response = await api.get<BlogPostDetail>(`blog/${slug}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const toggleBlogLike = async (slug: string): Promise<LikeResponse> => {
  try {
    const response = await api.post<LikeResponse>(`blog/${slug}/like/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// 4. Get Comments
export const getComments = async (postSlug: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(
      `blog/${postSlug}/comments/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// 5. Post Comment
export const postComment = async (
  postSlug: string,
  content: string
): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(
      `blog/${postSlug}/comments/`,
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
    // Preserve status/headers for access-gate handling on the product page.
    throw error;
  }
};

export const submitProductReview = async (
  productType: ReviewProductType,
  productId: string,
  reviewData: ReviewSubmitData,
): Promise<ReviewSubmissionResponse> => {
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
  productType: ReviewProductType,
  productId: string,
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
  const response = await api.get(normalizeApiPath("/products/recommendations/"));
  return response.data;
};

const extractFilenameFromDisposition = (disposition?: string): string | null => {
  if (!disposition) return null;

  const encodedMatch = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] ?? null;
};

const sanitizeDownloadFilename = (filename: string): string => {
  const sanitized = filename
    .replace(/[\\/]+/g, "_")
    .replace(/[\u0000-\u001f\u007f]+/g, "")
    .trim();
  return sanitized || "download";
};

export const downloadProduct = async (
  type: "photo" | "video",
  id: number,
  fallbackFilename: string,
) => {
  const response = await api.get(
    normalizeApiPath(`/products/download/${type}/${id}/`),
    {
      responseType: 'blob',
    },
  );

  const disposition = response.headers["content-disposition"] as string | undefined;
  const resolvedFilename = sanitizeDownloadFilename(
    extractFilenameFromDisposition(disposition) || fallbackFilename,
  );

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', resolvedFilename);
  document.body.appendChild(link);
  link.click();

  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
  return true;
};


// Get Liked Posts (Profile)
export const getLikedBlogPosts = async (): Promise<PaginatedResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedResponse<BlogPostListItem>>('blog/liked/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const submitLicenseRequest = async (payload: LicenseRequestPayload) => {
  try {
    // Adjust the URL path if your urls.py prefix is different (e.g., /api/products/license-requests/)
    const response = await api.post("license-requests/", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

