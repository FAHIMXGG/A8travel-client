import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

function extractAccessTokenFromSetCookie(setCookieHeader?: string | null) {
  if (!setCookieHeader) return undefined;
  const all = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const h of all) {
    const m = /(?:^|,\s*)accessToken=([^;]+)/i.exec(h);
    if (m?.[1]) return decodeURIComponent(m[1]);
  }
  return undefined;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  // OPTIONAL: tell NextAuth that your login UI is /login (your component)
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 🔴 this hits your backend on port 5000
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          console.error("Login failed:", res.status, res.statusText);
          return null;
        }

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        // unwrap different shapes: data.data.data → data.data → data
        const rawUser =
          data?.data?.data ??
          data?.data ??
          data;

        if (!rawUser?.id || !rawUser?.email) {
          console.error("No valid user in login response");
          return null;
        }

        const accessToken =
          extractAccessTokenFromSetCookie(res.headers.get("set-cookie")) ||
          rawUser.token ||
          data?.data?.token ||
          data?.token;

        return {
          id: rawUser.id,
          name: rawUser.name,
          email: rawUser.email,
          role: rawUser.role ?? "USER",
          phone: rawUser.phone ?? null,
          isApproved: rawUser.isApproved ?? true,
          accessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.role = u.role;
        token.phone = u.phone;
        token.isApproved = u.isApproved;
        token.accessToken = u.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: (token.name as string) ?? session.user?.name ?? "",
        email: (token.email as string) ?? session.user?.email ?? "",
        role: token.role as any,
        phone: token.phone as any,
        isApproved: token.isApproved as any,
      };

      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
