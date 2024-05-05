import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get token using the `next-auth/jwt` package.
  const token = await getToken({ req: request });

  const nextUrl = request.nextUrl;

  if (
    token &&
    (nextUrl.pathname.startsWith("/sign-in") ||
      nextUrl.pathname.startsWith("/sign-up") ||
      nextUrl.pathname.startsWith("/verify") ||
      nextUrl.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard"],
};
