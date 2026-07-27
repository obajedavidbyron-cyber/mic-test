import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyAPI, messageAPI, authAPI, bookingAPI, quoteAPI } from "../api";
import { MarketplaceListing, Message, User, Booking, ServiceQuoteRequest } from "../types";
import { Building, MessageSquare, User as UserIcon, RefreshCw, Calendar, ArrowRight, ShieldCheck, Eye, Wrench, ShoppingBag, Plus } from "lucide-react";
import { formatKES } from "../utils/kenya";

interface LandlordDashboardProps {
  onUserUpdate?: (user: User) => void;
}

export default function LandlordDashboard({ onUserUpdate }: LandlordDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "bookings" | "quotes" | "messages" | "profile">("overview");
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<ServiceQuoteRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Profile forms
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("landlord");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

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
      propertyAPI.getAll({ landlordId: user?.id }),
      messageAPI.getMessages(),
      bookingAPI.getBookings(),
      quoteAPI.getQuoteRequests()
    ])
      .then(([props, msgs, bks, qts]) => {
        setListings(props.listings || props.properties || []);
        setMessages(msgs);
        setBookings(bks);
        setQuotes(qts);
      })
      .catch((err) => {
        console.error("Error loading Landlord data:", err);
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

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await propertyAPI.delete(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Greeting Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-3 py-1.5 bg-emerald-50 rounded-full">
            Vendor & Landlord Portal
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
            Welcome Back, {currentUser?.name}!
          </h1>
          <p className="text-sm text-gray-500">
            Manage properties, event space reservations, furniture inventory, and home service quotes in Kenya.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-150 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </button>
          <Link
            to="/add-property"
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Post Listing</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-150 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "overview" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "listings" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center space-x-2 pb-4 px-5 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "bookings" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Space/Hire Bookings ({bookings.length})</span>
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

      {/* Tab Panels */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">Loading vendor metrics...</div>
      ) : activeTab === "overview" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 uppercase">Listings</span>
              <p className="text-3xl font-extrabold text-gray-900 font-display mt-1">{listings.length}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-purple-600 uppercase">Bookings</span>
              <p className="text-3xl font-extrabold text-purple-950 font-display mt-1">{bookings.length}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-emerald-600 uppercase">Quote Requests</span>
              <p className="text-3xl font-extrabold text-emerald-950 font-display mt-1">{quotes.length}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-brand-600 uppercase">Inquiries</span>
              <p className="text-3xl font-extrabold text-brand-950 font-display mt-1">{messages.length}</p>
            </div>
          </div>
        </div>
      ) : activeTab === "listings" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 font-display">All Active Listings</h3>
            <Link to="/add-property" className="px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl">
              + Post New Item
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img src={item.images?.[0]} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase">{item.category.replace("_", " ")}</span>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-brand-600 font-extrabold font-display">{formatKES(item.price)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteListing(item.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "bookings" ? (
        <div className="space-y-4">
          {bookings.map((bk) => (
            <div key={bk.id} className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">{bk.status.toUpperCase()}</span>
                <p className="font-bold text-gray-900 text-sm mt-1">Listing #{bk.listingId}</p>
                <p className="text-xs text-gray-500">{bk.startDate} to {bk.endDate}</p>
              </div>
              <span className="font-bold text-purple-900 font-display text-sm">{formatKES(bk.totalAmountKES)}</span>
            </div>
          ))}
        </div>
      ) : activeTab === "quotes" ? (
        <div className="space-y-4">
          {quotes.map((qt) => (
            <div key={qt.id} className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs space-y-2">
              <span className="text-xs font-bold text-emerald-700">Quote #{qt.id.slice(-6)}</span>
              <p className="text-xs text-gray-700 italic">"{qt.details}"</p>
            </div>
          ))}
        </div>
      ) : activeTab === "messages" ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs space-y-1">
              <p className="font-bold text-xs text-gray-900">{msg.tenantName} inquired on {msg.propertyTitle}</p>
              <p className="text-xs text-gray-600 bg-slate-50 p-2.5 rounded-xl">"{msg.message}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl bg-white border border-gray-100 rounded-3xl p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-display border-b border-gray-100 pb-2">Vendor Profile</h3>
            {profileSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl">Profile updated!</div>}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Vendor Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Vendor Phone (+254)</label>
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
