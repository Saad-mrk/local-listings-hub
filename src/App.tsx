import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { CartProvider } from "@/contexts/CartProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
const Index = lazy(() => import("./pages/Index.tsx"));
const AdDetails = lazy(() => import("./pages/AdDetails.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.tsx"));
const CreateAd = lazy(() => import("./pages/CreateAd.tsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));

const queryClient = new QueryClient();

const RoutesWrapper = () => {
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
        <Route path="/create" element={<CreateAd />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <NotificationProvider>
        <UserProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RoutesWrapper />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </UserProvider>
      </NotificationProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
