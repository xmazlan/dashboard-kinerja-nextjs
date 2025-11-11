import { AuthOptions, User, Account, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";

// Extend the Session and User types to include our custom properties
declare module "next-auth" {
  interface Session {
    success: boolean;
    message: string;
    data: {
      user: {
        id: string | number;
        uuid: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        masjid_id: string;
        masjid_name: string;
        city: string;
        avatar: string | null;
        avatar_url: string | null;
        role: string;
        active: string;
        profile: string;
        email_verified_at: string;
        created_at: string;
      };
      masjid_id: string;
      token: string;
      permissions: { id: number; name: string }[];
    };
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresInSecond: number;
    activity?: any;
    user?: {
      // Optional because we delete it
      id: string | number;
      uuid: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      masjid_id: string;
      masjid_name: string;
      city: string;
      avatar: string | null;
      avatar_url: string | null;
      role: string;
      active: string;
      profile: string;
      email_verified_at: string;
      created_at: string;
    };
  }

  interface User {
    id: string | number;
    uuid: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    masjid_id: string;
    masjid_name: string;
    city: string;
    avatar: string | null;
    avatar_url: string | null;
    role: string;
    active: string;
    profile: string;
    email_verified_at: string;
    created_at: string;
    accessToken: string;
    tokenType: string;
    permissions: { id: number; name: string }[];
    activity?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresInSecond: number;
    permissions: { id: number; name: string }[];
    activity?: any;
    user: {
      id: string | number;
      uuid: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      masjid_id: string;
      masjid_name: string;
      city: string;
      avatar: string | null;
      avatar_url: string | null;
      role: string;
      active: string;
      profile: string;
      email_verified_at: string;
      created_at: string;
    };
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60, // 1 hour
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Toggle dummy auth: enabled when NEXT_PUBLIC_DUMMY_AUTH=true or in non-production env
          const useDummyAuth =
            process.env.NEXT_PUBLIC_DUMMY_AUTH === "true" ||
            process.env.NODE_ENV !== "production";

          if (useDummyAuth) {
            const emailInput = String(credentials.email).trim().toLowerCase();
            const passwordInput = String(credentials.password);
            const demoEmail = (
              process.env.NEXT_PUBLIC_DUMMY_EMAIL || "demo@kominfo.go.id"
            ).toLowerCase();
            const demoPassword =
              process.env.NEXT_PUBLIC_DUMMY_PASSWORD || "demo123";

            if (emailInput !== demoEmail || passwordInput !== demoPassword) {
              throw new Error("Email atau password demo salah");
            }

            // Return a fully-typed dummy user matching our Session/User interfaces
            return {
              id: 1,
              uuid: "00000000-0000-0000-0000-demo",
              name: "Demo Admin",
              email: demoEmail,
              phone: "081234567890",
              address: "Jl. Demo No. 1",
              masjid_id: "MSJ-DEMO-001",
              masjid_name: "Masjid Demo",
              city: "Jakarta",
              avatar: null,
              avatar_url: null,
              role: "admin",
              active: "1",
              profile: "Demo profile",
              email_verified_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              accessToken: "dummy-access-token",
              tokenType: "Bearer",
              permissions: [
                { id: 1, name: "dashboard:view" },
                { id: 2, name: "users:manage" },
              ],
              activity: null,
            };
          }

          const signinUrl = process.env.NEXT_PUBLIC_API_URL + "/api/auth/login";

          const res = await axios.post(
            signinUrl,
            {
              email: credentials.email.trim(),
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000, // 10 detik
            }
          );

          if (res.headers["content-type"]?.includes("application/json")) {
            const response = res.data;

            if (response.message === "Login successful" && response.data) {
              const userData = response.data?.user;
              if (!userData) {
                throw new Error("Invalid login payload: missing data.user");
              }
              const permissions = Array.isArray(response.data.permissions)
                ? response.data.permissions
                : [];
              const activity = response.activity ?? null;

              return {
                id: userData.id,
                uuid: userData.uuid,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                masjid_id: userData.masjid_id,
                masjid_name: userData.masjid_name,
                city: userData.city,
                avatar: userData.avatar,
                avatar_url: userData.avatar_url,
                role: userData.role,
                active: userData.active,
                profile: userData.profile,
                email_verified_at: userData.email_verified_at,
                created_at: userData.created_at,
                accessToken: response.access_token,
                tokenType: response.token_type,
                permissions,
                activity,
              };
            } else {
              throw new Error(response.message || "Authentication failed");
            }
          } else {
            throw new Error("Received invalid response from server");
          }
        } catch (error: any) {
          if (error.response?.data) {
            // Handle Axios error response
            const { message, errors } = error.response.data;
            if (errors && Array.isArray(errors)) {
              throw new Error(`[${errors.join(", ")}]`);
            }
            throw new Error(message || "Authentication failed");
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      account: Account | null;
      user?: User | AdapterUser;
      trigger?: "update" | string;
      session?: any;
    }) {
      // Initial sign in
      if (user) {
        const typedUser = user as User;
        token.accessToken = typedUser.accessToken;
        token.tokenType = typedUser.tokenType;
        token.permissions = typedUser.permissions ?? [];
        token.activity = typedUser.activity ?? null;
        // Store all user data in the token
        token.user = {
          id: typedUser.id,
          uuid: typedUser.uuid,
          name: typedUser.name,
          email: typedUser.email,
          phone: typedUser.phone,
          address: typedUser.address,
          masjid_id: typedUser.masjid_id,
          masjid_name: typedUser.masjid_name,
          city: typedUser.city,
          avatar: typedUser.avatar,
          avatar_url: typedUser.avatar_url,
          role: typedUser.role,
          active: typedUser.active,
          profile: typedUser.profile,
          email_verified_at: typedUser.email_verified_at,
          created_at: typedUser.created_at,
        };
      }

      if (trigger === "update" && session?.user) {
        token.user = session.user;
        if (session.permissions) {
          token.permissions = session.permissions;
        }
        if (session.activity) {
          token.activity = session.activity;
        }
      }

      return token;
    },
    async session({
      session,
      token,
      trigger,
      newSession,
    }: {
      session: any;
      token: any;
      trigger?: "update" | string;
      newSession?: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.success = true;
      session.message = "Login berhasil";
      session.data = {
        user: token.user,
        masjid_id: token.user.masjid_id,
        permissions: token.permissions ?? [],
      };
      session.tokenType = token.tokenType;
      session.accessToken = token.accessToken;
      session.activity = token.activity ?? null;

      // Pertahankan session.user untuk kompatibilitas komponen yang mengaksesnya langsung
      session.user = token.user as any;

      return session;
    },
    async signIn({
      user,
      account,
      profile,
      email,
      credentials,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: any;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, any>;
    }) {
      if (user) return true;
      else return false;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // CUSTOM
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl; // Fallback to baseUrl to prevent loops
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
    signOut: "/logout",
    error: "/error",
  },
};
