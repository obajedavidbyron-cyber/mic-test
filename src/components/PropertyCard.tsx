import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Users, ShieldCheck, Star, Package, Video } from "lucide-react";
import { MarketplaceListing } from "../types";
import { formatKES } from "../utils/kenya";

export interface ListingCardProps {
  key?: React.Key;
  listing?: MarketplaceListing;
  property?: MarketplaceListing;
  isInitiallyFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  showFavoriteButton?: boolean;
}

export default function PropertyCard({
  listing: inputListing,
  property: inputProperty,
  isInitiallyFavorite = false,
  onToggleFavorite,
  showFavoriteButton = true,
}: ListingCardProps) {
  const listing = inputListing || inputProperty;
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isToggling, setIsToggling] = useState(false);

  if (!listing) return null;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onToggleFavorite || isToggling) return;

    setIsToggling(true);
    try {
      await onToggleFavorite(listing.id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const displayImage = listing.images && listing.images.length > 0
    ? listing.images[0]
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  const getCategoryBadge = () => {
    switch (listing.category) {
      case "event_spaces":
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white">Event Space</span>;
      case "furniture_goods":
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white">Furniture & Goods</span>;
      case "services":
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white">Home Service</span>;
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white capitalize">
            {listing.propertyDetails?.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
        );
    }
  };

  const getPriceSuffix = () => {
    if (listing.category === "event_spaces") {
      const unit = listing.eventSpaceDetails?.pricingUnit || "per_day";
      if (unit === "per_hour") return " / hr";
      if (unit === "per_night") return " / night";
      return " / day";
    }
    if (listing.category === "furniture_goods") {
      if (listing.goodsDetails?.transactionType === "daily_hire") return " / day hire";
      return " sale";
    }
    if (listing.category === "services") {
      return " est.";
    }
    return listing.propertyDetails?.listingType === "sale" ? "" : " / mo";
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#e5e5e0] hover:shadow-lg hover:border-brand-500/40 transition-all duration-300 flex flex-col h-full">
      {/* Image & Video Indicator */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Favorite Heart Button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            disabled={isToggling}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border shadow-xs transition-colors duration-200 z-10 cursor-pointer ${
              isFavorite
                ? "bg-white border-brand-100 text-brand-500 hover:bg-brand-50"
                : "bg-white/80 border-white/20 text-gray-600 hover:text-brand-500 hover:bg-white"
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Video Reel Badge */}
        {listing.videoUrl && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
            <Video className="w-3 h-3" />
            <span>Virtual Tour</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-1.5 z-10">
          {getCategoryBadge()}
          {listing.county && (
            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-brand-500/90 backdrop-blur-md text-white">
              {listing.county}
            </span>
          )}
        </div>
      </div>

      {/* Listing Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-brand-600 font-display">
            {formatKES(listing.price)}
            <span className="text-xs font-normal text-gray-500">{getPriceSuffix()}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#2d2d2a] line-clamp-1 mb-1 font-display group-hover:text-brand-500 transition-colors">
          <Link to={`/properties/${listing.id}`} className="focus:outline-hidden">
            <span className="absolute inset-0" aria-hidden="true" />
            {listing.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="flex items-center text-xs text-[#a3a380] mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500 shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        {/* Category-tailored Bottom Specs */}
        <div className="mt-auto pt-4 border-t border-[#f0f0eb] text-xs text-gray-600">
          {listing.category === "properties" && (
            <div className="grid grid-cols-2 gap-2">
              {listing.propertyDetails?.propertyType === "land_plot" ? (
                <>
                  <div className="font-semibold text-slate-800">
                    Size: {listing.propertyDetails?.sizeAcres ? `${listing.propertyDetails.sizeAcres} Acres` : "Plot"}
                  </div>
                  <div className="text-emerald-700 font-semibold">
                    {listing.propertyDetails?.tenure || "Freehold"}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4 text-brand-500" />
                    <span><strong className="text-gray-900">{listing.propertyDetails?.bedrooms || 1}</strong> Beds</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4 text-brand-500" />
                    <span><strong className="text-gray-900">{listing.propertyDetails?.bathrooms || 1}</strong> Baths</span>
                  </div>
                </>
              )}
            </div>
          )}

          {listing.category === "event_spaces" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-purple-700 font-semibold">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Cap: {listing.eventSpaceDetails?.capacity || 100} guests</span>
              </div>
              <div className="text-gray-500 text-[11px]">
                {listing.eventSpaceDetails?.cateringAllowed ? "Catering Allowed" : "In-House Only"}
              </div>
            </div>
          )}

          {listing.category === "furniture_goods" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-amber-700 font-semibold">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Cond: {listing.goodsDetails?.condition || "New"}</span>
              </div>
              <div className="text-slate-700 font-semibold">
                Stock: {listing.goodsDetails?.stockQuantity || 1}
              </div>
            </div>
          )}

          {listing.category === "services" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Provider</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{listing.serviceDetails?.rating || 4.9} ({listing.serviceDetails?.reviewsCount || 10})</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
