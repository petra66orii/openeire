export type ReviewProductType = "photo" | "video" | "product";

export interface ProductReview {
  id: number | string;
  user: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  admin_reply?: string | null;
}

export interface ReviewSubmitData {
  rating: number;
  comment?: string;
}

export interface ReviewSubmissionMessage {
  message: string;
}

export type ReviewSubmissionResponse =
  | ProductReview
  | ReviewSubmissionMessage;

export interface DisplayReview extends ProductReview {
  isPending?: boolean;
}
