import { Link } from "react-router";
import SocialCtas from "@/react-app/components/SocialCtas";

export default function Footer() {
  return (
    <footer className="border-t-8 border-neon-red bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img 
              src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png" 
              alt="I Luv Hip Hop, the signature event and merchandise brand of This Is Hip Hop Caribbean"
              className="h-16 w-auto mb-4"
            />
            <p className="max-w-sm font-heading text-2xl font-bold uppercase leading-tight text-white">
              Hip hop culture, Kingston street energy, every Thursday night.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/events" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Events Calendar
              </Link>
              <Link to="/directory" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Directory
              </Link>
              <Link to="/submit-event" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Submit Event
              </Link>
              <Link to="/membership" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Membership
              </Link>
              <Link to="/playlists" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Playlists
              </Link>
              <Link to="/home" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Home
              </Link>
              <Link to="/submit-article" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Submit Story
              </Link>
              <Link to="/happy-hour" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Happy Hour
              </Link>
              <Link to="/music" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Music
              </Link>
              <Link to="/gallery" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Gallery
              </Link>
              <Link to="/merch" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Merch
              </Link>
              <Link to="/community" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Community
              </Link>
              <Link to="/stories" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Stories
              </Link>
              <Link to="/support" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Support
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Visit Us</h3>
            <p className="text-gray-400 font-heading mb-2">
              Every Thursday • 8:00 PM onwards
            </p>
            <p className="text-gray-400 font-heading">
              Dulce Lounge<br />
              22 Barbican Road<br />
              Kingston, Jamaica
            </p>
            <div className="mt-6">
              <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Connect</h3>
              <SocialCtas compact />
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-neon-red/30">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm font-heading">
            <Link to="/terms" className="text-gray-500 hover:text-neon-red">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-neon-red">Privacy</Link>
            <Link to="/policy/refunds" className="text-gray-500 hover:text-neon-red">Refunds</Link>
            <Link to="/policy/shipping" className="text-gray-500 hover:text-neon-red">Shipping</Link>
            <Link to="/policy/event-submissions" className="text-gray-500 hover:text-neon-red">Event Terms</Link>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 This Is Hip Hop Caribbean. Kingston, Jamaica.
          </p>
        </div>
      </div>
    </footer>
  );
}
