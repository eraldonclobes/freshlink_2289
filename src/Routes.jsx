import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductManagement from './pages/product-management';
import VendorRegistration from './pages/vendor-registration';
import VendorLogin from './pages/vendor-login';
import VendorDashboard from './pages/vendor-dashboard';
import ConsumerHomeSearch from './pages/consumer-home-search';
import VendorProfileProducts from './pages/vendor-profile-products';
import VendorProfile from './pages/vendor-profile';
import Auth from './pages/auth';
import ClientProfile from './pages/client-profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ConsumerHomeSearch />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/consumer-home-search" element={<ConsumerHomeSearch />} />
        <Route path="/vendor-profile-products" element={<VendorProfileProducts />} />
        <Route path="/vendor-profile" element={<VendorProfile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/client-auth" element={<Auth />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
