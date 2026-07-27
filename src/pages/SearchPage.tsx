import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyAPI, favoriteAPI, authAPI } from "../api";
import { MarketplaceListing, User, MarketplaceCategory } from "../types";
import Filters, { FiltersState } from "../components/Filters";
import PropertyCard from "../components/PropertyCard";
import { Building, RefreshCw } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const initialFilters: FiltersState = {
    category: (searchParams.get("category") as MarketplaceCategory) || "all",
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    county: searchParams.get("county") || "all",
    propertyType: searchParams.get("propertyType") || "all",
    listingType: searchParams.get("listingType") || "all",
    spaceType: searchParams.get("spaceType") || "all",
    itemType: searchParams.get("itemType") || "all",
    serviceType: searchParams.get("serviceType") || "all",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
  };

  const [activeFilters, setActiveFilters] = useState<FiltersState>(initialFilters);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      favoriteAPI.getFavorites()
        .then((favs) => {
          setFavorites(favs.map((f) => f.id));
        })
        .catch((err) => console.error("Error loading user favorites:", err));
    }
  }, []);

  useEffect(() => {
    const filters: FiltersState = {
      category: (searchParams.get("category") as MarketplaceCategory) || "all",
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      county: searchParams.get("county") || "all",
      propertyType: searchParams.get("propertyType") || "all",
      listingType: searchParams.get("listingType") || "all",
      spaceType: searchParams.get("spaceType") || "all",
      itemType: searchParams.get("itemType") || "all",
      serviceType: searchParams.get("serviceType") || "all",
      priceMin: searchParams.get("priceMin") || "",
      priceMax: searchParams.get("priceMax") || "",
    };
    setActiveFilters(filters);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const queryParams = {
      ...activeFilters,
      page: currentPage,
      limit,
    };

    propertyAPI.getAll(queryParams)
      .then((data) => {
        setListings(data.listings || data.properties || []);
        setTotal(data.total || 0);
      })
      .catch((err) => console.error("Failed to load marketplace listings:", err))
      .finally(() => setLoading(false));
  }, [activeFilters, currentPage]);

  const handleApplyFilters = (newFilters: FiltersState) => {
    const params: any = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== "all") params[key] = val;
    });
    setSearchParams(params);
  };

  const handleToggleFavorite = async (id: string) => {
    if (!currentUser) {
      alert("Please login first to save items to your wishlist!");
      throw new Error("Unauthenticated action");
    }
    await favoriteAPI.toggleFavorite(id);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header Summary */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
          Kenyan Multi-Category Marketplace
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? "Searching listings..." : `Showing ${listings.length} of ${total} listings matched`}
        </p>
      </div>

      {/* Filters Form Panel */}
      <Filters onApplyFilters={handleApplyFilters} initialFilters={activeFilters} />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs h-96 animate-pulse">
              <div className="bg-slate-200 h-48 w-full" />
              <div className="p-5 space-y-4">
                <div className="bg-slate-200 h-6 w-1/3 rounded" />
                <div className="bg-slate-200 h-4 w-3/4 rounded" />
                <div className="bg-slate-200 h-4 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-display">No Listings Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1 leading-relaxed">
            We couldn't find any items matching your filter criteria. Try changing categories or resetting filters.
          </p>
          <button
            onClick={() => handleApplyFilters({
              category: "all",
              search: "",
              location: "",
              county: "all",
              propertyType: "all",
              listingType: "all",
              spaceType: "all",
              itemType: "all",
              serviceType: "all",
              priceMin: "",
              priceMax: ""
            })}
            className="mt-6 px-5 py-2.5 bg-gray-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Search Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <PropertyCard
                key={item.id}
                listing={item}
                isInitiallyFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                showFavoriteButton={!!currentUser && currentUser.role === "tenant"}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-500 font-display">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
