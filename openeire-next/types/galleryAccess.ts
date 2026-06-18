export interface GalleryAccessRequestPayload {
  email: string;
}

export interface GalleryAccessRequestResponse {
  message: string;
}

export interface GalleryAccessVerifyPayload {
  access_code: string;
}

export interface GalleryAccessVerifyResponse {
  message: string;
  expires_at?: string | null;
  valid?: boolean;
}
