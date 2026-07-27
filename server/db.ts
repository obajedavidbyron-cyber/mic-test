import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type {
  User,
  MarketplaceListing,
  Reel,
  Booking,
  QuoteRequest,
  Message,
  MarketplaceCategory
} from "../src/types";

export type { User };

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
}

interface DatabaseSchema {
  users: User[];
  listings: MarketplaceListing[];
  reels: Reel[];
  bookings: Booking[];
  quoteRequests: QuoteRequest[];
  favorites: Favorite[];
  messages: Message[];
}

const DB_FILE = path.join(process.cwd(), "db_rental_platform.json");

const hashPasswordSync = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

const DEFAULT_LANDLORD_ID = "landlord_default_id";
const DEFAULT_LANDLORD_2_ID = "landlord_default_2_id";

// Comprehensive multi-category seed dataset
const SEED_LISTINGS: MarketplaceListing[] = [
  // --- CATEGORY A: PROPERTIES (Sale & Long-Term Rent) ---
  {
    id: "prop_1",
    category: "properties",
    title: "Luxury 4-Bedroom Villa with Private Pool",
    description: "Experience coastal luxury living in this architectural masterwork on Nyali Beach Road. Features sweeping ocean breezes, private swimming pool, manicured tropical gardens, and solar back-up power. Comes with high-speed fiber internet, 24/7 guarded security, DSQ, and custom mahogany wood fittings.",
    price: 180000, // KES / Month
    location: "Beach Road, Nyali, Mombasa County",
    county: "Mombasa",
    subCounty: "Nyali",
    neighborhood: "Beach Road",
    landmark: "Near City Mall Nyali",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-with-a-swimming-pool-41584-large.mp4",
    vendorId: DEFAULT_LANDLORD_ID,
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    vendorEmail: "sarah@rentalplatform.co.ke",
    mpesaPaymentInfo: "Paybill: 714777 | Acc: NYALI-VILLA-1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 342,
    propertyDetails: {
      listingType: "rent",
      propertyType: "house",
      bedrooms: 4,
      bathrooms: 4.5,
      sizeSqFt: 4200,
      tenure: "Freehold",
      zoningType: "Residential",
      utilities: ["Borehole Water", "Solar Power System", "3-Phase Electricity", "Fiber Internet Ready"]
    }
  },
  {
    id: "prop_2",
    category: "properties",
    title: "Prime 0.5-Acre Commercial Plot for Sale",
    description: "Prime corner plot strategically situated along Malindi Highway in Kilifi. Ideal for commercial plaza, resort development, or petrol station. Clear title deed available for immediate transfer, perimeter fenced with piped water connection on site.",
    price: 12500000, // KES Sale
    location: "Malindi Highway, Kilifi County",
    county: "Kilifi",
    subCounty: "Malindi",
    neighborhood: "Sabaki Bridge",
    landmark: "1 km from Sabaki Bridge",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
    ],
    vendorId: DEFAULT_LANDLORD_ID,
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    vendorEmail: "sarah@rentalplatform.co.ke",
    mpesaPaymentInfo: "Paybill: 714777 | Acc: LAND-05A",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 520,
    propertyDetails: {
      listingType: "sale",
      propertyType: "land_plot",
      sizeAcres: 0.5,
      tenure: "Freehold",
      zoningType: "Commercial",
      utilities: ["County Piped Water", "Mains Electricity", "Paved Access Road"]
    }
  },
  {
    id: "prop_3",
    category: "properties",
    title: "Executive 3-Bedroom Apartment in Kilimani",
    description: "Located along Rose Avenue in Kilimani, this high-end apartment features spacious open-plan living, full glass balconies, master en-suite bedrooms, and fitted European kitchen appliances. Heated swimming pool, fully equipped gym, backup generator.",
    price: 85000, // KES / Month
    location: "Kilimani, Westlands, Nairobi County",
    county: "Nairobi",
    subCounty: "Westlands",
    neighborhood: "Kilimani",
    landmark: "Near Yaya Centre",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-41585-large.mp4",
    vendorId: DEFAULT_LANDLORD_ID,
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    vendorEmail: "sarah@rentalplatform.co.ke",
    mpesaPaymentInfo: "Till Number: 542109 (Wanjiku Rentals)",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
    viewsCount: 280,
    propertyDetails: {
      listingType: "rent",
      propertyType: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      sizeSqFt: 1850,
      tenure: "Leasehold",
      zoningType: "Residential",
      utilities: ["Borehole Water", "Backup Generator", "High-Speed Lifts", "Intercom System"]
    }
  },

  // --- CATEGORY B: EVENT SPACES & SHORT-STAYS ---
  {
    id: "space_1",
    category: "event_spaces",
    title: "Grand Ballroom & Conference Center Westlands",
    description: "Premier multi-purpose event hall suitable for corporate AGMs, weddings, product launches, and banquets. Features acoustic wall paneling, state-of-the-art 4K projectors, professional PA audio system, VIP holding suite, and basement parking for up to 150 vehicles.",
    price: 45000, // KES / Day
    location: "Parklands Road, Westlands, Nairobi County",
    county: "Nairobi",
    subCounty: "Westlands",
    neighborhood: "Parklands",
    landmark: "Opposite MP Shah Hospital",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-decorating-a-hall-for-a-wedding-party-42211-large.mp4",
    vendorId: DEFAULT_LANDLORD_2_ID,
    vendorName: "Alex Ochieng",
    vendorPhone: "+254 733 876 543",
    vendorEmail: "alex@rentalplatform.co.ke",
    mpesaPaymentInfo: "Paybill: 400200 | Acc: BALLROOM-W",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 610,
    eventSpaceDetails: {
      spaceType: "hall",
      pricingUnit: "per_day",
      capacity: 400,
      checkInTime: "07:00 AM",
      checkOutTime: "11:00 PM",
      cateringAllowed: true,
      soundSystemAvailable: true,
      projectorAvailable: true,
      amenities: ["AC", "High-speed Wi-Fi", "4K Projectors", "Acoustic Stage", "VIP Holding Room", "Catering Kitchen"],
      rules: ["No pyrotechnics inside", "Music curfew strictly 11:00 PM EAT", "Clean setup protocol"]
    }
  },
  {
    id: "space_2",
    category: "event_spaces",
    title: "Luxury Beachfront Serviced BnB Villa in Diani",
    description: "Exquisite 3-bedroom oceanview serviced BnB apartment in Diani Beach. Private plunge pool, chef-on-demand service, direct access to white sand beach, air-conditioned bedrooms, and sunset terrace. Perfect for family holiday gateways or remote executive retreats.",
    price: 18000, // KES / Night
    location: "Diani Beach Road, Kwale County",
    county: "Kwale",
    subCounty: "Msambweni",
    neighborhood: "Diani Beach",
    landmark: "2 min from Ukunda Airstrip",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-a-beach-at-sunset-4152-large.mp4",
    vendorId: DEFAULT_LANDLORD_ID,
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    vendorEmail: "sarah@rentalplatform.co.ke",
    mpesaPaymentInfo: "Till Number: 881204 (Diani Stays)",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 890,
    eventSpaceDetails: {
      spaceType: "bnb_apartment",
      pricingUnit: "per_night",
      capacity: 6,
      checkInTime: "02:00 PM",
      checkOutTime: "11:00 AM",
      cateringAllowed: true,
      amenities: ["Plunge Pool", "Air Conditioning", "Private Beach Access", "High-speed Fiber Wi-Fi", "Daily Housekeeping", "Private Chef"],
      rules: ["No loud parties past midnight", "Pets allowed with notice", "Valid ID required at check-in"]
    }
  },

  // --- CATEGORY C: FURNITURE & LIVING GOODS ---
  {
    id: "good_1",
    category: "furniture_goods",
    title: "Handcrafted Mahogany Executive Office Desk & Leather Chair",
    description: "Solid Kenyan mahogany wood executive office desk with dual cable management ports, locking drawers, and matching ergonomic genuine leather swivel chair. Suitable for home offices or corporate suites.",
    price: 48000, // KES Sale
    location: "Industrial Area, Nairobi County",
    county: "Nairobi",
    subCounty: "Makadara",
    neighborhood: "Industrial Area",
    landmark: "Near Likoni Road Junction",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-office-room-in-a-building-41586-large.mp4",
    vendorId: DEFAULT_LANDLORD_2_ID,
    vendorName: "Alex Ochieng",
    vendorPhone: "+254 733 876 543",
    vendorEmail: "alex@rentalplatform.co.ke",
    mpesaPaymentInfo: "Paybill: 882910 | Acc: DESK-01",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
    viewsCount: 190,
    goodsDetails: {
      itemType: "furniture",
      transactionType: "sale",
      condition: "New",
      dimensions: "180cm x 90cm x 75cm",
      deliveryOptions: "Vendor Delivery",
      salePriceKES: 48000,
      stockQuantity: 8
    }
  },
  {
    id: "good_2",
    category: "furniture_goods",
    title: "Event Banquet Chairs & Marquee Tents for Hire",
    description: "Heavy-duty padded banquet chairs and weatherproof aluminum frame marquee tents available for daily hire across Nairobi and Kiambu. Includes delivery, professional setup, and teardown service.",
    price: 150, // KES / Chair / Day
    location: "Ruiru, Kiambu County",
    county: "Kiambu",
    subCounty: "Ruiru",
    neighborhood: "Ruiru Town",
    landmark: "Behind Ruiru Sports Club",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80"
    ],
    vendorId: DEFAULT_LANDLORD_2_ID,
    vendorName: "Alex Ochieng",
    vendorPhone: "+254 733 876 543",
    vendorEmail: "alex@rentalplatform.co.ke",
    mpesaPaymentInfo: "Till Number: 312099 (Alex Hire Services)",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 430,
    goodsDetails: {
      itemType: "hire_chairs_tables",
      transactionType: "daily_hire",
      condition: "Refurbished",
      deliveryOptions: "All Options Available",
      dailyHireRateKES: 150,
      stockQuantity: 1500
    }
  },

  // --- CATEGORY D: HOME & PROPERTY SERVICES ---
  {
    id: "serv_1",
    category: "services",
    title: "Express House Movers Kenya - Reliable Relocation",
    description: "Kenya's leading professional residential & office moving company. We handle full packing with bubble wrap, furniture dismantling & reassembly, covered clean truck transit, and wall mounting. Serving Nairobi, Kiambu, Machakos, Nakuru, and Mombasa.",
    price: 15000, // Base Quote Rate KES
    location: "Westlands & All Nairobi Metro, Nairobi County",
    county: "Nairobi",
    subCounty: "Westlands",
    neighborhood: "Lavington Office",
    landmark: "Lavington Green Shopping Center",
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-moving-boxes-into-a-new-home-42838-large.mp4",
    vendorId: DEFAULT_LANDLORD_ID,
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    vendorEmail: "sarah@rentalplatform.co.ke",
    mpesaPaymentInfo: "Paybill: 714777 | Acc: MOVERS-EXPRESS",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 720,
    serviceDetails: {
      serviceType: "house_movers",
      rateModel: "quote_based",
      baseRateKES: 15000,
      countiesServed: ["Nairobi", "Kiambu", "Machakos", "Nakuru", "Mombasa", "Kajiado"],
      verifiedLicense: true,
      serviceCatalog: [
        { id: "c1", title: "1-Bedroom / Studio Move", priceKES: 12000, description: "Includes packing, transit, and unpacking" },
        { id: "c2", title: "2-3 Bedroom Apartment Move", priceKES: 22000, description: "Includes 24ft enclosed truck + 4 movers" },
        { id: "c3", title: "4-Bedroom Villa / House Move", priceKES: 38000, description: "Full white-glove packing, transit, re-assembly" }
      ],
      rating: 4.9,
      reviewsCount: 128
    }
  },
  {
    id: "serv_2",
    category: "services",
    title: "Pinnacle Certified Land Surveyors & Boundary Verification",
    description: "Registered & licensed Kenyan land surveyors offering beacon re-establishment, topographical survey mapping, land title subdivision, deed plan generation, and GIS mapping. Certified by the Institution of Surveyors of Kenya (ISK).",
    price: 35000, // KES Flat rate per plot
    location: "Upper Hill & Countrywide, Nairobi County",
    county: "Nairobi",
    subCounty: "Dagoretti North",
    neighborhood: "Upper Hill",
    landmark: "Near Survey of Kenya Office",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
    ],
    vendorId: DEFAULT_LANDLORD_2_ID,
    vendorName: "Alex Ochieng",
    vendorPhone: "+254 733 876 543",
    vendorEmail: "alex@rentalplatform.co.ke",
    mpesaPaymentInfo: "Till Number: 991200 (Pinnacle Surveyors)",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    viewsCount: 310,
    serviceDetails: {
      serviceType: "land_surveyor",
      rateModel: "flat",
      baseRateKES: 35000,
      countiesServed: ["All 47 Counties in Kenya"],
      verifiedLicense: true,
      serviceCatalog: [
        { id: "s1", title: "Beacon Re-establishment (0.5 Acre)", priceKES: 25000, description: "Physical boundary verification & beacon placement" },
        { id: "s2", title: "Topographical Map Surveying", priceKES: 45000, description: "Elevation contour map & architectural site plan" },
        { id: "s3", title: "Title Subdivision & Deed Plan", priceKES: 75000, description: "Full statutory Ministry of Lands documentation" }
      ],
      rating: 5.0,
      reviewsCount: 42
    }
  }
];

