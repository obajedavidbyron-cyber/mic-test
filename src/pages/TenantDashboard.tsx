import React, { useEffect, useState } from "react";
import { favoriteAPI, messageAPI, authAPI, bookingAPI, quoteAPI } from "../api";
import { MarketplaceListing, Message, User, Booking, ServiceQuoteRequest } from "../types";
import PropertyCard from "../components/PropertyCard";
import { Heart, MessageSquare, User as UserIcon, RefreshCw, Calendar, ShieldCheck, Wrench, Clock, CheckCircle } from "lucide-react";
import { formatKES } from "../utils/kenya";

interface TenantDashboardProps {
  onUserUpdate?: (user: User) => void;
}

export default function TenantDashboard({ onUserUpdate }: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"wishlist" | "bookings" | "quotes" | "messages" | "profile">("wishlist");
  const [favorites, setFavorites] = useState<MarketplaceListing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<ServiceQuoteRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Profile forms
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Upgrade to Landlord/Vendor state
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setRole(user.role);
    }

    Promise.all([
      favoriteAPI.getFavorites(),
      messageAPI.getMessages(),
      bookingAPI.getBookings(),
      quoteAPI.getQuoteRequests()
    ])
      .then(([favs, msgs, bks, qts]) => {
        setFavorites(favs);
        setMessages(msgs);
        setBookings(bks);
        setQuotes(qts);
      })
      .catch((err) => {
        console.error("Error loading Tenant data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          authAPI.logout();
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBecomeLandlord = async () => {
    setUpgrading(true);
    setUpgradeError("");
    try {
      const updated = await authAPI.updateProfile({ role: "landlord" });
      setCurrentUser(updated);
      setUpgradeSuccess(true);
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
    } catch (err: any) {
      console.error("Error upgrading to landlord:", err);
      setUpgradeError(err.response?.data?.error || "Failed to upgrade your account.");
    } finally {
      setUpgrading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    await favoriteAPI.toggleFavorite(id);
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(false);
    try {
      const updated = await authAPI.updateProfile({ name, phone, role });
      setCurrentUser(updated);
      setProfileSuccess(true);
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Greeting Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-wider px-3 py-1.5 bg-brand-50 rounded-full">
            Customer & Client Hub
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
            Welcome, {currentUser?.name}!
          </h1>
          <p className="text-sm text-gray-500">
            Track saved wishlist items, manage event/hire bookings, review service quote responses, and message vendors.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-150 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Data
        </button>
      </div>

      {/* Upgrade Card */}
      {upgradeSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Congratulations! Your account is upgraded to Vendor / Landlord.</span>
            </div>
            <p className="text-xs text-emerald-600">You can now list properties, event halls, furniture, or home services.</p>
          </div>
          <button
            onClick={() => window.location.href = "/landlord"}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl"
          >
            Go to Vendor Dashboard &rarr;
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider px-2.5 py-1 bg-brand-50 rounded-full">
              Vendor & Landlord Portal
            </span>
            <h2 className="text-xl font-bold text-gray-900 font-display">
              Want to list properties, event spaces, furniture, or home services?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Become a verified vendor in Kenya! Post listings, manage bookings, upload reels, and receive client quote requests instantly.
            </p>
          </div>
          <button
            onClick={handleBecomeLandlord}
            disabled={upgrading}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            {upgrading ? "Upgrading..." : "Become a Vendor / Landlord"}
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-150 scrollbar-none">
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "wishlist" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "bookings" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Space & Hire Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "quotes" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Service Quotes ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "messages" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inquiries ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "profile" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">Loading dashboard...</div>
      ) : activeTab === "wishlist" ? (
        favorites.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 font-display">Wishlist Empty</h3>
            <p className="text-sm text-gray-500">Save properties, event halls, or furniture items to track them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((item) => (
              <PropertyCard
                key={item.id}
                listing={item}
                isInitiallyFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )
      ) : activeTab === "bookings" ? (
        bookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 font-display">No Bookings Yet</h3>
            <p className="text-sm text-gray-500">When you reserve event halls, serviced BnBs, or hire equipment, your reservations will show here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((bk) => (
              <div key={bk.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      STATUS: {bk.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">EAT Schedule</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mt-1 font-display">Reservation for Listing #{bk.listingId}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Dates: {bk.startDate} to {bk.endDate} • Guests: {bk.guestsCount || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">Total KES</span>
                  <p className="text-lg font-extrabold text-brand-600 font-display">{formatKES(bk.totalAmountKES)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "quotes" ? (
        quotes.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 font-display">No Service Quotes</h3>
            <p className="text-sm text-gray-500">Submit requests to house movers or building contractors to see quote responses here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((qt) => (
              <div key={qt.id} className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-50 pb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase">Service Request #{qt.id.slice(-6)}</span>
                  <span className="text-xs font-bold text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-full">
                    {qt.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic">"{qt.details}"</p>
                {qt.estimatedPriceKES && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-950 flex justify-between">
                    <span>Provider Estimated Price:</span>
                    <span className="font-display text-emerald-700">{formatKES(qt.estimatedPriceKES)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : activeTab === "messages" ? (
        messages.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 font-display">No Inquiries</h3>
            <p className="text-sm text-gray-500">Inquiry messages sent to vendors will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-bold text-gray-900">{msg.propertyTitle}</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic">"{msg.message}"</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="max-w-2xl bg-white border border-gray-100 rounded-3xl p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-display border-b border-gray-100 pb-2">Profile Settings</h3>
            {profileSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl">Profile saved!</div>}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Phone (+254)</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="block w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" />
            </div>
            <button type="submit" disabled={profileLoading} className="px-6 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl">
              Save Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
