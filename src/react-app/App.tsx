import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/lib/AuthContext";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import EventsPage from "@/react-app/pages/Events";
import MembershipPage from "@/react-app/pages/Membership";
import RsvpPage from "@/react-app/pages/Rsvp";
import ArticlesPage from "@/react-app/pages/Articles";
import ArticleDetailPage from "@/react-app/pages/ArticleDetail";
import CommunityPage from "@/react-app/pages/Community";
import MixtapesPage from "@/react-app/pages/Mixtapes";
import GalleryPage from "@/react-app/pages/Gallery";
import HappyHourPage from "@/react-app/pages/HappyHour";
import AdminPage from "@/react-app/pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/rsvp/:eventId" element={<RsvpPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/mixtapes" element={<MixtapesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/happy-hour" element={<HappyHourPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
