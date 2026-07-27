import React from "react";
import { Link } from "react-router-dom";
import { Home, ShieldCheck, HelpCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 text-white">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-xs rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-500 font-display italic">
                Rental.
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Simplifying the rental journey for both tenants and landlords. Discover premium rental houses, modern apartments, and luxurious townhouses.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider font-display">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/properties" className="text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  Login to Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider font-display">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 mr-2 text-brand-500" /> Secure Leases
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <HelpCircle className="w-4 h-4 mr-2 text-brand-500" /> Help Center
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider font-display">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                100 Pine Street, San Francisco, CA
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                +1 (800) 555-RENT
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                support@rentalplatform.com
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pb-6">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Rental Platform Inc. All rights reserved. Equal Housing Opportunity.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Branding/Status Bar */}
      <div className="bg-[#5a5a40] text-[#f5f5f0] border-t border-[#4a4a30] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase">
          <div className="flex gap-6">
            <span>Available Units: 142</span>
            <span>Verified Listings: 100%</span>
            <span>Organic Materials: Yes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>API Connected: Express v4.18</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
