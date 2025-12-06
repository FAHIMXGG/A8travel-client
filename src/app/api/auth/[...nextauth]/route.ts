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
          subscriptionStatus: rawUser.subscriptionStatus ?? "NONE",
          subscriptionExpiresAt: rawUser.subscriptionExpiresAt ?? null,
          accessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.role = u.role;
        token.phone = u.phone;
        token.isApproved = u.isApproved;
        token.subscriptionStatus = u.subscriptionStatus ?? "NONE";
        token.subscriptionExpiresAt = u.subscriptionExpiresAt ?? null;
        token.accessToken = u.accessToken;
      }
      
      // Handle session update trigger (e.g., after subscription update)
      if (trigger === "update" && session) {
        const updated = session as any;
        
        // Update subscription-related fields
        if (updated.subscriptionStatus !== undefined) {
          token.subscriptionStatus = updated.subscriptionStatus;
        }
        if (updated.subscriptionExpiresAt !== undefined) {
          token.subscriptionExpiresAt = updated.subscriptionExpiresAt;
        }
        
        // Update other user fields if provided
        if (updated.name !== undefined) {
          token.name = updated.name;
        }
        if (updated.phone !== undefined) {
          token.phone = updated.phone;
        }
        if (updated.isApproved !== undefined) {
          token.isApproved = updated.isApproved;
        }
        
        // If nested user object is provided, use it
        if (updated.user) {
          const u = updated.user as any;
          if (u.subscriptionStatus !== undefined) token.subscriptionStatus = u.subscriptionStatus;
          if (u.subscriptionExpiresAt !== undefined) token.subscriptionExpiresAt = u.subscriptionExpiresAt;
          if (u.name !== undefined) token.name = u.name;
          if (u.phone !== undefined) token.phone = u.phone;
          if (u.isApproved !== undefined) token.isApproved = u.isApproved;
        }
        
        // If refreshFromBackend flag is set, fetch fresh data from backend
        if (updated.refreshFromBackend && token.accessToken) {
          try {
            const backendRes = await fetch(`${BACKEND_URL}/api/users/me`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.accessToken}`,
              },
            });
            
            if (backendRes.ok) {
              const backendData = await backendRes.json();
              
              // Handle different response formats: data.success.data, data.data, data, or just the user object
              const userData = 
                backendData?.data?.data ??
                backendData?.success?.data ??
                backendData?.data ??
                backendData?.success ??
                backendData;
              
              if (userData && typeof userData === 'object') {
                console.log("Refreshing JWT token with backend data:", {
                  subscriptionStatus: userData.subscriptionStatus,
                  subscriptionExpiresAt: userData.subscriptionExpiresAt,
                });
                
                if (userData.subscriptionStatus !== undefined) {
                  token.subscriptionStatus = userData.subscriptionStatus || "NONE";
                }
                if (userData.subscriptionExpiresAt !== undefined) {
                  token.subscriptionExpiresAt = userData.subscriptionExpiresAt || null;
                }
                if (userData.name) token.name = userData.name;
                if (userData.phone !== undefined) token.phone = userData.phone;
                if (userData.isApproved !== undefined) token.isApproved = userData.isApproved;
              }
            }
          } catch (err) {
            console.error("Failed to refresh user data from backend:", err);
          }
        }
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
        subscriptionStatus: token.subscriptionStatus as any,
        subscriptionExpiresAt: token.subscriptionExpiresAt as any,
      };

      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
