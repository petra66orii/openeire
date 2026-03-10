export type ShippingDetails = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

export const EMPTY_SHIPPING_DETAILS: ShippingDetails = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
};
