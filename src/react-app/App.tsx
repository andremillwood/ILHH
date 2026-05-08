import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/react-app/lib/CartContext";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import EventsPage from "@/react-app/pages/Events";
import EventDetailPage from "@/react-app/pages/EventDetail";
import MembershipPage from "@/react-app/pages/Membership";
import RsvpPage from "@/react-app/pages/Rsvp";
import ArticlesPage from "@/react-app/pages/Articles";
import ArticleDetailPage from "@/react-app/pages/ArticleDetail";
import CommunityPage from "@/react-app/pages/Community";
import MixtapesPage from "@/react-app/pages/Mixtapes";
import MixtapeDetailPage from "@/react-app/pages/MixtapeDetail";
import MixtapeUploadPage from "@/react-app/pages/MixtapeUpload";
import GalleryPage from "@/react-app/pages/Gallery";
import HappyHourPage from "@/react-app/pages/HappyHour";
import MerchPage from "@/react-app/pages/Merch";
import MerchCategoryPage from "@/react-app/pages/MerchCategory";
import MerchProductPage from "@/react-app/pages/MerchProduct";
import ProfilesPage from "@/react-app/pages/Profiles";
import ProfileDetailPage from "@/react-app/pages/ProfileDetail";
import SubmitEventPage from "@/react-app/pages/SubmitEvent";
import AdminPage from "@/react-app/pages/Admin";
import OrderStatusPage from "@/react-app/pages/OrderStatus";
import PolicyPage from "@/react-app/pages/Policy";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/rsvp/:eventId" element={<RsvpPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/mixtapes" element={<MixtapesPage />} />
            <Route path="/mixtapes/upload" element={<MixtapeUploadPage />} />
            <Route path="/mixtapes/:mixSlug" element={<MixtapeDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/happy-hour" element={<HappyHourPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/merch/category/:categoryId" element={<MerchCategoryPage />} />
            <Route path="/merch/product/:productId" element={<MerchProductPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/profiles/:profileSlug" element={<ProfileDetailPage />} />
            <Route path="/submit-event" element={<SubmitEventPage />} />
            <Route path="/order/:orderId" element={<OrderStatusPage />} />
            <Route path="/policy/:policySlug" element={<PolicyPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
