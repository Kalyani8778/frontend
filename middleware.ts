import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/auth/callback",
  "/forgot-password",
  "/auth/reset-password",
];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session && !isPublic) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (session && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    // If the auth check fails (e.g. network error, Supabase unreachable),
    // redirect unauthenticated-looking requests to login rather than 500.
    if (!isPublic) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  // Only protect page routes. Exclude static assets and all /api/* routes
  // so existing Twilio/IVR API endpoints continue to work without auth headers.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
