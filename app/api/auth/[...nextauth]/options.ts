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
        name: string;
        email: string;
        role: string;
      };
      token: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      name: string;
      email: string;
      role: string;
    };
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60 * 24 * 7,
    // maxAge: 20,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
    // maxAge: 20,
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

          const base =
            process.env.AUTH_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
          const signinUrl = "/api/v1/auth/login";
          const reqTimeout = Number(process.env.AUTH_TIMEOUT_MS ?? 15000);

          const res = await axios.post(
            signinUrl,
            {
              email: credentials.email.trim(),
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
              baseURL: base,
              timeout: reqTimeout,
              validateStatus: (s) => s >= 200 && s < 300,
            }
          );

          if (res.headers["content-type"]?.includes("application/json")) {
            const response = res.data;

            if (response?.success === true && response?.data) {
              const userData = response.data?.user || {};
              const permissions = Array.isArray(response.data?.permissions)
                ? response.data.permissions
                : [];
              const activity = response.data?.activity ?? null;

              return {
                id: String(userData.email || userData.name || "user"),
                name: userData.name ?? "",
                email: userData.email ?? "",
                role: userData.role ?? "",
                accessToken: response.data.token,
              };
            } else {
              throw new Error(response?.message || "Authentication failed");
            }
          } else {
            return null;
          }
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        const u = user as User;
        token.accessToken = u.accessToken;
        token.user = { name: u.name, email: u.email, role: u.role };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.success = true;
      session.message = "Login berhasil.";
      session.data = {
        user: {
          name: token.user?.name,
          email: token.user?.email,
          role: token.user?.role,
        },
        token: token.accessToken,
      };
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
    signIn: "/",
    signOut: "/logout",
    error: "/error",
  },
};
