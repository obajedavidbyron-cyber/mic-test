# Rental Platform - Full-Stack Rental House Discovery Marketplace

A high-performance, responsive full-stack real-estate rental marketplace styled after premium platforms like Zillow and Airbnb.

## Features

- **Intuitive Discovery**: Filter rental listings in real-time by keyword search, location matching, bedroom counts, monthly budget ranges, and property types.
- **Dynamic Image Management**: Landlords can browse local files for direct multipart file upload via Multer OR paste high-quality Unsplash image URLs.
- **Direct Tenant-Landlord Messaging**: Verified tenants can send inquiry forms to landlords. Landlords can view received message logs, access tenant email/phone numbers, and coordinate walkthroughs.
- **Wishlist System**: Logged-in tenants can toggle property favorites to construct a tracking list.
- **Robust JWT Controls**: Full bcrypt password hashing, encrypted JWT session headers, and role-based Route protection guards.

---

## Folder Structure

```text
/
├── server.ts                  # Full-Stack Express Server (boots API + serves client Vite app)
├── db_rental_platform.json    # JSON Database File (Initialized with high-quality seed listings)
├── .env.example               # Environmental variable blueprints
├── package.json               # Main manifest with NPM scripts & unified dependency nodes
├── uploads/                   # Multipart uploaded image static destination folder
│
├── server/                    # Backend API codebase
│   ├── db.ts                  # Database persistence layer & Seed listings data models
│   ├── auth.ts                # JWT authentication middleware and utility functions
│   └── routes.ts              # REST API controllers & router mapping
│
└── src/                       # Frontend SPA codebase
    ├── main.tsx               # Client entry point
    ├── App.tsx                # Master state control and routing paths
    ├── index.css              # Font pairing and Tailwind styling entry
    ├── types.ts               # Shared TypeScript specifications
    ├── api.ts                 # Central Axios API endpoints helper
    │
    ├── components/            # Reusable UI Components
    │   ├── Navbar.tsx         # Responsive sticky header navigation
    │   ├── Footer.tsx         # Legal and info footer
    │   ├── Filters.tsx        # Filter form panel
    │   └── PropertyCard.tsx   # Individual listings card
    │
    └── pages/                 # Full Page Views
        ├── Home.tsx           # Quick search and featured categories page
        ├── SearchPage.tsx     # Discovery grid and filtering page
        ├── PropertyDetails.tsx# Gallery, details, and message card page
        ├── Login.tsx          # Login portal with seed test users listing
        ├── Register.tsx       # Secure user register portal
        ├── TenantDashboard.tsx# Tenant saved homes and message log tabs
        ├── LandlordDashboard.tsx# Landlord analytics, listing manager, and incoming inquiries tabs
        ├── AddProperty.tsx    # Property publishing portal
        └── MyListings.tsx     # Landlord listings manager list
```

---

## Technical Specifications

### Tech Stack
- **Frontend**: React.js with Vite, Tailwind CSS, Axios, Lucide Icons, React Router
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer file upload
- **Database**: Local JSON File State Engine (with in-memory fallback, robust read/write syncing, and rich seed data)

---

## REST API Documentation

### 1. Authentication
* **POST `/api/auth/register`**: Registers a new User.
  - *Payload*: `{ name, email, password, phone, role }` (where role is `"tenant"` or `"landlord"`)
  - *Response*: `{ user: { id, name, email, phone, role }, token: "JWT_TOKEN" }`
* **POST `/api/auth/login`**: Authenticates credentials.
  - *Payload*: `{ email, password }`
  - *Response*: `{ user: { id, name, email, phone, role }, token: "JWT_TOKEN" }`

### 2. Properties
* **GET `/api/properties`**: Retrieves filtered listings.
  - *Query Params*: `location`, `priceMin`, `priceMax`, `bedrooms`, `propertyType`, `search`, `page`, `limit`
  - *Response*: `{ properties: [...], total: 6, page: 1, limit: 100 }`
* **GET `/api/properties/:id`**: Single property detailed specs.
* **POST `/api/properties`** *(Protected: Landlord)*: Create a new listing.
  - *Payload*: `{ title, description, location, price, bedrooms, bathrooms, propertyType, images: [], amenities: [] }`
* **PUT `/api/properties/:id`** *(Protected: Landlord-Owner)*: Edit an owned listing.
* **DELETE `/api/properties/:id`** *(Protected: Landlord-Owner)*: Permanently purge listing.

### 3. Wishlists / Favorites
* **GET `/api/favorites`** *(Protected: Tenant)*: Retrieve active wishlist.
* **POST `/api/properties/:id/favorite`** *(Protected: Tenant)*: Toggles property favorite status.

### 4. Messaging
* **POST `/api/properties/:id/contact`** *(Protected: Tenant)*: Submit query about a home.
  - *Payload*: `{ message: "Hello! ..." }`
* **GET `/api/messages`** *(Protected)*: List inquiries.
  - *If Landlord*: Returns incoming logs for owned houses with Tenant contact fields.
  - *If Tenant*: Returns outgoing inquiry logs.

---

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Duplicate `.env.example` to `.env` and specify a secret:
   ```env
   JWT_SECRET="YOUR_SECRET_PHASE"
   ```

3. **Development Command**:
   Spins up full Express server mounting Vite middleware on port 3000:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   Compiles React SPA to `dist/` and bundles `server.ts` into a CommonJS server:
   ```bash
   npm run build
   npm run start
   ```
