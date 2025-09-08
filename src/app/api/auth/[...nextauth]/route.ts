// FIXED route.ts
import { handlers } from "@/lib/auth";

// destructure the HTTP methods from handlers
export const { GET, POST } = handlers;

// ensure Node runtime for bcrypt compatibility
export const runtime = "nodejs";
