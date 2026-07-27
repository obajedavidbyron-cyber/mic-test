import express, { Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { User, MarketplaceListing } from "../src/types";
import { authenticateToken, requireRole, generateToken, AuthenticatedRequest } from "./auth";

const router = express.Router();

// Configure Multer for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(6).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const trimmedEmail = String(email).trim();

    if (role !== "tenant" && role !== "landlord") {
      res.status(400).json({ error: "Invalid role. Must be 'tenant' or 'landlord'" });
      return;
    }

    const existingUser = db.findUserByEmail(trimmedEmail);
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = db.createUser({
      name,
      email: trimmedEmail,
      passwordHash,
      phone,
      role
    });

    const token = generateToken(newUser);
    res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const trimmedEmail = String(email).trim();

    const user = db.findUserByEmail(trimmedEmail);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({
      user: sanitizeUser(user),
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ error: "Email and new password are required" });
      return;
    }

    const trimmedEmail = String(email).trim();
    const user = db.findUserByEmail(trimmedEmail);
    if (!user) {
      res.status(404).json({ error: "User not found with this email" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const success = db.resetPassword(user.id, passwordHash);

    if (success) {
      res.status(200).json({ message: "Password reset successfully" });
    } else {
      res.status(500).json({ error: "Failed to reset password" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Password reset failed" });
  }
});

// ==========================================
// USERS ENDPOINTS
// ==========================================

router.get("/users/profile", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.status(200).json(sanitizeUser(req.user));
});

router.put("/users/profile", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name, phone, role } = req.body;
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (role !== undefined) {
    if (role !== "tenant" && role !== "landlord") {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    updates.role = role;
  }

  const updated = db.updateUser(req.user.id, updates);
  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json(sanitizeUser(updated));
});

// ==========================================
// MULTI-CATEGORY LISTINGS ENDPOINTS
// ==========================================

// GET /api/listings (or backward compatible /api/properties)
const handleGetListings = (req: express.Request, res: express.Response) => {
  try {
    const listings = db.getListings();

    const {
      category,
      search,
      location,
      county,
      subCounty,
      priceMin,
      priceMax,
      propertyType,
      listingType,
      spaceType,
      itemType,
      serviceType,
      vendorId,
      landlordId, // backward-compat query param
      page = 1,
      limit = 100
    } = req.query;

    let filtered = [...listings];

    // Category filter
    if (category && category !== "all") {
      filtered = filtered.filter(l => l.category === category);
    }

    // Search term
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        l =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.county && l.county.toLowerCase().includes(q)) ||
          (l.neighborhood && l.neighborhood.toLowerCase().includes(q)) ||
          (l.landmark && l.landmark.toLowerCase().includes(q))
      );
    }

    // County / Location
    if (county && county !== "all") {
      const c = String(county).toLowerCase();
      filtered = filtered.filter(l => l.county && l.county.toLowerCase() === c);
    }

    if (location) {
      const loc = String(location).toLowerCase();
      filtered = filtered.filter(
        l =>
          l.location.toLowerCase().includes(loc) ||
          (l.county && l.county.toLowerCase().includes(loc)) ||
          (l.subCounty && l.subCounty.toLowerCase().includes(loc))
      );
    }

    // Price range
    if (priceMin) {
      const min = parseFloat(String(priceMin));
      if (!isNaN(min)) filtered = filtered.filter(l => l.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(String(priceMax));
      if (!isNaN(max)) filtered = filtered.filter(l => l.price <= max);
    }

    // Specific category filters
    if (propertyType && propertyType !== "all") {
      filtered = filtered.filter(l => l.propertyDetails?.propertyType === propertyType);
    }
    if (listingType && listingType !== "all") {
      filtered = filtered.filter(l => l.propertyDetails?.listingType === listingType);
    }
    if (spaceType && spaceType !== "all") {
      filtered = filtered.filter(l => l.eventSpaceDetails?.spaceType === spaceType);
    }
    if (itemType && itemType !== "all") {
      filtered = filtered.filter(l => l.goodsDetails?.itemType === itemType);
    }
    if (serviceType && serviceType !== "all") {
      filtered = filtered.filter(l => l.serviceDetails?.serviceType === serviceType);
    }

    // Vendor / Landlord ID filter
    const targetVendor = vendorId || landlordId;
    if (targetVendor) {
      filtered = filtered.filter(l => l.vendorId === targetVendor);
    }

    // Sort newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const total = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    // Return both 'listings' and 'properties' key for backward compatibility
    res.status(200).json({
      listings: paginated,
      properties: paginated,
      total,
      page: pageNum,
      limit: limitNum
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch listings" });
  }
};

router.get("/listings", handleGetListings);
router.get("/properties", handleGetListings);

// GET /api/listings/:id
const handleGetListingById = (req: express.Request, res: express.Response) => {
  const listing = db.findListingById(req.params.id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  // Increment view count
  listing.viewsCount = (listing.viewsCount || 0) + 1;
  res.status(200).json(listing);
};

router.get("/listings/:id", handleGetListingById);
router.get("/properties/:id", handleGetListingById);

// POST /api/listings (Create Listing across categories)
const handleCreateListing = (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      category = "properties",
      title,
      description,
      price,
      location,
      county,
      subCounty,
      neighborhood,
      landmark,
      images,
      videoUrl,
      mpesaPaymentInfo,
      propertyDetails,
      eventSpaceDetails,
      goodsDetails,
      serviceDetails
    } = req.body;

    if (!title || !description || !location || price === undefined) {
      res.status(400).json({ error: "Title, description, location, and price are required" });
      return;
    }

    const user = req.user!;
    const parsedPrice = parseFloat(price);

    const finalImages = images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"];

    const newListing = db.createListing({
      category,
      title,
      description,
      price: parsedPrice,
      location,
      county: county || "Nairobi",
      subCounty: subCounty || "",
      neighborhood: neighborhood || "",
      landmark: landmark || "",
      images: finalImages,
      videoUrl,
      vendorId: user.id,
      vendorName: user.name,
      vendorPhone: user.phone,
      vendorEmail: user.email,
      mpesaPaymentInfo,
      propertyDetails,
      eventSpaceDetails,
      goodsDetails,
      serviceDetails,
      featured: true
    });

    res.status(201).json(newListing);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create listing" });
  }
};

