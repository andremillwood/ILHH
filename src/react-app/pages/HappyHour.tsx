import { useEffect, useState, useRef } from "react";
import { useAuth, useAuthHeader } from "@/lib/AuthContext";
import { Clock, Gift, CheckCircle } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import QRCode from "qrcode";

interface Coupon {
  id: number;
  coupon_code: string;
  valid_from: string;
  valid_until: string;
  is_redeemed: number;
}

export default function HappyHour() {
  const { user, loading: isPending, signInWithGoogle } = useAuth();
  const authHeader = useAuthHeader();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isPending && user && authHeader) {
      fetch("/api/happy-hour", {
        headers: { Authorization: authHeader }
      })
        .then((res) => res.json())
        .then((data) => {
          setCoupon(data.coupon);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else if (!isPending) {
      setLoading(false);
    }
  }, [user, isPending, authHeader]);

  useEffect(() => {
    if (coupon && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        coupon.coupon_code,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [coupon]);

  useEffect(() => {
    if (!coupon || coupon.is_redeemed) return;

    const interval = setInterval(() => {
      const now = new Date();
      const validUntil = new Date(coupon.valid_until);
      const diff = validUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [coupon]);

  const generateCoupon = async () => {
    if (!authHeader) return;
    try {
      const response = await fetch("/api/happy-hour", {
        method: "POST",
        headers: { Authorization: authHeader },
      });
      const data = await response.json();
      if (data.success) {
        setCoupon(data.coupon);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black graffiti-texture">
        <Navigation />

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Clock className="w-20 h-20 text-neon-red mx-auto mb-8" />
            <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text-simple">
              HAPPY HOUR
            </h1>
            <p className="text-2xl text-gray-300 mb-4 font-heading">
              8:00 PM - 10:30 PM Every Thursday
            </p>
            <p className="text-xl text-gray-400 mb-12 font-heading">
              2-4-1 Specials for ILHH Members
            </p>

            <div className="neon-border bg-black/80 backdrop-blur-md p-12 mb-8">
              <Gift className="w-16 h-16 text-neon-red mx-auto mb-6" />
              <h2 className="font-display text-4xl text-white mb-6">
                Member-Exclusive Access
              </h2>
              <p className="text-gray-400 font-heading mb-8">
                Sign in to generate your digital coupon for this week's Happy Hour
              </p>
              <button
                onClick={() => signInWithGoogle()}
                className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider"
              >
                Sign In
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-2 border-neon-red pl-4 text-left">
                <p className="text-neon-red font-heading mb-2">2-4-1 Drinks</p>
                <p className="text-gray-400 text-sm">Selected cocktails and spirits</p>
              </div>
              <div className="border-l-2 border-neon-red pl-4 text-left">
                <p className="text-neon-red font-heading mb-2">Early Vibes</p>
                <p className="text-gray-400 text-sm">Get there early, save big</p>
              </div>
              <div className="border-l-2 border-neon-red pl-4 text-left">
                <p className="text-neon-red font-heading mb-2">Digital QR</p>
                <p className="text-gray-400 text-sm">Show your code at the bar</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black graffiti-texture">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-7xl md:text-9xl mb-6 neon-text-simple">
              HAPPY HOUR
            </h1>
            <p className="text-2xl text-gray-300 font-heading">
              8:00 PM - 10:30 PM Every Thursday
            </p>
          </div>

          {!coupon ? (
            <div className="neon-border bg-black/80 backdrop-blur-md p-12 text-center neon-glow">
              <Gift className="w-20 h-20 text-neon-red mx-auto mb-6" />
              <h2 className="font-display text-4xl text-white mb-6">
                Generate Your Coupon
              </h2>
              <p className="text-gray-400 font-heading mb-8">
                Get your 2-4-1 drink special for this Thursday
              </p>
              <button
                onClick={generateCoupon}
                className="px-8 py-4 neon-border bg-neon-red text-black hover:bg-black hover:text-neon-red transition font-heading text-xl uppercase tracking-wider"
              >
                Generate Coupon
              </button>
            </div>
          ) : coupon.is_redeemed ? (
            <div className="neon-border bg-black/80 backdrop-blur-md p-12 text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="font-display text-4xl text-white mb-4">
                Coupon Redeemed
              </h2>
              <p className="text-gray-400 font-heading">
                This coupon has already been used. See you next Thursday!
              </p>
            </div>
          ) : (
            <div className="neon-border bg-black/80 backdrop-blur-md p-12 neon-glow">
              <div className="text-center mb-8">
                <h2 className="font-display text-4xl text-white mb-4">
                  Your Happy Hour Pass
                </h2>
                {timeLeft && timeLeft !== "Expired" && (
                  <div className="inline-block px-6 py-3 bg-neon-red/20 border border-neon-red mb-6">
                    <Clock className="w-5 h-5 inline mr-2 text-neon-red" />
                    <span className="font-heading text-neon-red text-lg">{timeLeft}</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 mx-auto max-w-sm mb-8 rounded-lg">
                <canvas ref={canvasRef} className="w-full h-auto" />
                <p className="text-black text-center font-mono text-sm mt-4 font-bold break-all">
                  {coupon.coupon_code}
                </p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-gray-400 font-heading">
                  Show this QR code to the bartender
                </p>
                <p className="text-gray-500 text-sm font-heading">
                  Valid: {new Date(coupon.valid_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(coupon.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-500 text-sm font-heading">
                  {new Date(coupon.valid_from).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
