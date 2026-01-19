import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientLeads from "./pages/client/ClientLeads";
import ClientZones from "./pages/client/ClientZones";
import ClientSettings from "./pages/client/ClientSettings";
import ClientProfile from "./pages/client/ClientProfile";
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { AuthProvider } from './contexts/AuthContext';
import Logout from "./components/Logout"; 
import Dashbord from "./pages/admin/dashbord";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashbord /></ProtectedRoute>} />
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/leads" element={<ProtectedRoute><ClientLeads /></ProtectedRoute>}/>

            {/* Client Portal Routes */}
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="client/leads" element={<ClientLeads />} />
            <Route path="/client/zones" element={<ClientZones />} />
            <Route path="/client/settings" element={<ClientSettings />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
