import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { isKeystaticAdminEnabled } from "./lib/keystatic-env";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The CMS lives outside locale routing, and is hidden when it can't be used safely.
  if (pathname.startsWith("/keystatic") || pathname.startsWith("/api/keystatic")) {
    return isKeystaticAdminEnabled
      ? NextResponse.next()
      : new NextResponse("Not found", { status: 404 });
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  return handleI18nRouting(request);
}

export const config = {
  // Everything except Next internals and files with an extension.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
