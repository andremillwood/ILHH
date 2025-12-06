import { useState, useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AvatarUploadProps {
    currentAvatarUrl?: string | null;
    userId: string;
    onUploadComplete: (url: string) => void;
}

export default function AvatarUpload({ currentAvatarUrl, userId, onUploadComplete }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            onUploadComplete(publicUrl);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
            setPreview(currentAvatarUrl || null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className="relative w-32 h-32 rounded-full overflow-hidden neon-border cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-600" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
                    ) : (
                        <Camera className="w-8 h-8 text-neon-red" />
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <p className="text-gray-400 text-sm mt-3 font-heading">
                {uploading ? 'Uploading...' : 'Click to upload avatar'}
            </p>
        </div>
    );
}
