
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserSignup from "./pages/UserSignup";
import TrainerSignup from "./pages/dashboards/trainer/TrainerSignup";
import PendingTrainerDashboard from "./pages/dashboards/pending-trainer/PendingTrainerDashboard";
import TrainerDashboard from "./pages/dashboards/trainer/TrainerDashboard";
import UserDashboard from "./pages/dashboards/user/UserDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/dashboards/trainer/signup" element={<TrainerSignup />} />
            <Route path="/dashboards/pending-trainer" element={<PendingTrainerDashboard />} />
            <Route path="/dashboards/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboards/user" element={<UserDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
