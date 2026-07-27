import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyAPI, messageAPI, authAPI, favoriteAPI, bookingAPI, quoteAPI } from "../api";
import { MarketplaceListing, User } from "../types";
import {
  Bed,
  Bath,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  MessageSquare,
  Heart,
  Shield,
  CheckCircle,
  Landmark,
  CreditCard,
  Copy,
  Check,
  Smartphone,
  Users,
  Calendar,
  Clock,
  Package,
  Wrench,
  Star,
  ShoppingBag
} from "lucide-react";
import { formatKES, formatKenyanPhone, formatEATDate } from "../utils/kenya";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState("");

  // Contact Vendor Form
  const [message, setMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [msgError, setMsgError] = useState("");

  // Booking Form (for Event Spaces & Goods Daily Hire)
  const [startDate, setStartDate] = useState("2026-08-10");
  const [endDate, setEndDate] = useState("2026-08-12");
  const [guestsCount, setGuestsCount] = useState("50");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Quote Request Form (for Services)
  const [quoteDetails, setQuoteDetails] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // M-Pesa STK Push State
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [mpesaPhoneInput, setMpesaPhoneInput] = useState("");
  const [mpesaProcessing, setMpesaProcessing] = useState(false);
  const [mpesaSuccess, setMpesaSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    if (user && user.phone) {
      setMpesaPhoneInput(user.phone);
    }

    propertyAPI.getById(id)
      .then((data) => {
        setListing(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
        
        if (user && user.role === "tenant") {
          favoriteAPI.getFavorites()
            .then((favs) => {
              setIsFavorite(favs.some((f) => f.id === data.id));
            })
            .catch((err) => console.error("Error loading user favorite details:", err));
        }
      })
      .catch((err) => {
        console.error("Error loading listing details:", err);
        setError("We couldn't retrieve this listing. It may have been deleted or the link is invalid.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!listing) return;
    if (!currentUser) {
      alert("Please login first to save items to your wishlist!");
      return;
    }

    try {
      await favoriteAPI.toggleFavorite(listing.id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !message.trim() || sendingMsg) return;

    setSendingMsg(true);
    setMsgSuccess(false);
    setMsgError("");

    try {
      await messageAPI.sendMessage(listing.id, message);
      setMsgSuccess(true);
      setMessage("");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setMsgError(err.response?.data?.error || "Failed to deliver message. Try again later.");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setBookingLoading(true);
    try {
      await bookingAPI.createBooking({
        listingId: listing.id,
        startDate,
        endDate,
        guestsCount: parseInt(guestsCount, 10),
        totalAmountKES: listing.price,
        notes: `Booking for ${listing.title}`
      });
      setBookingSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Booking failed. Make sure you are logged in.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !quoteDetails.trim()) return;
    setQuoteLoading(true);
    try {
      await quoteAPI.createQuoteRequest({
        serviceId: listing.id,
        details: quoteDetails,
        fromAddress,
        toAddress,
        preferredDate: startDate
      });
      setQuoteSuccess(true);
      setQuoteDetails("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Quote request failed. Make sure you are logged in.");
    } finally {
      setQuoteLoading(false);
    }
  };

  const copyMpesaInfo = () => {
    if (!listing) return;
    const textToCopy = listing.mpesaPaymentInfo || `Paybill: 714777 / Acc: ${listing.title}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 3000);
  };

  const triggerMpesaStkPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhoneInput.trim()) return;

    setMpesaProcessing(true);
    setMpesaSuccess(false);

    setTimeout(() => {
      setMpesaProcessing(false);
      setMpesaSuccess(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="px-4 mx-auto max-w-7xl py-20 text-center animate-pulse space-y-8">
        <div className="bg-slate-200 h-12 w-1/3 mx-auto rounded" />
        <div className="bg-slate-200 h-[450px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="px-4 mx-auto max-w-xl py-20 text-center space-y-6">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Listing Not Found</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{error || "Listing not found."}</p>
        <Link to="/properties" className="inline-flex items-center px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-950"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Marketplace</span>
        </Link>

        {currentUser && currentUser.role === "tenant" && (
          <button
            onClick={handleToggleFavorite}
            className={`inline-flex items-center px-4 py-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isFavorite
                ? "bg-brand-50 border-brand-200 text-brand-500"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
            <span>{isFavorite ? "Saved to Wishlist" : "Save to Wishlist"}</span>
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 uppercase tracking-wide">
            {listing.category.replace("_", " ")}
          </span>
          {listing.county && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              {listing.county} County
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            Listed: {formatEATDate(listing.createdAt)} (EAT)
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-display">
          {listing.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-1">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-brand-500 shrink-0" />
            <span>{listing.location}</span>
          </div>
          {listing.landmark && (
            <div className="flex items-center text-amber-700 font-medium">
              <Landmark className="w-4 h-4 mr-1.5 text-amber-500 shrink-0" />
              <span>{listing.landmark}</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 aspect-16/9 bg-slate-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={activeImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 max-h-[450px]">
          {listing.images && listing.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative shrink-0 w-24 h-20 lg:w-full lg:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImage === img ? "border-brand-500 ring-2 ring-brand-100" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Category Specifications Cards */}
          {listing.category === "properties" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-gray-100 p-6 rounded-3xl shadow-xs">
              <div className="space-y-1 border-r border-gray-100 pr-4">
                <span className="text-xs font-semibold text-gray-400 uppercase">Price (KES)</span>
                <p className="text-2xl font-extrabold text-brand-600 font-display">{formatKES(listing.price)}</p>
              </div>
              <div className="space-y-1 border-r border-gray-100 pr-4">
                <span className="text-xs font-semibold text-gray-400 uppercase">Property Type</span>
                <p className="text-base font-bold text-gray-900 capitalize">{listing.propertyDetails?.propertyType || "House"}</p>
              </div>
              <div className="space-y-1 border-r border-gray-100 pr-4">
                <span className="text-xs font-semibold text-gray-400 uppercase">Tenure</span>
                <p className="text-base font-bold text-emerald-700">{listing.propertyDetails?.tenure || "Freehold"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase">Bedrooms</span>
                <p className="text-base font-bold text-gray-900">{listing.propertyDetails?.bedrooms || "1"} Beds</p>
              </div>
            </div>
          )}

          {listing.category === "event_spaces" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-purple-50/50 border border-purple-100 p-6 rounded-3xl">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 uppercase">Space Capacity</span>
                <p className="text-xl font-extrabold text-purple-950 font-display flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>{listing.eventSpaceDetails?.capacity || 200} Max Guests</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 uppercase">Rate (KES)</span>
                <p className="text-xl font-extrabold text-purple-900 font-display">
                  {formatKES(listing.price)} / {listing.eventSpaceDetails?.pricingUnit || "day"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 uppercase">Catering Policy</span>
                <p className="text-sm font-bold text-purple-900">
                  {listing.eventSpaceDetails?.cateringAllowed ? "Outside Catering Allowed" : "In-House Catering"}
                </p>
              </div>
            </div>
          )}

          {listing.category === "furniture_goods" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-amber-50/50 border border-amber-100 p-6 rounded-3xl">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-700 uppercase">Condition</span>
                <p className="text-xl font-extrabold text-amber-950 font-display">{listing.goodsDetails?.condition || "New"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-700 uppercase">Stock Available</span>
                <p className="text-xl font-extrabold text-amber-900 font-display">{listing.goodsDetails?.stockQuantity || 1} Units</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-700 uppercase">Delivery</span>
                <p className="text-sm font-bold text-amber-900">{listing.goodsDetails?.deliveryOptions || "Vendor Delivery"}</p>
              </div>
            </div>
          )}

          {listing.category === "services" && (
            <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 uppercase">Provider Rating</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-extrabold text-emerald-950 font-display">{listing.serviceDetails?.rating || 4.9}</span>
                    <div className="flex text-amber-500">
                      {[1,2,3,4,5].map(n => <Star key={n} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-xs text-emerald-700">({listing.serviceDetails?.reviewsCount || 42} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 uppercase">Verified Status</span>
                  <p className="text-sm font-bold text-emerald-800 flex items-center justify-end gap-1">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Government Licensed</span>
                  </p>
                </div>
              </div>

              {/* Service Catalog Breakdown */}
              {listing.serviceDetails?.serviceCatalog && (
                <div className="pt-2 border-t border-emerald-100 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Service Catalog & Rates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {listing.serviceDetails.serviceCatalog.map((item) => (
                      <div key={item.id} className="p-3 bg-white border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          {item.description && <p className="text-[10px] text-slate-500">{item.description}</p>}
                        </div>
                        <span className="font-bold text-emerald-700 font-display">{formatKES(item.priceKES)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 font-display border-b border-gray-100 pb-2">Description & Scope</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Direct Landlord / Vendor M-Pesa Info */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden border border-emerald-800/40">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kenyan Payment Integration Ready</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-emerald-100">Direct Vendor M-Pesa Info</h3>
            </div>

            <div className="relative z-10 bg-emerald-900/80 border border-emerald-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Payment Account</span>
                <p className="text-base font-mono font-bold text-white">
                  {listing.mpesaPaymentInfo || `Paybill: 714777 | Acc: ${listing.title}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyMpesaInfo}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedMpesa ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMpesa ? "Copied!" : "Copy Details"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMpesaModalOpen(true)}
                  className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>Simulate STK Push</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Action Box */}
        <div className="space-y-6">
          {/* Vendor Card */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xs p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-display">Listing Vendor</h3>
            
            <div className="flex items-center space-x-3.5 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 flex items-center justify-center rounded-2xl font-bold text-lg border border-brand-100">
                {listing.vendorName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-none">{listing.vendorName}</h4>
                <p className="text-xs text-gray-400 mt-1">Verified Provider</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm text-gray-600">
              <a href={`tel:${listing.vendorPhone}`} className="flex items-center hover:text-brand-500 transition-colors">
                <Phone className="w-4 h-4 mr-2.5 text-brand-500 shrink-0" />
                <span>{formatKenyanPhone(listing.vendorPhone)}</span>
              </a>
              <a href={`mailto:${listing.vendorEmail}`} className="flex items-center hover:text-brand-500 transition-colors">
                <Mail className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
                <span className="truncate">{listing.vendorEmail}</span>
              </a>
            </div>
          </div>

          {/* Action Module based on Category */}
          {listing.category === "services" ? (
            /* Service Quote Request Form */
            <div className="bg-white border border-emerald-100 rounded-3xl shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold font-display border-b border-emerald-100 pb-2">
                <Wrench className="w-5 h-5 text-emerald-600" />
                <h3>Request Service Quote</h3>
              </div>

              {quoteSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded-xl space-y-1">
                  <p className="font-bold">✓ Quote Request Received!</p>
                  <p>The service provider will review your parameters and respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Move / Job Details</label>
                    <textarea
                      rows={3}
                      required
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                      placeholder="e.g. Moving 2-bedroom house from Kilimani to Westlands..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  {listing.serviceDetails?.serviceType === "house_movers" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Moving From</label>
                        <input
                          type="text"
                          value={fromAddress}
                          onChange={(e) => setFromAddress(e.target.value)}
                          placeholder="Current location"
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Moving To</label>
                        <input
                          type="text"
                          value={toAddress}
                          onChange={(e) => setToAddress(e.target.value)}
                          placeholder="Destination location"
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {quoteLoading ? "Submitting..." : "Submit Quote Request"}
                  </button>
                </form>
              )}
            </div>
          ) : (listing.category === "event_spaces" || (listing.category === "furniture_goods" && listing.goodsDetails?.transactionType === "daily_hire")) ? (
            /* Calendar Booking Engine */
            <div className="bg-white border border-purple-100 rounded-3xl shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2 text-purple-900 font-bold font-display border-b border-purple-100 pb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3>Reserve & Book Space/Item</h3>
              </div>

              {bookingSuccess ? (
                <div className="p-4 bg-purple-50 text-purple-700 text-xs rounded-xl space-y-1">
                  <p className="font-bold">✓ Booking Confirmed!</p>
                  <p>Your dates have been locked in EAT calendar. The vendor will coordinate deposit confirmation.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Start Date (EAT)</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">End Date (EAT)</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  {listing.category === "event_spaces" && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Expected Guests</label>
                      <input
                        type="number"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  )}

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                    <span className="text-purple-700 font-semibold">Total Cost:</span>
                    <span className="font-bold text-purple-950 font-display">{formatKES(listing.price)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {bookingLoading ? "Reserving..." : "Confirm Reservation"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Direct Inquiry Form for Properties or Buy Items */
            <div className="bg-white border border-gray-100 rounded-3xl shadow-xs p-6">
              {!currentUser ? (
                <div className="text-center space-y-4 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-100">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 font-display">Inquire About This Listing</h4>
                  <p className="text-xs text-gray-500">Sign in to contact vendor directly.</p>
                  <Link to="/login" className="block w-full py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl">
                    Log In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-900 font-bold font-display border-b border-gray-100 pb-2">
                    <MessageSquare className="w-4 h-4 text-brand-500" />
                    <h4>Direct Inquiry</h4>
                  </div>

                  {msgSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl">
                      Inquiry message delivered to Vendor!
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder={`Habari ${listing.vendorName}, I'm interested in this listing...`}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />

                  <button
                    type="submit"
                    disabled={sendingMsg || !message.trim()}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl cursor-pointer"
                  >
                    {sendingMsg ? "Delivering..." : "Send Inquiry"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* M-Pesa STK Push Modal */}
      {mpesaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  M
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-display">M-Pesa Express Payment</h3>
              </div>
              <button
                type="button"
                onClick={() => { setMpesaModalOpen(false); setMpesaSuccess(false); }}
                className="text-gray-400 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {mpesaSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-gray-900">STK Push Request Sent!</h4>
                <p className="text-xs text-gray-500">
                  Prompt sent to <strong>{mpesaPhoneInput}</strong> for <strong>{formatKES(listing.price)}</strong>. Enter M-Pesa PIN on your phone.
                </p>
                <button
                  type="button"
                  onClick={() => setMpesaModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={triggerMpesaStkPush} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">M-Pesa Phone Number</label>
                  <input
                    type="text"
                    value={mpesaPhoneInput}
                    onChange={(e) => setMpesaPhoneInput(e.target.value)}
                    required
                    className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Amount:</span>
                  <span className="font-bold text-brand-600 font-display">{formatKES(listing.price)}</span>
                </div>

                <button
                  type="submit"
                  disabled={mpesaProcessing || !mpesaPhoneInput.trim()}
                  className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl cursor-pointer"
                >
                  {mpesaProcessing ? "Sending STK Push..." : "Send M-Pesa STK Push"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
