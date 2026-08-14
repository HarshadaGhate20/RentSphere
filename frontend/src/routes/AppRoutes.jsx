import React from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import MainLayout
  from "../layouts/MainLayout";

import DashboardLayout
  from "../layouts/DashboardLayout";

import ProtectedRoute
  from "./ProtectedRoute";

/* =========================================================
   PUBLIC PAGES
========================================================= */

import Home
  from "../pages/Home";

import About
  from "../pages/About";

import Contact
  from "../pages/Contact";

import ExploreProperties
  from "../pages/ExploreProperties";

import PropertyDetails
  from "../pages/PropertyDetails";

/* =========================================================
   AUTHENTICATION
========================================================= */

import Login
  from "../pages/Login";

import Register
  from "../pages/Register";

import ForgotPassword
  from "../pages/ForgotPassword";

/* =========================================================
   ADMIN
========================================================= */

import AdminDashboard
  from "../pages/AdminDashboard";

import AdminLocations
  from "../pages/admin/AdminLocations";

import AdminProperties
  from "../pages/admin/AdminProperties";

import AdminRentInquiries
  from "../pages/admin/AdminRentInquiries";

import AdminBookings
  from "../pages/admin/AdminBookings";

import AdminUsers
  from "../pages/admin/AdminUsers";

import AdminPayments
  from "../pages/admin/AdminPayments";

import AdminReports
  from "../pages/admin/AdminReports";

import AdminProfile
  from "../pages/admin/AdminProfile";

/* =========================================================
   LANDLORD
========================================================= */

import LandlordDashboard
  from "../pages/LandlordDashboard";

import AddProperty
  from "../pages/landlord/AddProperty";

import MyProperties
  from "../pages/landlord/MyProperties";

import EditProperty
  from "../pages/landlord/EditProperty";

import LandlordBookings
  from "../pages/landlord/LandlordBookings";

import LandlordPayments
  from "../pages/landlord/LandlordPayments";

import LandlordNegotiations
  from "../pages/landlord/LandlordNegotiations";

import LandlordProfile
  from "../pages/landlord/LandlordProfile";

/* =========================================================
   TENANT
========================================================= */

import TenantDashboard
  from "../pages/TenantDashboard";

import TenantWishlist
  from "../pages/tenant/TenantWishlist";

import TenantBookingRequest
  from "../pages/tenant/TenantBookingRequest";

import TenantNegotiateRent
  from "../pages/tenant/TenantNegotiateRent";

import TenantNegotiations
  from "../pages/tenant/TenantNegotiations";

import TenantBookings
  from "../pages/tenant/TenantBookings";

import TenantPayment
  from "../pages/tenant/TenantPayment";

import TenantPaymentSuccess
  from "../pages/tenant/TenantPaymentSuccess";

import TenantPaymentReceipt
  from "../pages/tenant/TenantPaymentReceipt";

import TenantLease
  from "../pages/tenant/TenantLease";

import TenantLeaseDocument
  from "../pages/tenant/TenantLeaseDocument";

import TenantProfile
  from "../pages/tenant/TenantProfile";

import Settings from "../pages/Settings";

/* =========================================================
   COMMON
========================================================= */

import Unauthorized
  from "../pages/Unauthorized";

import NotFound
  from "../pages/NotFound";

/* =========================================================
   ROUTES
========================================================= */

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}

      <Route
        element={
          <MainLayout />
        }
      >

        <Route
          path="/"
          element={
            <Home />
          }
        />

        <Route
          path="/about"
          element={
            <About />
          }
        />

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />

        <Route
          path="/properties"
          element={
            <ExploreProperties />
          }
        />

        <Route
          path="/property/:id"
          element={
            <PropertyDetails />
          }
        />

      </Route>

      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/register"
        element={
          <Register />
        }
      />

      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />

      {/* =====================================================
          ADMIN
      ===================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRole="ADMIN"
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <AdminDashboard />
          }
        />

        <Route
          path="locations"
          element={
            <AdminLocations />
          }
        />

        <Route
          path="properties"
          element={
            <AdminProperties />
          }
        />

        <Route
          path="inquiries"
          element={
            <AdminRentInquiries />
          }
        />

        <Route
          path="bookings"
          element={
            <AdminBookings />
          }
        />

        <Route
          path="users"
          element={
            <AdminUsers />
          }
        />

        <Route
          path="payments"
          element={
            <AdminPayments />
          }
        />

        <Route
          path="reports"
          element={
            <AdminReports />
          }
        />

        <Route
          path="profile"
          element={
            <AdminProfile />
          }
        />

        <Route path="settings" element={<Settings />} />

      </Route>

      {/* =====================================================
          LANDLORD
      ===================================================== */}

      <Route
        path="/landlord"
        element={
          <ProtectedRoute
            allowedRole="LANDLORD"
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <LandlordDashboard />
          }
        />

        {/* IMPORTANT:
            Add Property has NO :id
        */}
        <Route
          path="add-property"
          element={
            <AddProperty />
          }
        />

        <Route
          path="properties"
          element={
            <MyProperties />
          }
        />

        {/* IMPORTANT:
            Edit Property DOES use :id
        */}
        <Route
          path="properties/:id/edit"
          element={
            <EditProperty />
          }
        />

        <Route
          path="bookings"
          element={
            <LandlordBookings />
          }
        />

        <Route
          path="payments"
          element={
            <LandlordPayments />
          }
        />

        <Route
          path="negotiations"
          element={
            <LandlordNegotiations />
          }
        />

        <Route
          path="profile"
          element={
            <LandlordProfile />
          }
        />

        <Route path="settings" element={<Settings />} />

      </Route>

      {/* =====================================================
          TENANT
      ===================================================== */}

      <Route
        path="/tenant"
        element={
          <ProtectedRoute
            allowedRole="TENANT"
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <TenantDashboard />
          }
        />

        <Route
          path="wishlist"
          element={
            <TenantWishlist />
          }
        />

        <Route
          path="bookings/new/:propertyId"
          element={
            <TenantBookingRequest />
          }
        />

        <Route
          path="negotiate/:propertyId"
          element={
            <TenantNegotiateRent />
          }
        />

        <Route
          path="negotiations"
          element={
            <TenantNegotiations />
          }
        />

        <Route
          path="bookings"
          element={
            <TenantBookings />
          }
        />

        <Route
          path="payments/:bookingId"
          element={
            <TenantPayment />
          }
        />

        <Route
          path="payment-success/:bookingId"
          element={
            <TenantPaymentSuccess />
          }
        />

        <Route
          path="payment-receipt/:bookingId"
          element={
            <TenantPaymentReceipt />
          }
        />

        <Route
          path="lease"
          element={
            <TenantLease />
          }
        />

        <Route
          path="lease-document/:bookingId"
          element={
            <TenantLeaseDocument />
          }
        />

        <Route
          path="profile"
          element={
            <TenantProfile />
          }
        />

        <Route path="settings" element={<Settings />} />

      </Route>

      {/* =====================================================
          COMMON
      ===================================================== */}

      <Route
        path="/unauthorized"
        element={
          <Unauthorized />
        }
      />

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
};

export default AppRoutes;
