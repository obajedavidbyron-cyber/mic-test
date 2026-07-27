import React, { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Home, Bed, RotateCcw, Landmark, Map, Calendar, ShoppingBag, Wrench, ShieldCheck } from "lucide-react";
import { KENYA_COUNTIES, POPULAR_KENYA_LANDMARKS } from "../utils/kenya";
import { MarketplaceCategory } from "../types";

export interface FiltersState {
  category: MarketplaceCategory | "all";
  search: string;
  location: string;
  county: string;
  propertyType: string;
  listingType: string;
  spaceType: string;
  itemType: string;
  serviceType: string;
  priceMin: string;
  priceMax: string;
}

interface FiltersProps {
  onApplyFilters: (filters: FiltersState) => void;
  initialFilters?: FiltersState;
}

export default function Filters({ onApplyFilters, initialFilters }: FiltersProps) {
  const defaultFilters: FiltersState = {
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
  };

  const [filters, setFilters] = useState<FiltersState>(initialFilters || defaultFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryTab = (cat: MarketplaceCategory | "all") => {
    const updated = { ...filters, category: cat };
    setFilters(updated);
    onApplyFilters(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  const categories = [
    { id: "all", label: "All Marketplace 🏪" },
    { id: "properties", label: "Properties (Sale & Rent) 🏡" },
    { id: "event_spaces", label: "Event Halls & Short-Stays 🎪" },
    { id: "furniture_goods", label: "Furniture & Living Goods 🛋️" },
    { id: "services", label: "Home & Property Services 🚚" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl shadow-xs p-6 mb-8 animate-fade-in space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-bold text-gray-900 font-display">Kenya Multi-Category Marketplace</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full border border-brand-200/50">
          KES Pricing • EAT Timezone
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryTab(cat.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filters.category === cat.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* County Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">County</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Map className="h-4 w-4 text-brand-500" />
            </div>
            <select
              name="county"
              value={filters.county}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all appearance-none font-medium"
            >
              <option value="all">All Counties in Kenya</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.name} value={c.name.toLowerCase()}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location / Neighborhood */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Area or Landmark</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="e.g. Westlands, Kilimani, Diani, Ruiru..."
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Search Keyword */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Keyword</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search title, description, or vendor..."
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Dynamic Category Specific Controls */}
        {filters.category === "properties" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
              >
                <option value="all">All Types (Plots, Houses, Offices)</option>
                <option value="land_plot">Land / Plots</option>
                <option value="house">House / Villa</option>
                <option value="apartment">Apartment / Flat</option>
                <option value="office">Commercial Office</option>
                <option value="shop">Shop / Retail</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Listing Mode</label>
              <select
                name="listingType"
                value={filters.listingType}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
              >
                <option value="all">Sale & Rent</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </>
        )}

        {filters.category === "event_spaces" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Space Type</label>
            <select
              name="spaceType"
              value={filters.spaceType}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option value="all">All Spaces</option>
              <option value="hall">Event Hall / Ballroom</option>
              <option value="conference_room">Conference Room</option>
              <option value="grounds">Outdoor Grounds</option>
              <option value="bnb_apartment">Serviced BnB Apartment</option>
            </select>
          </div>
        )}

        {filters.category === "furniture_goods" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Item Category</label>
            <select
              name="itemType"
              value={filters.itemType}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option value="all">All Living Goods</option>
              <option value="furniture">Home & Office Furniture</option>
              <option value="hire_chairs_tables">Chairs & Tents for Hire</option>
              <option value="decor">Decor & Lighting</option>
              <option value="appliance">Home Appliances</option>
              <option value="building_material">Building Materials</option>
            </select>
          </div>
        )}

        {filters.category === "services" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Service Discipline</label>
            <select
              name="serviceType"
              value={filters.serviceType}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700"
            >
              <option value="all">All Services</option>
              <option value="house_movers">House & Office Movers</option>
              <option value="interior_designer">Interior Designers</option>
              <option value="contractor">Building Contractors</option>
              <option value="cleaning">Cleaning Services</option>
              <option value="land_surveyor">Land Surveyors</option>
              <option value="plumber_electrician">Plumbers & Electricians</option>
            </select>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Budget (KES)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="Min KSh"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="Max KSh"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reset Filters
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Marketplace
        </button>
      </div>
    </form>
  );
}
