import { NextRequest, NextResponse } from "next/server";
import { hasUsableToken } from "@/lib/auth/authValidation";

function hasRequestToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    return hasUsableToken(token);
  }

  const cookieToken = request.cookies.get("token")?.value;
  return hasUsableToken(cookieToken);
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAccountRoute = path === "/account" || path.startsWith("/account/");
  const isAdminRoute = path === "/admin" || path.startsWith("/admin/");

  const isProtectedRoute = isAccountRoute || isAdminRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get("token")?.value;
  console.log(`[Middleware] ${path} — cookie token: ${cookieToken ? "present" : "MISSING"}`);

  if (!hasRequestToken(request)) {
    console.log(`[Middleware] no valid token, redirecting to /login?from=${path}`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  console.log("[Middleware] token valid, passing through");
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/:path*", "/admin", "/admin/:path*"],
};