// Seed Video Reels
const SEED_REELS: Reel[] = [
  {
    id: "reel_1",
    title: "360° Walkthrough: Nyali Beachfront Villa",
    description: "Step inside this majestic 4-bed villa with private pool and ocean view on Nyali Beach Road. Tap below to book a private tour!",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-with-a-swimming-pool-41584-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    listingId: "prop_1",
    category: "properties",
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    likesCount: 245,
    viewsCount: 1840,
    createdAt: new Date().toISOString(),
    priceKES: 180000,
    location: "Nyali, Mombasa"
  },
  {
    id: "reel_2",
    title: "Grand Westlands Ballroom Tour",
    description: "Watch our acoustic lighting transformation for corporate AGMs and wedding galas. Capacity up to 400 guests!",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-decorating-a-hall-for-a-wedding-party-42211-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    listingId: "space_1",
    category: "event_spaces",
    vendorName: "Alex Ochieng",
    vendorPhone: "+254 733 876 543",
    likesCount: 389,
    viewsCount: 3120,
    createdAt: new Date().toISOString(),
    priceKES: 45000,
    location: "Westlands, Nairobi"
  },
  {
    id: "reel_3",
    title: "Kilimani 3-Bed Executive Living Room & View",
    description: "Full glass balcony views in Rose Avenue Kilimani. Heated pool, gym, generator. Tap Buy/Rent to enquire instantly!",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-41585-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    listingId: "prop_3",
    category: "properties",
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    likesCount: 178,
    viewsCount: 1420,
    createdAt: new Date().toISOString(),
    priceKES: 85000,
    location: "Kilimani, Nairobi"
  },
  {
    id: "reel_4",
    title: "Express House Movers in Action!",
    description: "White-glove packing with high-density bubble wrap and covered trucks. Get a free quote in 60 seconds!",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-moving-boxes-into-a-new-home-42838-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
    listingId: "serv_1",
    category: "services",
    vendorName: "Sarah Wanjiku",
    vendorPhone: "+254 722 234 567",
    likesCount: 512,
    viewsCount: 4200,
    createdAt: new Date().toISOString(),
    priceKES: 15000,
    location: "Nairobi Metro"
  }
];

