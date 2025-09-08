export { auth as middleware } from "@/lib/auth";

// only guard routes inside /client-dashboard
export const config = {
  matcher: ["/client-dashboard/:path*"],
};
