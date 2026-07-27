import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { authAPI } from "./api";
import { User } from "./types";

// Component Imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page Imports
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";

// Protected Route Wrapper Component
interface ProtectedRouteProps {
  user: User | null;
  allowedRole?: "tenant" | "landlord";
  children: React.ReactElement;
}

const ProtectedRoute = ({ user, allowedRole, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If landlord tries to view tenant pages or vice-versa, redirect appropriately
    return <Navigate to={user.role === "landlord" ? "/landlord" : "/tenant"} replace />;
  }

  return children;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Load existing credentials from LocalStorage and validate with backend
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      authAPI.getProfile()
        .then((validatedUser) => {
          setUser(validatedUser);
        })
        .catch(() => {
          // Token invalid, clear session
          authAPI.logout();
          setUser(null);
        })
        .finally(() => {
          setAppReady(true);
        });
    } else {
      setAppReady(true);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!appReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500 font-display">Initializing Rental Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* View Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<SearchPage />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />

            {/* Authentication portal routes */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to={user.role === "landlord" ? "/landlord" : "/tenant"} replace />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to={user.role === "landlord" ? "/landlord" : "/tenant"} replace />
                ) : (
                  <Register onRegisterSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* Tenant Protected Routes */}
            <Route
              path="/tenant"
              element={
                <ProtectedRoute user={user} allowedRole="tenant">
                  <TenantDashboard onUserUpdate={handleLoginSuccess} />
                </ProtectedRoute>
              }
            />

            {/* Landlord Protected Routes */}
            <Route
              path="/landlord"
              element={
                <ProtectedRoute user={user} allowedRole="landlord">
                  <LandlordDashboard onUserUpdate={handleLoginSuccess} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute user={user} allowedRole="landlord">
                  <AddProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute user={user} allowedRole="landlord">
                  <MyListings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Wildcard Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
