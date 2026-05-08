import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-neon-red/30 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img 
              src="https://mocha-cdn.com/019a95be-5809-78f9-888f-432287444de7/ilhh_logo1.png" 
              alt="I Luv Hip Hop" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 font-heading">
              The Original Thursday Night Hip Hop Experience
            </p>
          </div>
          <div>
            <h3 className="font-heading text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/events" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Events Calendar
              </Link>
              <Link to="/profiles" className="block text-gray-400 hover:text-neon-red transition font-heading">
                DJ & Promoter Profiles
              </Link>
              <Link to="/submit-event" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Submit Event
              </Link>
              <Link to="/membership" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Membership
              </Link>
              <Link to="/happy-hour" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Happy Hour
              </Link>
              <Link to="/mixtapes" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Mixtapes
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
              <Link to="/articles" className="block text-gray-400 hover:text-neon-red transition font-heading">
                Articles
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
          </div>
        </div>
        <div className="text-center pt-8 border-t border-neon-red/30">
          <p className="text-sm text-gray-500">
            © 2025 I Luv Hip Hop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
