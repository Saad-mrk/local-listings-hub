import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const Index = lazy(() => import("@/pages/Index"));
const AdDetails = lazy(() => import("@/pages/AdDetails"));
const Login = lazy(() => import("@/pages/Login"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));
const CreateAd = lazy(() => import("@/pages/CreateAd"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Messages = lazy(() => import("@/pages/Messages"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const Cart = lazy(() => import("@/pages/Cart"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ad/:id" element={<AdDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
