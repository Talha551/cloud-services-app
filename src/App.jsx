import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages
import HomePage from "./pages/public/HomePage";
import PricingPage from "./pages/public/PricingPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import PublicLoginPage from "./pages/public/PublicLoginPage";
import SignupPage from "./pages/public/SignupPage";

// Admin layout + pages
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ServersPage from "./pages/ServersPage";
import ServerDetailPage from "./pages/ServerDetailPage";
import CreateServerPage from "./pages/CreateServerPage";
import PlansPage from "./pages/PlansPage";
import OsImagesPage from "./pages/OsImagesPage";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import LocationsPage from "./pages/LocationsPage";
import BackupsPage from "./pages/BackupsPage";
import IpBlocksPage from "./pages/IpBlocksPage";
import ComputeResourcesPage from "./pages/ComputeResourcesPage";
import ClientsPage from "./pages/ClientsPage";
import InvoicesPage from "./pages/InvoicesPage";
import OrdersPage from "./pages/OrdersPage";
import DomainsPage from "./pages/DomainsPage";
import TicketsPage from "./pages/TicketsPage";

// Client portal layout + pages
import ClientLayout from "./components/Layout/ClientLayout";
import ClientDashboard from "./pages/ClientDashboard";
import StorePage from "./pages/StorePage";
import CheckoutPage from "./pages/CheckoutPage";
import ClientServicesPage from "./pages/ClientServicesPage";
import ClientServiceDetail from "./pages/ClientServiceDetail";
import ClientOrdersPage from "./pages/ClientOrdersPage";
import ClientInvoicesPage from "./pages/ClientInvoicesPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function isAdminUser(user) {
  if (!user) return false;
  if (user.role) return user.role === 'admin';
  if (Array.isArray(user.roles)) return user.roles.includes('admin');
  return false;
}

function getDefaultRoute(user) {
  return isAdminUser(user) ? '/admin' : '/client';
}

function PublicAuthRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <Navigate to={getDefaultRoute(user)} replace /> : children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdminUser(user) ? children : <Navigate to="/client" replace />;
}

function ClientRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdminUser(user) ? <Navigate to="/admin" replace /> : children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1e2130", color: "#e2e8f0", border: "1px solid #3a3f55" },
            }}
          />
          <Routes>
            {/* Public website */}
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/login" element={<PublicAuthRoute><PublicLoginPage /></PublicAuthRoute>} />
            <Route path="/register" element={<PublicAuthRoute><SignupPage /></PublicAuthRoute>} />

            {/* Client portal */}
            <Route path="/store" element={<ClientRoute><StorePage /></ClientRoute>} />
            <Route path="/checkout" element={<ClientRoute><CheckoutPage /></ClientRoute>} />
            <Route path="/client" element={<ClientRoute><ClientLayout /></ClientRoute>}>
              <Route index element={<ClientDashboard />} />
              <Route path="services" element={<ClientServicesPage />} />
              <Route path="services/:id" element={<ClientServiceDetail />} />
              <Route path="orders" element={<ClientOrdersPage />} />
              <Route path="invoices" element={<ClientInvoicesPage />} />
            </Route>

            {/* Admin panel */}
            <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="servers" element={<ServersPage />} />
              <Route path="servers/create" element={<CreateServerPage />} />
              <Route path="servers/:id" element={<ServerDetailPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="os-images" element={<OsImagesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="domains" element={<DomainsPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="backups" element={<BackupsPage />} />
              <Route path="ip-blocks" element={<IpBlocksPage />} />
              <Route path="compute-resources" element={<ComputeResourcesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
