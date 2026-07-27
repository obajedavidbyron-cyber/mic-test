export type MarketplaceCategory = "properties" | "event_spaces" | "furniture_goods" | "services";

export type PropertyType = "land_plot" | "house" | "apartment" | "office" | "shop" | "warehouse";
export type TenureType = "Freehold" | "Leasehold";
export type ZoningType = "Residential" | "Commercial" | "Industrial" | "Agricultural" | "Mixed Use";

export interface PropertyDetails {
  listingType: "sale" | "rent";
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqFt?: number;
  sizeAcres?: number;
  tenure?: TenureType;
  zoningType?: ZoningType;
  utilities: string[]; // e.g. ["Water", "3-Phase Electricity", "Sewer", "Borehole"]
}

export type SpaceType = "hall" | "conference_room" | "grounds" | "bnb_apartment";
export type PricingUnit = "per_hour" | "per_day" | "per_night";

export interface EventSpaceDetails {
  spaceType: SpaceType;
  pricingUnit: PricingUnit;
  capacity: number; // Max guests
  checkInTime?: string;
  checkOutTime?: string;
  cateringAllowed: boolean;
  soundSystemAvailable?: boolean;
  projectorAvailable?: boolean;
  amenities: string[];
  rules: string[];
}

export type GoodsItemType = "furniture" | "hire_chairs_tables" | "decor" | "appliance" | "building_material";
export type GoodsTransactionType = "sale" | "daily_hire" | "both";
export type GoodsCondition = "New" | "Refurbished" | "Used";

export interface GoodsDetails {
  itemType: GoodsItemType;
  transactionType: GoodsTransactionType;
  condition: GoodsCondition;
  dimensions?: string;
  deliveryOptions: "Self Pickup" | "Vendor Delivery" | "Nationwide Shipping" | "All Options Available";
  dailyHireRateKES?: number;
  salePriceKES?: number;
  stockQuantity: number;
}

export type ServiceType = "house_movers" | "interior_designer" | "contractor" | "cleaning" | "land_surveyor" | "plumber_electrician";
export type RateModel = "hourly" | "flat" | "quote_based";

export interface ServiceCatalogItem {
  id: string;
  title: string;
  priceKES: number;
  description?: string;
}

export interface ServiceDetails {
  serviceType: ServiceType;
  rateModel: RateModel;
  baseRateKES?: number;
  countiesServed: string[];
  verifiedLicense: boolean;
  serviceCatalog: ServiceCatalogItem[];
  rating: number;
  reviewsCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone: string;
  role: "tenant" | "landlord"; // "tenant" acts as Buyer/Client, "landlord" acts as Seller/Vendor/Agent
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  category: MarketplaceCategory;
  title: string;
  description: string;
  price: number; // in KES
  location: string;
  county: string;
  subCounty?: string;
  neighborhood?: string;
  landmark?: string;
  images: string[];
  videoUrl?: string; // For virtual showroom / reels
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorEmail: string;
  mpesaPaymentInfo?: string;
  createdAt: string;
  featured?: boolean;
  viewsCount?: number;

  // Category-specific extension details
  propertyDetails?: PropertyDetails;
  eventSpaceDetails?: EventSpaceDetails;
  goodsDetails?: GoodsDetails;
  serviceDetails?: ServiceDetails;
}

// Deprecated backward-compatible Property type mapping to MarketplaceListing
export type Property = MarketplaceListing;

export interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  listingId: string;
  category: MarketplaceCategory;
  vendorName: string;
  vendorPhone: string;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  priceKES: number;
  location: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  listingId: string;
  listingTitle: string;
  category: MarketplaceCategory;
  startDate: string; // YYYY-MM-DD (EAT time)
  endDate?: string;
  startTime?: string;
  endTime?: string;
  guestsCount?: number;
  totalAmountKES: number;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceId: string;
  serviceTitle: string;
  details: string;
  fromAddress?: string;
  toAddress?: string;
  preferredDate?: string;
  status: "pending" | "quoted" | "completed";
  createdAt: string;
}

export type ServiceQuoteRequest = QuoteRequest;

export interface Message {
  id: string;
  propertyId: string;
  propertyTitle: string;
  landlordId: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  message: string;
  createdAt: string;
}
