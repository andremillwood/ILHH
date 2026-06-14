import type { SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

type AnalyticsInput = {
    eventName: string;
    email?: string | null;
    userId?: string | null;
    visitorId?: string | null;
    sessionId?: string | null;
    path?: string | null;
    referrer?: string | null;
    properties?: Record<string, unknown>;
};

export async function trackAnalyticsEvent(
    supabase: SupabaseClient,
    req: VercelRequest | null,
    input: AnalyticsInput,
) {
    try {
        const userAgent = req?.headers['user-agent'];
        const { error } = await supabase.from('analytics_events').insert({
            event_name: input.eventName,
            email: input.email || null,
            user_id: input.userId || null,
            visitor_id: input.visitorId || null,
            session_id: input.sessionId || null,
            path: input.path || null,
            referrer: input.referrer || null,
            user_agent: typeof userAgent === 'string' ? userAgent : null,
            properties: input.properties || {},
        });

        if (error) console.error('Analytics event failed:', error);
    } catch (error) {
        console.error('Analytics event failed:', error);
    }
}
