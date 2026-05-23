import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActivityPing } from "@/components/ActivityPing";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppRouter } from "@/routes/AppRouter";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <UserProvider>
            <ActivityPing />
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRouter />
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
