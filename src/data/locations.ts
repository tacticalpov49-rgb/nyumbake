export interface LocationOption {
  label: string;
  country: string;
  type: "city" | "state" | "county";
}

export const LOCATIONS: LocationOption[] = [
  // Kenya - Counties
  { label: "Nairobi", country: "Kenya", type: "county" },
  { label: "Mombasa", country: "Kenya", type: "county" },
  { label: "Kiambu", country: "Kenya", type: "county" },
  { label: "Nakuru", country: "Kenya", type: "county" },
  { label: "Uasin Gishu", country: "Kenya", type: "county" },
  { label: "Kisumu", country: "Kenya", type: "county" },
  { label: "Machakos", country: "Kenya", type: "county" },
  { label: "Kajiado", country: "Kenya", type: "county" },
  { label: "Kilifi", country: "Kenya", type: "county" },
  { label: "Nyeri", country: "Kenya", type: "county" },
  { label: "Murang'a", country: "Kenya", type: "county" },
  { label: "Nyandarua", country: "Kenya", type: "county" },
  // Nigeria - States
  { label: "Lagos", country: "Nigeria", type: "state" },
  { label: "Abuja (FCT)", country: "Nigeria", type: "state" },
  { label: "Rivers", country: "Nigeria", type: "state" },
  { label: "Ogun", country: "Nigeria", type: "state" },
  { label: "Kano", country: "Nigeria", type: "state" },
  // South Africa - Cities
  { label: "Johannesburg", country: "South Africa", type: "city" },
  { label: "Cape Town", country: "South Africa", type: "city" },
  { label: "Durban", country: "South Africa", type: "city" },
  { label: "Pretoria", country: "South Africa", type: "city" },
  // Tanzania - Regions
  { label: "Dar es Salaam", country: "Tanzania", type: "city" },
  { label: "Arusha", country: "Tanzania", type: "city" },
  { label: "Dodoma", country: "Tanzania", type: "city" },
  // Ghana - Regions
  { label: "Accra", country: "Ghana", type: "city" },
  { label: "Kumasi", country: "Ghana", type: "city" },
  // USA - States/Cities
  { label: "New York, NY", country: "USA", type: "city" },
  { label: "Los Angeles, CA", country: "USA", type: "city" },
  { label: "Houston, TX", country: "USA", type: "city" },
  { label: "Chicago, IL", country: "USA", type: "city" },
  { label: "Miami, FL", country: "USA", type: "city" },
  { label: "Atlanta, GA", country: "USA", type: "city" },
  { label: "California", country: "USA", type: "state" },
  { label: "Texas", country: "USA", type: "state" },
  { label: "Florida", country: "USA", type: "state" },
  { label: "New York", country: "USA", type: "state" },
  { label: "Georgia", country: "USA", type: "state" },
  // UK - Cities
  { label: "London", country: "UK", type: "city" },
  { label: "Manchester", country: "UK", type: "city" },
  { label: "Birmingham", country: "UK", type: "city" },
];