class RentalDatabase {
  private data: DatabaseSchema = {
    users: [],
    listings: [],
    reels: [],
    bookings: [],
    quoteRequests: [],
    favorites: [],
    messages: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        this.data = parsed;

        // Ensure new schema collections exist
        if (!this.data.listings || this.data.listings.length === 0 || !this.data.reels) {
          console.log("Upgrading database to Multi-Category Marketplace Architecture...");
          this.seed();
        }
      } else {
        this.seed();
      }
    } catch (error) {
      console.error("Error loading database, re-seeding fresh database:", error);
      this.seed();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving database:", error);
    }
  }

  private seed() {
    console.log("Seeding fresh Multi-Category Marketplace Database...");

    const landlord1: User = {
      id: DEFAULT_LANDLORD_ID,
      name: "Sarah Wanjiku",
      email: "sarah@rentalplatform.co.ke",
      passwordHash: hashPasswordSync("password123"),
      phone: "+254 722 234 567",
      role: "landlord",
      createdAt: new Date().toISOString()
    };

    const landlord2: User = {
      id: DEFAULT_LANDLORD_2_ID,
      name: "Alex Ochieng",
      email: "alex@rentalplatform.co.ke",
      passwordHash: hashPasswordSync("password123"),
      phone: "+254 733 876 543",
      role: "landlord",
      createdAt: new Date().toISOString()
    };

    const tenant: User = {
      id: "tenant_default_id",
      name: "David Otieno",
      email: "david@rentalplatform.co.ke",
      passwordHash: hashPasswordSync("password123"),
      phone: "+254 711 999 888",
      role: "tenant",
      createdAt: new Date().toISOString()
    };

    this.data.users = [landlord1, landlord2, tenant];
    this.data.listings = SEED_LISTINGS;
    this.data.reels = SEED_REELS;
    this.data.bookings = [
      {
        id: "b_seed_1",
        userId: "tenant_default_id",
        userName: "David Otieno",
        userEmail: "david@rentalplatform.co.ke",
        userPhone: "+254 711 999 888",
        listingId: "space_2",
        listingTitle: "Luxury Beachfront Serviced BnB Villa in Diani",
        category: "event_spaces",
        startDate: "2026-08-10",
        endDate: "2026-08-14",
        guestsCount: 4,
        totalAmountKES: 72000,
        status: "confirmed",
        notes: "M-Pesa deposit received via Till 881204",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    this.data.quoteRequests = [
      {
        id: "q_seed_1",
        userId: "tenant_default_id",
        userName: "David Otieno",
        userEmail: "david@rentalplatform.co.ke",
        userPhone: "+254 711 999 888",
        serviceId: "serv_1",
        serviceTitle: "Express House Movers Kenya",
        details: "Moving a 2-bedroom apartment from Kilimani Rose Ave to Westlands Parklands.",
        fromAddress: "Kilimani, Rose Avenue",
        toAddress: "Westlands, Parklands Road",
        preferredDate: "2026-08-01",
        status: "quoted",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    this.data.favorites = [];
    this.data.messages = [
      {
        id: "msg_seed_1",
        propertyId: "prop_3",
        propertyTitle: "Executive 3-Bedroom Apartment in Kilimani",
        landlordId: DEFAULT_LANDLORD_ID,
        tenantId: "tenant_default_id",
        tenantName: "David Otieno",
        tenantEmail: "david@rentalplatform.co.ke",
        tenantPhone: "+254 711 999 888",
        message: "Habari Sarah! I am interested in viewing this 3-bedroom apartment. Can we schedule a visit this Friday?",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    this.save();
  }

  // --- Users API ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: "user_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public resetPassword(id: string, passwordHash: string): boolean {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.data.users[idx].passwordHash = passwordHash;
    this.save();
    return true;
  }

  // --- Multi-Category Listings API ---
  public getListings(): MarketplaceListing[] {
    return this.data.listings || [];
  }

  public findListingById(id: string): MarketplaceListing | undefined {
    return (this.data.listings || []).find(l => l.id === id);
  }

  public createListing(listing: Omit<MarketplaceListing, "id" | "createdAt">): MarketplaceListing {
    const newListing: MarketplaceListing = {
      ...listing,
      id: "list_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      viewsCount: 1
    };
    this.data.listings.push(newListing);

    // If new listing has a video URL, automatically register a Reel for Virtual Displays!
    if (newListing.videoUrl) {
      this.data.reels.unshift({
        id: "reel_" + Math.random().toString(36).substr(2, 9),
        title: newListing.title,
        description: newListing.description.substring(0, 120) + "...",
        videoUrl: newListing.videoUrl,
        thumbnailUrl: newListing.images[0] || "",
        listingId: newListing.id,
        category: newListing.category,
        vendorName: newListing.vendorName,
        vendorPhone: newListing.vendorPhone,
        likesCount: 1,
        viewsCount: 1,
        createdAt: new Date().toISOString(),
        priceKES: newListing.price,
        location: newListing.location
      });
    }

    this.save();
    return newListing;
  }

  public updateListing(id: string, updates: Partial<MarketplaceListing>): MarketplaceListing | undefined {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx === -1) return undefined;

    this.data.listings[idx] = {
      ...this.data.listings[idx],
      ...updates
    };
    this.save();
    return this.data.listings[idx];
  }

  public deleteListing(id: string): boolean {
    const initialLen = this.data.listings.length;
    this.data.listings = this.data.listings.filter(l => l.id !== id);
    this.data.favorites = this.data.favorites.filter(f => f.propertyId !== id);
    this.data.messages = this.data.messages.filter(m => m.propertyId !== id);
    this.data.reels = this.data.reels.filter(r => r.listingId !== id);
    this.save();
    return this.data.listings.length < initialLen;
  }

  // --- Virtual Display Reels API ---
  public getReels(category?: MarketplaceCategory): Reel[] {
    let reels = this.data.reels || [];
    if (category && category !== ("all" as any)) {
      reels = reels.filter(r => r.category === category);
    }
    return reels;
  }

  public likeReel(id: string): Reel | undefined {
    const reel = (this.data.reels || []).find(r => r.id === id);
    if (reel) {
      reel.likesCount += 1;
      this.save();
    }
    return reel;
  }

  // --- Bookings API ---
  public getBookings(userId?: string, vendorId?: string): Booking[] {
    let bookings = this.data.bookings || [];
    if (userId) {
      bookings = bookings.filter(b => b.userId === userId);
    }
    if (vendorId) {
      const vendorListingIds = this.data.listings
        .filter(l => l.vendorId === vendorId)
        .map(l => l.id);
      bookings = bookings.filter(b => vendorListingIds.includes(b.listingId));
    }
    return bookings;
  }

  public createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const newBooking: Booking = {
      ...booking,
      id: "book_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.bookings.push(newBooking);
    this.save();
    return newBooking;
  }

  // --- Quote Requests API ---
  public getQuoteRequests(userId?: string, vendorId?: string): QuoteRequest[] {
    let quotes = this.data.quoteRequests || [];
    if (userId) {
      quotes = quotes.filter(q => q.userId === userId);
    }
    if (vendorId) {
      const vendorServiceIds = this.data.listings
        .filter(l => l.vendorId === vendorId)
        .map(l => l.id);
      quotes = quotes.filter(q => vendorServiceIds.includes(q.serviceId));
    }
    return quotes;
  }

  public createQuoteRequest(quote: Omit<QuoteRequest, "id" | "createdAt">): QuoteRequest {
    const newQuote: QuoteRequest = {
      ...quote,
      id: "quote_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.quoteRequests.push(newQuote);
    this.save();
    return newQuote;
  }

  // --- Favorites / Wishlist ---
  public getFavorites(userId: string): Favorite[] {
    return this.data.favorites.filter(f => f.userId === userId);
  }

  public toggleFavorite(userId: string, propertyId: string): { isFavorite: boolean } {
    const idx = this.data.favorites.findIndex(f => f.userId === userId && f.propertyId === propertyId);
    if (idx !== -1) {
      this.data.favorites.splice(idx, 1);
      this.save();
      return { isFavorite: false };
    } else {
      const newFav: Favorite = {
        id: "fav_" + Math.random().toString(36).substr(2, 9),
        userId,
        propertyId
      };
      this.data.favorites.push(newFav);
      this.save();
      return { isFavorite: true };
    }
  }

  // --- Messages ---
  public getMessagesForLandlord(landlordId: string): Message[] {
    return this.data.messages.filter(m => m.landlordId === landlordId);
  }

  public getMessagesForTenant(tenantId: string): Message[] {
    return this.data.messages.filter(m => m.tenantId === tenantId);
  }

  public createMessage(msg: Omit<Message, "id" | "createdAt">): Message {
    const newMessage: Message = {
      ...msg,
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.data.messages.push(newMessage);
    this.save();
    return newMessage;
  }
}

export const db = new RentalDatabase();
