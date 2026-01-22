import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Logout from "./components/Logout";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientLeads from "./pages/client/ClientLeads";
import ClientZones from "./pages/client/ClientZones";
import ClientSettings from "./pages/client/ClientSettings";
import ClientProfile from "./pages/client/ClientProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/dashbord";

// Auth
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />

            {/* PORTAIL ADMIN - Protégé (Role: admin) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* PORTAIL CLIENT - Protégé (Role: client) */}
            <Route path="/client">
              <Route index element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="leads" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientLeads />
                </ProtectedRoute>
              } />
              <Route path="zones" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientZones />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientSettings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientProfile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;