import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
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
import BuyZone from "./pages/client/BuyZone";
import NotificationsPage from "./pages/client/NotificationsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/dashbord";
import ZonesManagement from "./pages/admin/zones/zone.liste";
import ListUser from "./pages/admin/users/user";
import AdminLeads from "./pages/admin/leads/AdminLeads";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminUserLeads from "./pages/admin/leads/AdminUserLeads";
import AdminShowLead from "./pages/admin/leads/AdminShowLead";
import AdminContacts from "./pages/admin/AdminContacts";

// Auth
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';

//public
import AboutPage from "./pages/home/about";
import Tarifs from "./pages/home/tarifs ";
import Fonctionnalites from "./pages/home/fonctionnalites";
import Contact from "./pages/home/contact";
import VerifyEmail from "./pages/auth/VerifyEmail"
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// client
import ClientSearchZone from "./pages/client/ClientSearchZone";
import ShowLead from "./pages/client/ShowLead";
import ZoneSetting from "./pages/client/ZoneSetting";
import ClientInvoices from "./pages/client/ClientInvoices";
import ArchiveLeads from "./pages/client/ArchiveLeads";
import UnreachableLeads from "./pages/client/UnreachableLeads";
import FormCookies from "./pages/client/FormCookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Landing />} />
              {/* Ancienne home ImmoScout — gardée sur /old en cas de besoin */}
              <Route path="/old" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/fonctionnalites" element={<Fonctionnalites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* PORTAIL ADMIN - Regroupé pour plus de clarté */}
              <Route path="/admin">
                <Route index element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="leads" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLeads />
                  </ProtectedRoute>
                } />
                <Route path="zones" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ZonesManagement />
                  </ProtectedRoute>
                } />
                <Route path="statistics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminStatistics />
                  </ProtectedRoute>
                } />
                <Route path="contacts" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminContacts />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="leads/:id" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminShowLead />
                  </ProtectedRoute>
                } />
                <Route path="user/:userId/leads" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUserLeads />
                  </ProtectedRoute>
                } />
                <Route path="user" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ListUser />
                  </ProtectedRoute>
                } />
              </Route>


              {/* PORTAIL CLIENT */}
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
                <Route path="cookies" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <FormCookies />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientProfile />
                  </ProtectedRoute>
                } />
                <Route path="buy-zone" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <BuyZone />
                  </ProtectedRoute>
                } />
                {/* Typo corrigée : mapexplorer */}
                <Route path="mapexplorer" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientSearchZone />
                  </ProtectedRoute>
                } />
                <Route path="showLead/:id" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ShowLead />
                  </ProtectedRoute>
                } />
                <Route path="zone-setting/:zoneId" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ZoneSetting />
                  </ProtectedRoute>
                } />

                <Route path="notifications" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="invoices" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientInvoices />
                  </ProtectedRoute>
                } />

                <Route path="archive-leads" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ArchiveLeads />
                  </ProtectedRoute>
                } />

                <Route path="injoignable" element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <UnreachableLeads />
                  </ProtectedRoute>
                } />

              </Route>



              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;