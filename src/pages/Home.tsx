import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building, Key, ShieldCheck, ArrowRight, Sparkles, Smartphone, Map } from "lucide-react";
import { propertyAPI } from "../api";
import { Property } from "../types";
import PropertyCard from "../components/PropertyCard";
import { POPULAR_KENYA_LANDMARKS } from "../utils/kenya";

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    propertyAPI.getAll({ limit: 3 })
      .then((data) => {
        setFeatured(data.properties);
      })
      .catch((err) => console.error("Error loading homepage listings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?location=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/properties");
    }
  };

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-24 md:py-32">
        {/* Background Image Accent */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Kenyan Rental Homes background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 to-slate-900/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center md:text-left">
          <div className="max-w-3xl space-y-6">
            {/* Kenya Market Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-current animate-pulse" />
              <span>Kenya's Premier Rental Marketplace • KES / EAT</span>
            </div>

            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight leading-tight font-display">
              Find Your Ideal <br className="hidden sm:inline" />
              <span className="text-brand-500">Rental Home</span> in Kenya
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Explore verified apartments, executive townhouses, and family homes in Nairobi, Westlands, Kilimani, Mombasa, Nakuru, and across all 47 counties.
            </p>

            {/* Quick Search Box */}
            <form onSubmit={handleSearchSubmit} className="mt-8 bg-white p-2 rounded-2xl shadow-xl max-w-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-2 text-slate-800">
                <MapPin className="w-5 h-5 text-brand-500 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Westlands, Kilimani, Nyali, Nakuru..."
                  className="w-full text-sm text-slate-900 focus:outline-hidden placeholder-slate-400 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-brand-500/20"
              >
                <Search className="w-4 h-4" />
                <span>Search Rentals</span>
              </button>
            </form>

            {/* Landmark tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
              <span className="text-slate-400 font-semibold">Popular Areas:</span>
              {["Westlands", "Kilimani", "Nyali", "Lavington", "Kiamunyi"].map((area) => (
                <button
                  key={area}
                  onClick={() => navigate(`/properties?location=${encodeURIComponent(area)}`)}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-brand-500 text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-display">Built for the Kenyan Property Market</h2>
          <p className="text-sm text-organic-muted mt-2 leading-relaxed">
            Eliminating broker middlemen with transparent KES pricing, local county administrative structure, and M-Pesa payment info.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#e5e5e0] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-6 font-bold">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">47 Counties & Sub-Counties</h3>
            <p className="text-sm text-organic-muted leading-relaxed">
              Filter easily by County (Nairobi, Mombasa, Kiambu, Nakuru, Uasin Gishu) down to specific estates and nearby landmarks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e5e5e0] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-6 font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">M-Pesa Rent & Deposit Info</h3>
            <p className="text-sm text-organic-muted leading-relaxed">
              Direct Paybill, Till Number, or mobile account details provided by verified landlords with built-in STK Push payment simulation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e5e5e0] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-6 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">Direct Landlord Contact</h3>
            <p className="text-sm text-organic-muted leading-relaxed">
              Message landlords directly with local phone support (+254 07... / 01...) and direct in-app messaging logs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-display">Featured Kenyan Rentals</h2>
            <p className="text-sm text-gray-500 mt-1">Explore our most popular, newly-published rental properties across Kenya.</p>
          </div>
          <Link
            to="/properties"
            className="group inline-flex items-center text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                showFavoriteButton={false} // Clean up on homepage
              />
            ))}
          </div>
        )}
      </section>

      {/* Landlord Call to Action */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="bg-brand-50 rounded-3xl border border-brand-100/50 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl text-center md:text-left space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">Are You a Landlord in Kenya?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              List your residential property, receive direct inquiries from verified tenants, and display your M-Pesa payment information clearly.
            </p>
          </div>
          <Link
            to="/add-property"
            className="shrink-0 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-md cursor-pointer transition-all"
          >
            List Property Now
          </Link>
        </div>
      </section>
    </div>
  );
}
