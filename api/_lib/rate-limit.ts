import type { VercelRequest } from '@vercel/node';
import type { SupabaseClient } from '@supabase/supabase-js';

type RateLimitOptions = {
    bucket: string;
    limit: number;
    windowSeconds: number;
};

function getClientIp(req: VercelRequest) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0]?.trim() || 'unknown';
    if (Array.isArray(forwardedFor)) return forwardedFor[0] || 'unknown';
    return req.socket.remoteAddress || 'unknown';
}

function getWindowStart(windowSeconds: number) {
    const now = Date.now();
    return new Date(Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000).toISOString();
}

export async function enforceRateLimit(
    req: VercelRequest,
    supabase: SupabaseClient,
    { bucket, limit, windowSeconds }: RateLimitOptions,
) {
    const key = getClientIp(req);
    const windowStart = getWindowStart(windowSeconds);

    const { data: existing, error: readError } = await supabase
        .from('rate_limit_events')
        .select('id, count')
        .eq('bucket', bucket)
        .eq('key', key)
        .eq('window_start', windowStart)
        .maybeSingle();

    if (readError) {
        console.error('Rate limit read failed:', readError);
        return { allowed: true, remaining: limit };
    }

    if (existing) {
        const nextCount = (existing.count || 0) + 1;
        await supabase
            .from('rate_limit_events')
            .update({ count: nextCount, updated_at: new Date().toISOString() })
            .eq('id', existing.id);

        return { allowed: nextCount <= limit, remaining: Math.max(0, limit - nextCount) };
    }

    await supabase
        .from('rate_limit_events')
        .insert({ bucket, key, count: 1, window_start: windowStart });

    return { allowed: true, remaining: limit - 1 };
}
