import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, User as UserIcon, Menu, X, Heart, PlusCircle, LogOut, MessageSquare, ShieldCheck, ListCollapse } from "lucide-react";
import { authAPI } from "../api";
import { User } from "../types";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    authAPI.logout();
    onLogout();
    navigate("/");
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs backdrop-blur-md bg-opacity-95">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white shadow-xs group-hover:bg-brand-600 transition-colors">
                <div className="w-4 h-4 border-2 border-white rounded-xs rotate-45"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-brand-500 font-display italic">
                Rental.
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              to="/properties"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/properties")
                  ? "bg-brand-50 text-brand-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Search Homes
            </Link>

            {user ? (
              <>
                {user.role === "landlord" ? (
                  <>
                    <Link
                      to="/landlord"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive("/landlord")
                          ? "bg-brand-50 text-brand-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Landlord Dashboard
                    </Link>
                    <Link
                      to="/my-listings"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive("/my-listings")
                          ? "bg-brand-50 text-brand-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/add-property"
                      className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-white transition-colors border border-transparent rounded-lg shadow-sm bg-brand-500 hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Property
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/tenant"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive("/tenant")
                          ? "bg-brand-50 text-brand-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      My Favorites & Messages
                    </Link>
                  </>
                )}

                {/* Shared authenticated user profile drop-down items */}
                <div className="flex items-center pl-4 ml-4 border-l border-gray-100 space-x-3">
                  <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {user.role === "landlord" ? (
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-500" />
                    ) : (
                      <UserIcon className="w-3 h-3 mr-1 text-blue-500" />
                    )}
                    {user.role}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900 leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    title="Sign Out"
                    className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center pl-4 ml-4 border-l border-gray-100 space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-hidden"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-gray-100 md:hidden bg-white animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/properties"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              Search Homes
            </Link>

            {user ? (
              <>
                {user.role === "landlord" ? (
                  <>
                    <Link
                      to="/landlord"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    >
                      Landlord Dashboard
                    </Link>
                    <Link
                      to="/my-listings"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/add-property"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-brand-500 rounded-md hover:bg-brand-50"
                    >
                      + Add New Property
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/tenant"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    >
                      My Favorites & Messages
                    </Link>
                  </>
                )}

                <div className="pt-4 pb-2 border-t border-gray-100 mt-2 pl-3">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize mb-2">{user.role}</p>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3 pb-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
