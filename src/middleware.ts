import { NextRequest } from "next/server";

interface RateLimitData {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for");

  if (!ip) {
    return new Response("Unable to determine IP address.", {
      status: 400,
    });
  }

  const limit = 3; // Limit requests to 5 per IP per window
  const windowMs = 60 * 1000; // 60 second window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 0, lastReset: Date.now() });
  }

  const ipData = rateLimitMap.get(ip)!;

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  ipData.count += 1;
}

export const config = {
  matcher: ["/api/mystical-eggs"],
};
