import { Share2, Twitter, Facebook, Link2, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
}

export default function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

    const shareConfigs = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: keyof typeof shareConfigs) => {
        window.open(shareConfigs[platform], '_blank', 'width=600,height=400');
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-gray-400 font-heading text-sm mr-2">
                <Share2 className="w-4 h-4 inline mr-1" />
                Share
            </span>

            <button
                onClick={() => handleShare('twitter')}
                className="p-2 neon-border bg-black text-white hover:bg-neon-red hover:text-black transition"
                title="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </button>

            <button
                onClick={() => handleShare('facebook')}
                className="p-2 neon-border bg-black text-white hover:bg-neon-red hover:text-black transition"
                title="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </button>

            <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 neon-border bg-black text-white hover:bg-neon-red hover:text-black transition"
                title="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4" />
            </button>

            <button
                onClick={copyToClipboard}
                className={`p-2 neon-border bg-black transition ${copied ? 'text-green-500 border-green-500' : 'text-white hover:bg-neon-red hover:text-black'}`}
                title={copied ? 'Copied!' : 'Copy link'}
            >
                <Link2 className="w-4 h-4" />
            </button>
        </div>
    );
}
