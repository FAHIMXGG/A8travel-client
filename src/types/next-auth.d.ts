import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "user" | "ADMIN";
      phone?: string | null;
      isApproved?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id?: string;
    role?: "user" | "ADMIN";
    phone?: string | null;
    isApproved?: boolean;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "ADMIN";
    phone?: string | null;
    isApproved?: boolean;
    accessToken?: string;
    name?: string | null;
    email?: string | null;
  }
}

export {};
