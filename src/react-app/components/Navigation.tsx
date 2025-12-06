import { Link, useLocation } from "react-router";
import { Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import SearchBar from "@/react-app/components/SearchBar";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `text-white hover:text-neon-red transition font-heading uppercase tracking-wider text-sm ${isActive(path) ? "text-neon-red" : ""
    }`;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-neon-red/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png"
              alt="I Luv Hip Hop"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/events" className={linkClass("/events")}>
              Events
            </Link>
            <Link to="/happy-hour" className={linkClass("/happy-hour")}>
              Happy Hour
            </Link>
            <Link to="/articles" className={linkClass("/articles")}>
              Articles
            </Link>
            <Link to="/mixtapes" className={linkClass("/mixtapes")}>
              Mixtapes
            </Link>
            <Link to="/gallery" className={linkClass("/gallery")}>
              Gallery
            </Link>
            <Link to="/community" className={linkClass("/community")}>
              Community
            </Link>
            <Link to="/membership" className={linkClass("/membership")}>
              Membership
            </Link>

            {/* Search */}
            <SearchBar />

            {loading ? (
              <div className="w-20 h-8 bg-gray-800 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-neon-red transition font-heading uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-6 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-neon-red/30">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/"
              className={`block ${linkClass("/")}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`block ${linkClass("/events")}`}
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/happy-hour"
              className={`block ${linkClass("/happy-hour")}`}
              onClick={() => setIsOpen(false)}
            >
              Happy Hour
            </Link>
            <Link
              to="/articles"
              className={`block ${linkClass("/articles")}`}
              onClick={() => setIsOpen(false)}
            >
              Articles
            </Link>
            <Link
              to="/mixtapes"
              className={`block ${linkClass("/mixtapes")}`}
              onClick={() => setIsOpen(false)}
            >
              Mixtapes
            </Link>
            <Link
              to="/gallery"
              className={`block ${linkClass("/gallery")}`}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/community"
              className={`block ${linkClass("/community")}`}
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link
              to="/membership"
              className={`block ${linkClass("/membership")}`}
              onClick={() => setIsOpen(false)}
            >
              Membership
            </Link>
            {loading ? (
              <div className="w-full h-8 bg-gray-800 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <div className="text-white text-sm py-2">{user.email}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-white hover:text-neon-red transition font-heading uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="w-full px-6 py-2 neon-border bg-black text-neon-red hover:bg-neon-red hover:text-black transition font-heading uppercase tracking-wider"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
