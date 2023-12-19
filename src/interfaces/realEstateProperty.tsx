
export interface RealEstateProperty {
  id: number;
  address: string,
  price: string;
  currency: string;
  currencySymbol: string;
  propertyType: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  area: number;
  areaUnit: string;
  bedrooms: number;
  bathrooms: number;
  images?: string[];
  description?: string;
}

