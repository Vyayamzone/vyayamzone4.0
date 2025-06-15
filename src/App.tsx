
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import AdminDashboard from "./pages/dashboards/admin/AdminDashboard";

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
            <Route path="/UserSignup" element={<UserSignup />} />
            <Route path="/dashboards/trainer/signup" element={<TrainerSignup />} />
            <Route 
              path="/dashboards/pending-trainer" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <PendingTrainerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboards/trainer" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboards/user" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboards/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
