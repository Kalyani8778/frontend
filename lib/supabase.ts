import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. " +
      "The Supabase client will not function correctly. " +
      "Please set these environment variables in your Railway service configuration."
  );
}

// createBrowserClient stores the session in cookies (not localStorage) so that
// the Next.js middleware can read it server-side for route protection.
// Fall back to placeholder values when env vars are missing so the module
// loads without crashing — auth calls will fail gracefully at runtime instead
// of taking down the entire app at startup.
export const supabase = createBrowserClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key"
);
