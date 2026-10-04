import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { updateSession } from "@/lib/supabase/middleware";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isLoginRoute = createRouteMatcher(["/auth/login(.*)"]);

const clerkHandler = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Clerk session present
  if (userId) {
    if (isLoginRoute(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // No Clerk user — allow Supabase auth to protect /admin when Clerk UI is down
  if (isAdminRoute(request) || isLoginRoute(request)) {
    return updateSession(request);
  }

  return NextResponse.next();
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return updateSession(request);
  }

  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
