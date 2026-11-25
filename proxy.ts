import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Arabic is the site's primary language: any address without a language prefix ("/", "/about"…) opens in Arabic,
 * whatever the browser's language or the last page visited. English is one click away in the header, and once on an
 * /en page every link stays in English.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isLocale(pathname.split("/")[1])) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, favicon, robots.txt…).
  matcher: ["/((?!_next|api|.*\..*).*)"],
};
