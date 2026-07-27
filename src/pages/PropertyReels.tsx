import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Video,
  Heart,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Sparkles,
  Building,
  Calendar,
  ShoppingBag,
  Wrench,
  Check,
  Phone,
  ArrowRight
} from "lucide-react";
import { reelAPI, messageAPI, bookingAPI, quoteAPI } from "../api";
import { Reel, MarketplaceCategory } from "../types";
import { formatKES } from "../utils/kenya";

export default function PropertyReels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  // Modals for Reels Interactive Overlay
  const [activeActionModal, setActiveActionModal] = useState<"chat" | "book" | "quote" | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-08-15");
  const [quoteDetails, setQuoteDetails] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReels(selectedCategory);
  }, [selectedCategory]);

  const loadReels = async (cat: MarketplaceCategory | "all") => {
    setLoading(true);
    try {
      const data = await reelAPI.getReels(cat === "all" ? undefined : cat);
      setReels(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentReel = reels[currentIndex];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async () => {
    if (!currentReel) return;
    try {
      const updated = await reelAPI.likeReel(currentReel.id);
      setReels((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share && currentReel) {
      navigator.share({
        title: currentReel.title,
        text: currentReel.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setActionSuccess("Video link copied to clipboard!");
      setTimeout(() => setActionSuccess(""), 3000);
    }
  };

  // Submit direct chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReel || !chatMessage.trim()) return;
    setSubmitting(true);
    try {
      await messageAPI.sendMessage(currentReel.listingId, chatMessage);
      setActionSuccess("Message sent to vendor!");
      setChatMessage("");
      setTimeout(() => {
        setActionSuccess("");
        setActiveActionModal(null);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Please sign in to send messages");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit space or item booking
  const handleSendBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReel) return;
    setSubmitting(true);
    try {
      await bookingAPI.createBooking({
        listingId: currentReel.listingId,
        startDate: bookingDate,
        totalAmountKES: currentReel.priceKES,
        notes: `Booked via Virtual Reels: ${currentReel.title}`
      });
      setActionSuccess("Booking request sent!");
      setTimeout(() => {
        setActionSuccess("");
        setActiveActionModal(null);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Please sign in to complete bookings");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit service quote
  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReel || !quoteDetails.trim()) return;
    setSubmitting(true);
    try {
      await quoteAPI.createQuoteRequest({
        serviceId: currentReel.listingId,
        details: quoteDetails,
        preferredDate: bookingDate
      });
      setActionSuccess("Quote request sent!");
      setQuoteDetails("");
      setTimeout(() => {
        setActionSuccess("");
        setActiveActionModal(null);
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Please sign in to request quotes");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: "all", label: "All Displays 🎥" },
    { id: "properties", label: "Properties 🏡" },
    { id: "event_spaces", label: "Event Halls 🎪" },
    { id: "furniture_goods", label: "Furniture & Goods 🛋️" },
    { id: "services", label: "Property Services 🚚" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-2 sm:p-6">
      {/* Top Banner & Category Tabs */}
      <div className="w-full max-w-4xl mb-4 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-bold text-brand-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-brand-400" />
          <span>Virtual Showroom & Property Reels Feed</span>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reels Viewer Stage */}
      {loading ? (
        <div className="h-[600px] w-full max-w-sm rounded-3xl bg-slate-900 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Loading Virtual Displays...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="h-[500px] w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <Video className="w-12 h-12 text-slate-600" />
          <h3 className="text-lg font-bold">No Property Reels Found</h3>
          <p className="text-xs text-slate-400">
            No virtual display videos available in this category yet.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-md h-[720px] rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex flex-col">
          {/* Video Player Canvas */}
          <div className="relative w-full h-full bg-black cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              key={currentReel.id}
              src={currentReel.videoUrl}
              poster={currentReel.thumbnailUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Overlay indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <div className="p-4 rounded-full bg-brand-500/80 text-white shadow-xl">
                  <Play className="w-10 h-10 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Top Reel Info Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700 uppercase tracking-wider">
                {currentReel.category.replace("_", " ")}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-black transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Action Bar (TikTok / Reels Style) */}
            <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-4 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-red-500 hover:bg-slate-800 transition-all border border-slate-700/50">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentReel.likesCount}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveActionModal("chat");
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-brand-400 hover:bg-slate-800 transition-all border border-slate-700/50">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 mt-1">Chat</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-blue-400 hover:bg-slate-800 transition-all border border-slate-700/50">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-200 mt-1">Share</span>
              </button>
            </div>

            {/* Bottom Interactive Overlay Card */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1 font-display">
                    {currentReel.title}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-400" />
                    <span>{currentReel.location}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-brand-400 font-display">
                    {formatKES(currentReel.priceKES)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Vendor: {currentReel.vendorName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {currentReel.description}
              </p>

              {/* Instant Action Bar linking directly to underlying listing */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                {currentReel.category === "services" ? (
                  <button
                    onClick={() => setActiveActionModal("quote")}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Request Quote</span>
                  </button>
                ) : currentReel.category === "event_spaces" ? (
                  <button
                    onClick={() => setActiveActionModal("book")}
                    className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Space</span>
                  </button>
                ) : currentReel.category === "furniture_goods" ? (
                  <button
                    onClick={() => setActiveActionModal("book")}
                    className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Item</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveActionModal("chat")}
                    className="w-full py-2.5 px-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Book Tour</span>
                  </button>
                )}

                <Link
                  to={`/properties/${currentReel.listingId}`}
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 border border-slate-700"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Prev/Next Controls */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              ← Previous
            </button>
            <span className="font-bold text-slate-300">
              {currentIndex + 1} of {reels.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === reels.length - 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-30 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Action Modals */}
      {activeActionModal && currentReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg font-display">
                {activeActionModal === "chat" && "Chat with Vendor"}
                {activeActionModal === "book" && "Book Space / Order Item"}
                {activeActionModal === "quote" && "Request Service Quote"}
              </h3>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {actionSuccess ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center space-x-2 text-sm">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            ) : (
              <>
                {/* Modal for Chat */}
                {activeActionModal === "chat" && (
                  <form onSubmit={handleSendChat} className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Regarding: {currentReel.title}</p>
                      <textarea
                        required
                        rows={3}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Habari! I am interested in this listing..."
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {submitting ? "Sending..." : "Send In-App Message"}
                    </button>
                  </form>
                )}

                {/* Modal for Book */}
                {activeActionModal === "book" && (
                  <form onSubmit={handleSendBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Preferred Date (EAT Calendar)</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs space-y-1">
                      <p className="font-bold text-brand-400">Total Rate: {formatKES(currentReel.priceKES)}</p>
                      <p className="text-[11px] text-slate-400">Vendor Contact: {currentReel.vendorPhone}</p>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {submitting ? "Processing..." : "Confirm Booking Request"}
                    </button>
                  </form>
                )}

                {/* Modal for Quote */}
                {activeActionModal === "quote" && (
                  <form onSubmit={handleSendQuote} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Specify Job Details / Locations</label>
                      <textarea
                        required
                        rows={3}
                        value={quoteDetails}
                        onChange={(e) => setQuoteDetails(e.target.value)}
                        placeholder="e.g. Moving 2-bedroom house from Kilimani to Westlands on Saturday..."
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-brand-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {submitting ? "Requesting..." : "Submit Quote Request"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
