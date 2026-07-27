import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { LogIn, Mail, Lock, AlertCircle, Home } from "lucide-react";
import { User } from "../types";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setResetSuccess("");
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const data = await authAPI.login({ email: trimmedEmail, password });
      onLoginSuccess(data.user);
      
      // Smart redirect based on user role
      if (data.user.role === "landlord") {
        navigate("/landlord");
      } else {
        navigate("/properties");
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      setError(err.response?.data?.error || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please fill in your email address first to reset your password.");
      setResetSuccess("");
      return;
    }
    setError("");
    setResetSuccess("");
    setResetting(true);
    try {
      await authAPI.resetPassword({ email: email.trim(), newPassword: "password123" });
      setResetSuccess("Your password was successfully reset to 'password123'. We have filled it in for you!");
      setPassword("password123");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please verify the email.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-100">
            <Home className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">Sign In to Your Account</h2>
        <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 rounded-3xl sm:px-10 shadow-xs">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1"></div>
                <span>{resetSuccess}</span>
              </div>
            )}

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

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="text-xs text-brand-500 hover:text-brand-600 font-semibold focus:outline-hidden cursor-pointer"
                >
                  {resetting ? "Resetting..." : "Forgot / Reset password?"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Seed accounts notice (Extremely helpful for previewing!) */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Test accounts for review</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="font-bold text-gray-800">Landlord Role</p>
                <p className="truncate">sarah@rentalplatform.com</p>
                <p>pw: password123</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="font-bold text-gray-800">Tenant Role</p>
                <p className="truncate">john@rentalplatform.com</p>
                <p>pw: password123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New to Rental Platform?{" "}
              <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