router.post("/listings", authenticateToken as any, requireRole("landlord") as any, handleCreateListing as any);
router.post("/properties", authenticateToken as any, requireRole("landlord") as any, handleCreateListing as any);

// PUT & DELETE Listings
router.put("/listings/:id", authenticateToken as any, requireRole("landlord") as any, (req: AuthenticatedRequest, res) => {
  const listing = db.findListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.vendorId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

  const updated = db.updateListing(req.params.id, req.body);
  res.status(200).json(updated);
});

router.put("/properties/:id", authenticateToken as any, requireRole("landlord") as any, (req: AuthenticatedRequest, res) => {
  const listing = db.findListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.vendorId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

  const updated = db.updateListing(req.params.id, req.body);
  res.status(200).json(updated);
});

router.delete("/listings/:id", authenticateToken as any, requireRole("landlord") as any, (req: AuthenticatedRequest, res) => {
  const listing = db.findListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.vendorId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

  db.deleteListing(req.params.id);
  res.status(200).json({ message: "Listing deleted successfully" });
});

router.delete("/properties/:id", authenticateToken as any, requireRole("landlord") as any, (req: AuthenticatedRequest, res) => {
  const listing = db.findListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.vendorId !== req.user!.id) return res.status(403).json({ error: "Forbidden" });

  db.deleteListing(req.params.id);
  res.status(200).json({ message: "Listing deleted successfully" });
});

// ==========================================
// VIRTUAL DISPLAY & REELS FEED ENDPOINTS
// ==========================================

router.get("/reels", (req, res) => {
  try {
    const { category } = req.query;
    const reels = db.getReels(category as any);
    res.status(200).json(reels);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch reels" });
  }
});

router.post("/reels/:id/like", (req, res) => {
  try {
    const reel = db.likeReel(req.params.id);
    if (!reel) return res.status(404).json({ error: "Reel not found" });
    res.status(200).json(reel);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to like reel" });
  }
});

// ==========================================
// BOOKINGS & QUOTES ENDPOINTS
// ==========================================

router.get("/bookings", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const bookings = user.role === "landlord"
      ? db.getBookings(undefined, user.id)
      : db.getBookings(user.id, undefined);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch bookings" });
  }
});

router.post("/bookings", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const { listingId, startDate, endDate, startTime, endTime, guestsCount, totalAmountKES, notes } = req.body;

    const listing = db.findListingById(listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const newBooking = db.createBooking({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      listingId: listing.id,
      listingTitle: listing.title,
      category: listing.category,
      startDate,
      endDate,
      startTime,
      endTime,
      guestsCount: guestsCount ? parseInt(guestsCount, 10) : undefined,
      totalAmountKES: parseFloat(totalAmountKES || listing.price),
      status: "confirmed",
      notes,
    });

    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create booking" });
  }
});

router.get("/quote-requests", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const quotes = user.role === "landlord"
      ? db.getQuoteRequests(undefined, user.id)
      : db.getQuoteRequests(user.id, undefined);
    res.status(200).json(quotes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch quote requests" });
  }
});

router.post("/quote-requests", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const { serviceId, details, fromAddress, toAddress, preferredDate } = req.body;

    const listing = db.findListingById(serviceId);
    if (!listing) return res.status(404).json({ error: "Service not found" });

    const newQuote = db.createQuoteRequest({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      serviceId: listing.id,
      serviceTitle: listing.title,
      details,
      fromAddress,
      toAddress,
      preferredDate,
      status: "pending"
    });

    res.status(201).json(newQuote);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to request quote" });
  }
});

// ==========================================
// WISHLIST / FAVORITES ENDPOINTS
// ==========================================

router.get("/favorites", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const favorites = db.getFavorites(req.user!.id);
    const listings = db.getListings();

    const favListings = favorites
      .map(f => listings.find(l => l.id === f.propertyId))
      .filter((l): l is MarketplaceListing => !!l);

    res.status(200).json(favListings);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to load favorites" });
  }
});

router.post("/properties/:id/favorite", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const result = db.toggleFavorite(req.user!.id, req.params.id);
    res.status(200).json({
      message: result.isFavorite ? "Added to wishlist" : "Removed from wishlist",
      isFavorite: result.isFavorite
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to toggle favorite" });
  }
});

// ==========================================
// MESSAGES & MEDIA UPLOAD
// ==========================================

router.post("/properties/:id/contact", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const listing = db.findListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message content is required" });

    const user = req.user!;
    const newMessage = db.createMessage({
      propertyId: listing.id,
      propertyTitle: listing.title,
      landlordId: listing.vendorId,
      tenantId: user.id,
      tenantName: user.name,
      tenantEmail: user.email,
      tenantPhone: user.phone,
      message
    });

    res.status(201).json({ message: "Message sent to vendor successfully", data: newMessage });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to send message" });
  }
});

router.get("/messages", authenticateToken as any, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const messages = user.role === "landlord"
      ? db.getMessagesForLandlord(user.id)
      : db.getMessagesForTenant(user.id);

    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve messages" });
  }
});

router.post("/upload", authenticateToken as any, upload.single("image"), (req: AuthenticatedRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "Please upload an image or video file" });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl: fileUrl, filename: req.file.filename });
});

export default router;
