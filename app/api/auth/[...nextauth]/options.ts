import { AuthOptions, User, Account, SessionStrategy, Session } from "next-auth";
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
        opd: string;
        opd_slug: string;
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
    opd: string;
    opd_slug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      name: string;
      email: string;
      role: string;
      opd: string;
      opd_slug: string;
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

              const toSlug = (s: unknown) =>
                String(s || "")
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
              const opdName = userData.opd ?? userData.name ?? "";
              const opdSlug = userData.opd_slug ?? toSlug(opdName);

              return {
                id: String(userData.email || userData.name || "user"),
                name: userData.name ?? "",
                email: userData.email ?? "",
                role: userData.role ?? "",
                accessToken: response.data.token,
                opd: String(opdName ?? ""),
                opd_slug: String(opdSlug ?? ""),
              };
            } else {
              throw new Error(response?.message || "Authentication failed");
            }
          } else {
            return null;
          }
        } catch {
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
        token.user = {
          name: u.name,
          email: u.email,
          role: u.role,
          opd: u.opd,
          opd_slug: u.opd_slug,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.success = true;
      session.message = "Login berhasil.";
      session.data = {
        user: {
          name: token.user?.name,
          email: token.user?.email,
          role: token.user?.role,
          opd: token.user?.opd,
          opd_slug: token.user?.opd_slug,
        },
        token: token.accessToken,
      };
      return session;
    },
    async signIn({ user }: { user: User | AdapterUser }) {
      return !!user;
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
