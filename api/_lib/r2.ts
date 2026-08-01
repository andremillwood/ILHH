import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const MAX_BYTES = {
    mix: 750 * 1024 * 1024,
    artwork: 15 * 1024 * 1024,
    gallery: 30 * 1024 * 1024,
} as const;

const allowedTypes = {
    mix: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/mp4', 'audio/x-m4a'],
    artwork: ['image/jpeg', 'image/png', 'image/webp'],
    gallery: ['image/jpeg', 'image/png', 'image/webp'],
};

export type R2Purpose = keyof typeof MAX_BYTES;

function safeFilename(filename: string) {
    const dot = filename.lastIndexOf('.');
    const extension = dot >= 0 ? filename.slice(dot).toLowerCase().replace(/[^.a-z0-9]/g, '') : '';
    const base = (dot >= 0 ? filename.slice(0, dot) : filename)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'upload';
    return `${base}${extension}`;
}

export async function createR2Upload(input: {
    filename: string;
    contentType: string;
    size: number;
    purpose: R2Purpose;
    userId: string;
    galleryId?: number;
}) {
    if (!allowedTypes[input.purpose].includes(input.contentType)) throw new Error(`Unsupported ${input.purpose} file type`);
    if (input.size > MAX_BYTES[input.purpose]) throw new Error(`File exceeds the ${Math.round(MAX_BYTES[input.purpose] / 1024 / 1024)} MB limit`);
    if (input.purpose === 'gallery' && !input.galleryId) throw new Error('Gallery id required');

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET_NAME;
    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) throw new Error('R2 storage is not configured');

    const folder = input.purpose === 'gallery' ? `galleries/${input.galleryId}` : `mixtapes/${input.userId}/${input.purpose}`;
    const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeFilename(input.filename)}`;
    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: input.contentType, ContentLength: input.size });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 15 * 60 });
    return { uploadUrl, publicUrl: `${publicBaseUrl}/${key}`, key };
}
