export type LicenceAssetType = "photo" | "video";

export type LicenceProjectType =
  | "REAL_ESTATE"
  | "CORPORATE"
  | "EDITORIAL"
  | "COMMERCIAL"
  | "OTHER";

export type LicenceDuration =
  | "1_MONTH"
  | "3_MONTHS"
  | "6_MONTHS"
  | "1_YEAR"
  | "2_YEARS"
  | "5_YEARS"
  | "PERPETUAL"
  | "OTHER";

export type LicenceTerritory =
  | "IRELAND"
  | "EU"
  | "US_NA"
  | "SOUTH_AMERICA"
  | "ASIA"
  | "AFRICA"
  | "OCEANIA"
  | "WORLDWIDE";

export type LicencePermittedMedia =
  | "WEB_SOCIAL"
  | "PAID_DIGITAL"
  | "PRINT_BROCHURE"
  | "BROADCAST"
  | "ALL_MEDIA";

export type LicenceExclusivity = "NON_EXCLUSIVE" | "CATEGORY" | "FULL";

export interface LicenseRequestPayload {
  asset_type: LicenceAssetType;
  asset_id: number;
  client_name: string;
  company?: string;
  email: string;
  project_type: LicenceProjectType;
  duration: LicenceDuration;
  territory: LicenceTerritory;
  permitted_media: LicencePermittedMedia;
  exclusivity: LicenceExclusivity;
  reach_caps?: string;
  message?: string;
}

export interface LicenseRequestResponse {
  id?: number;
  message?: string;
}
