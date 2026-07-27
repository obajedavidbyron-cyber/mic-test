import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyAPI, authAPI } from "../api";
import { Property, User } from "../types";
import { ArrowLeft, Building, Trash2, Eye, Calendar, Plus, RefreshCw, Sparkles, Home } from "lucide-react";

export default function MyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadListings = () => {
    setLoading(true);
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      propertyAPI.getAll({ landlordId: user.id })
        .then((data) => {
          setProperties(data.properties);
        })
        .catch((err) => console.error("Error loading Landlord listings:", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you absolutely sure you want to permanently delete this property listing? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await propertyAPI.delete(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property listing. Please try again.");
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Back & Action links */}
      <div className="flex items-center justify-between">
        <Link to="/landlord" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Landlord Dashboard</span>
        </Link>
        <Link
          to="/add-property"
          className="inline-flex items-center px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Property
        </Link>
      </div>

      {/* Header Summary */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">My Published Listings</h1>
        <p className="text-sm text-gray-500">
          {loading ? "Syncing properties..." : `You have ${properties.length} active property listings listed for rent.`}
        </p>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 h-28 w-full" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-display">No Published Listings</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-1 leading-relaxed">
            You haven't listed any properties yet. Click the "Add Property" button above to publish your very first rental home.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((prop) => {
            const displayImg = prop.images && prop.images.length > 0
              ? prop.images[0]
              : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={prop.id}
                className="bg-white border border-gray-100 hover:border-brand-100/55 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                {/* Information segment */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-gray-100 shrink-0">
                    <img src={displayImg} alt={prop.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                      {prop.propertyType}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 truncate font-display leading-none">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{prop.location}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                      <span>{prop.bedrooms} Bed</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{prop.bathrooms} Bath</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-brand-500 font-extrabold">${prop.price.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Actions Segment */}
                <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                  <Link
                    to={`/properties/${prop.id}`}
                    className="inline-flex items-center px-3.5 py-2 border border-gray-150 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Listing
                  </Link>

                  <button
                    onClick={() => handleDelete(prop.id)}
                    className="inline-flex items-center px-3.5 py-2 border border-red-200 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
