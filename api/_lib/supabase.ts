import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for server-side use (with service role key)
export function createServerClient() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase server environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Create a Supabase client with user's JWT for RLS
export function createUserClient(authHeader?: string) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }

    const options: any = {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    };

    // If auth header provided, use it
    if (authHeader) {
        options.global = {
            headers: {
                Authorization: authHeader
            }
        };
    }

    return createClient(supabaseUrl, supabaseAnonKey, options);
}
