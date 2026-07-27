import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { Phone, Mail, Lock, AlertCircle, Home, Shield, UserCheck } from "lucide-react";
import { User } from "../types";

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !role) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await authAPI.register({ name, email, password, phone, role });
      onRegisterSuccess(data.user);

      if (data.user.role === "landlord") {
        navigate("/landlord");
      } else {
        navigate("/properties");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-100">
            <Home className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">Create Your Account</h2>
        <p className="text-sm text-gray-500">Sign up in seconds to find or list rental properties.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 border border-gray-100 rounded-3xl sm:px-10 shadow-xs">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selector Card */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Choose Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("tenant")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all cursor-pointer ${
                    role === "tenant"
                      ? "border-brand-500 bg-brand-50/50 text-brand-500 ring-2 ring-brand-100"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <UserCheck className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Tenant</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Searching for homes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("landlord")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all cursor-pointer ${
                    role === "landlord"
                      ? "border-brand-500 bg-brand-50/50 text-brand-500 ring-2 ring-brand-100"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Landlord</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Listing properties</span>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Kenyan Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678 or +254 7..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-400">Supports 07..., 01..., and +254 Kenyan formats.</p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-brand-500/10 cursor-pointer"
              >
                {loading ? "Creating Profile..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
