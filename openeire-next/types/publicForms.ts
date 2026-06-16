export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type NewsletterSignupPayload = {
  email: string;
  first_name?: string;
  source?: string;
};

export type ClientType =
  | "estate_agent"
  | "developer"
  | "private_seller"
  | "landlord"
  | "other";

export type PackageType =
  | "essential"
  | "starter"
  | "pro"
  | "premium"
  | "custom"
  | "not_sure";

export type HowHeard =
  | "google"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "referral"
  | "estate_agent_colleague"
  | "openeire_website"
  | "other"
  | "not_sure";

export type AddOnKey =
  | "additional_stills"
  | "floor_plan"
  | "rush_delivery"
  | "extended_drone_video"
  | "additional_social_cuts"
  | "travel_supplement";

export interface RealEstateEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  client_type: ClientType;
  property_address: string;
  eircode?: string;
  county: string;
  property_type: string;
  preferred_package: PackageType;
  add_ons?: AddOnKey[];
  preferred_date?: string;
  how_heard?: HowHeard;
  message?: string;
  consent_to_contact: boolean;
}
