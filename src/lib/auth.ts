import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        // ✅ Type narrowing
        if (
          !creds ||
          typeof creds.email !== "string" ||
          typeof creds.password !== "string"
        ) {
          return null;
        }

        const email = creds.email.trim().toLowerCase();
        const password = creds.password;

        const user = await prisma.user.findUnique({
          where: { email }, // now a guaranteed string
        });
        if (!user) return null;

        // dynamic import keeps bcrypt out of Edge bundles
        const { compare } = await import("bcryptjs");
        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  trustHost: true,
});
