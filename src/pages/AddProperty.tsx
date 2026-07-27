import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { propertyAPI } from "../api";
import { ArrowLeft, Building, Upload, AlertCircle, Check, Link as LinkIcon, Map, MapPin, Landmark, CreditCard, Video, Calendar, ShoppingBag, Wrench } from "lucide-react";
import { KENYA_COUNTIES } from "../utils/kenya";
import { MarketplaceCategory } from "../types";

export default function AddProperty() {
  const [category, setCategory] = useState<MarketplaceCategory>("properties");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [county, setCounty] = useState("Nairobi");
  const [subCounty, setSubCounty] = useState("Westlands");
  const [neighborhood, setNeighborhood] = useState("");
  const [landmark, setLandmark] = useState("");
  const [mpesaPaymentInfo, setMpesaPaymentInfo] = useState("Paybill: 714777 | Acc: LISTING");
  const [price, setPrice] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Category specific fields
  // Properties
  const [listingType, setListingType] = useState<"rent" | "sale">("rent");
  const [propertyType, setPropertyType] = useState<any>("apartment");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [sizeAcres, setSizeAcres] = useState("");
  const [tenure, setTenure] = useState<"Freehold" | "Leasehold">("Freehold");
  const [zoningType, setZoningType] = useState<any>("Residential");

  // Event Spaces
  const [spaceType, setSpaceType] = useState<any>("hall");
  const [pricingUnit, setPricingUnit] = useState<any>("per_day");
  const [capacity, setCapacity] = useState("200");
  const [cateringAllowed, setCateringAllowed] = useState(true);

  // Goods
  const [itemType, setItemType] = useState<any>("furniture");
  const [transactionType, setTransactionType] = useState<any>("sale");
  const [condition, setCondition] = useState<any>("New");
  const [deliveryOptions, setDeliveryOptions] = useState<any>("Vendor Delivery");
  const [stockQuantity, setStockQuantity] = useState("10");

  // Services
  const [serviceType, setServiceType] = useState<any>("house_movers");
  const [rateModel, setRateModel] = useState<any>("quote_based");

  // Amenities
  const presetAmenities = ["Wi-Fi", "AC", "Swimming Pool", "Borehole Water", "24/7 Security & CCTV", "Parking Garage", "Pet Friendly", "DSQ (Domestic Staff Quarter)"];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Images
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentCountyObj = KENYA_COUNTIES.find(c => c.name === county);

  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty);
    const found = KENYA_COUNTIES.find(c => c.name === newCounty);
    if (found && found.subCounties.length > 0) {
      setSubCounty(found.subCounties[0].name);
    } else {
      setSubCounty("");
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError("");
    try {
      const res = await propertyAPI.uploadImage(file);
      setUploadedImages((prev) => [...prev, res.imageUrl]);
    } catch (err) {
      console.error("Image upload failure:", err);
      setError("Failed to upload local image file.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddUrlImage = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !location || !price || !county) {
      setError("Please fill in all required fields including Title, Location, and Price.");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        category,
        title,
        description,
        location,
        county,
        subCounty,
        neighborhood,
        landmark,
        mpesaPaymentInfo,
        price,
        videoUrl,
        images: uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
      };

      if (category === "properties") {
        payload.propertyDetails = {
          listingType,
          propertyType,
          bedrooms: parseInt(bedrooms, 10),
          bathrooms: parseFloat(bathrooms),
          sizeAcres: sizeAcres ? parseFloat(sizeAcres) : undefined,
          tenure,
          zoningType,
          utilities: selectedAmenities
        };
      } else if (category === "event_spaces") {
        payload.eventSpaceDetails = {
          spaceType,
          pricingUnit,
          capacity: parseInt(capacity, 10),
          cateringAllowed,
          amenities: selectedAmenities,
          rules: ["Clean setup protocol"]
        };
      } else if (category === "furniture_goods") {
        payload.goodsDetails = {
          itemType,
          transactionType,
          condition,
          deliveryOptions,
          stockQuantity: parseInt(stockQuantity, 10)
        };
      } else if (category === "services") {
        payload.serviceDetails = {
          serviceType,
          rateModel,
          countiesServed: [county],
          verifiedLicense: true,
          serviceCatalog: [
            { id: "s1", title: `${title} Standard Package`, priceKES: parseFloat(price) }
          ],
          rating: 5.0,
          reviewsCount: 1
        };
      }

      await propertyAPI.create(payload);
      navigate("/my-listings");
    } catch (err: any) {
      console.error("Listing creation failure:", err);
      setError(err.response?.data?.error || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <Link to="/landlord" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Vendor Dashboard</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-xs p-6 md:p-8 space-y-8">
        <div className="flex items-center space-x-3.5 border-b border-gray-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 font-display">Create New Marketplace Listing</h1>
            <p className="text-sm text-gray-500">Post Properties, Event Halls, Furniture/Goods, or Home Services in Kenya.</p>
          </div>
        </div>

        {/* Category Selector Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Select Category *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "properties", label: "Properties 🏡", icon: Building },
              { id: "event_spaces", label: "Event Spaces 🎪", icon: Calendar },
              { id: "furniture_goods", label: "Furniture & Goods 🛋️", icon: ShoppingBag },
              { id: "services", label: "Home Services 🚚", icon: Wrench },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as any)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  category === cat.id
                    ? "border-brand-500 bg-brand-50/50 text-brand-600 shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <cat.icon className="w-5 h-5" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 font-display flex items-center">
              <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-600 text-xs font-bold inline-flex items-center justify-center mr-2">1</span>
              Listing Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Executive 3-Bed Apartment / Grand Westlands Ballroom / Solid Mahogany Desk"
                  className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* County */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">County *</label>
                <select
                  value={county}
                  onChange={(e) => handleCountyChange(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub-County / Area Address *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Westlands, Kilimani, Diani..."
                  className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              {/* Price in KES */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Rate (KES) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 85000"
                  className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-brand-600"
                />
              </div>

              {/* M-Pesa Info */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider">M-Pesa Payment Details</label>
                <input
                  type="text"
                  value={mpesaPaymentInfo}
                  onChange={(e) => setMpesaPaymentInfo(e.target.value)}
                  placeholder="Paybill: 714777 | Acc: LISTING"
                  className="block w-full px-3 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-mono"
                />
              </div>

              {/* Video URL for Property Reels */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Video Tour URL (Auto-posts to Property Reels Feed)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/mixkit-..."
                  className="block w-full px-3 py-2.5 bg-red-50/30 border border-red-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full specification details, terms, amenities, delivery options..."
                className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display flex items-center">
              <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-600 text-xs font-bold inline-flex items-center justify-center mr-2">2</span>
              Images & Gallery
            </h3>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste Image URL (Unsplash, etc.)"
                className="block flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl"
              >
                Add Image
              </button>
            </div>

            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-red-600/90 text-white font-bold text-[10px] flex items-center justify-center"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link to="/landlord" className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
