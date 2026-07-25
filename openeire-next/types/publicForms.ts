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
  | "virtual_tour_3d"
  | "rush_delivery"
  | "extended_drone_video"
  | "additional_social_cuts"
  | "travel_supplement";

export type PropertyCategory =
  | "house"
  | "apartment"
  | "new_build"
  | "site_land"
  | "commercial"
  | "agricultural"
  | "other";

export type YesNoNotSure = "yes" | "no" | "not_sure";

export interface RealEstateEnquiryPayload {
  form_schema_version: 2;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  client_type: ClientType;
  property_address: string;
  eircode?: string;
  no_eircode: boolean;
  location_details?: string;
  county: string;
  property_type: PropertyCategory;
  property_type_details?: string;
  bedroom_count:
    | "studio"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6_plus"
    | "not_applicable";
  floor_count: "1" | "2" | "3" | "4_plus" | "not_applicable";
  secondary_accommodation: YesNoNotSure;
  secondary_accommodation_details?: string;
  outbuildings: YesNoNotSure;
  outbuildings_details?: string;
  grounds_size:
    | "no_grounds"
    | "normal_garden"
    | "large_garden"
    | "under_1_acre"
    | "1_to_5_acres"
    | "over_5_acres"
    | "not_sure"
    | "not_applicable";
  internal_floor_area?: number;
  internal_floor_area_unit?: "sqm" | "sqft";
  property_features?: string;
  occupancy_status:
    | "vacant"
    | "owner_occupied"
    | "tenant_occupied"
    | "new_build_site"
    | "other";
  access_provider:
    | "enquirer"
    | "owner"
    | "tenant"
    | "agent_colleague"
    | "other";
  access_contact_name?: string;
  access_contact_phone?: string;
  access_notes?: string;
  readiness_acknowledged: boolean;
  preferred_package: PackageType;
  add_ons?: AddOnKey[];
  additional_stills_quantity?: number;
  scheduling_preference: "request_date" | "flexible";
  preferred_date?: string;
  alternative_date?: string;
  preferred_time_window: "morning" | "afternoon" | "flexible";
  on_camera: YesNoNotSure;
  on_camera_people?: string;
  audio_requirements?: string;
  how_heard?: HowHeard;
  message?: string;
  consent_to_contact: boolean;
}
