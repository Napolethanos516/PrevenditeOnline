export type Poster = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  short_description: string;
  full_description: string;
  is_featured: boolean;
  sold_out: boolean;
  event_date: string | null;
  created_at: string;
  is_hidden: boolean;
  publish_at: string | null;
};

export type RequestType = "info" | "purchase";
export type ContactType = "phone" | "instagram";
export type RequestStatus = "pending" | "completed";
export type SaleStatus = "none" | "sold" | "not_sold";

export type CustomerRequest = {
  id: string;
  poster_id: string | null;
  poster_title: string;
  request_type: RequestType;
  contact_type: ContactType;
  contact_value: string;
  referrer: string | null;
  status: RequestStatus;
  sale_status: SaleStatus;
  created_at: string;
};

export type SiteContacts = {
  id: string;
  email: string;
  phone: string;
  instagram: string | null;
  updated_at: string;
};

export type PromoterStatus = "pending" | "reviewed" | "hired";

export type PromoterApplication = {
  id: string;
  first_name: string;
  last_name: string;
  has_experience: boolean;
  phone: string;
  instagram: string;
  status: PromoterStatus;
  created_at: string;
};
