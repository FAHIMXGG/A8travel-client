import { DefaultSession } from "next-auth";

declare module "next-auth" {
  type AppRole = "ADMIN" | "USER"
  type SubscriptionStatus = "ACTIVE" | "TRIAL" | "EXPIRED" | "NONE"

  interface Session {
    user: {
      id?: string
      role?: AppRole
      phone?: string | null
      isApproved?: boolean
      subscriptionStatus?: SubscriptionStatus
      subscriptionExpiresAt?: string | null
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User {
    id?: string
    role?: AppRole
    phone?: string | null
    isApproved?: boolean
    subscriptionStatus?: SubscriptionStatus
    subscriptionExpiresAt?: string | null
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "ADMIN" | "USER"
    phone?: string | null
    isApproved?: boolean
    subscriptionStatus?: "ACTIVE" | "TRIAL" | "EXPIRED" | "NONE"
    subscriptionExpiresAt?: string | null
    accessToken?: string
    name?: string | null
    email?: string | null
  }
}

export {};
