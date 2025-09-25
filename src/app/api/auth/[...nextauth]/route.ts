import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BACKEND_URL) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not set. CredentialsProvider authorize may fail."
  );
}
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // defensive: if BACKEND_URL missing, return null and log
        if (!BACKEND_URL) {
          console.error("Missing BACKEND_URL in authorize()");
          return null;
        }

        try {
          const res = await axios.post(`${BACKEND_URL}/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const data = res.data?.data;

          if (data?.token) {
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              phone_number: data.phone_number,
              token: data.token,
            };
          }
          return null;
        } catch (err: any) {
          // log full err but don't rethrow to avoid 500 bubbling
          console.error(
            "Login error:",
            err.response?.data || err.message || err
          );
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // custom page sign in
  },
  session: {
    strategy: "jwt",
    maxAge: 86400, // 1 hari (dalam detik)
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        // login pertama kali
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.phone_number = user.phone_number;
          token.token = user.token;
        }

        // ketika update() dipanggil di client
        if (trigger === "update" && session?.user) {
          token.name = session.user.name;
          token.email = session.user.email;
          token.phone_number = session.user.phone_number;
        }

        return token;
      } catch (err: any) {
        console.error("NextAuth jwt callback error:", err?.stack || err);
        // return token (best-effort) instead of throwing to avoid 500
        return token;
      }
    },
    async session({ session, token }) {
      try {
        // Ambil data user dari token saja, jangan validasi ke backend
        if (token && token.id) {
          session.user = {
            id: token.id,
            name: token.name,
            email: token.email,
            phone_number: token.phone_number,
            token: token.token,
          };
        } else {
          session.user = undefined;
        }
        return session;
      } catch (err: any) {
        console.error("NextAuth session callback error:", err?.stack || err);
        // fallback: return session unchanged or minimal
        try {
          if (!session) return { user: undefined } as any;
          session.user = session.user ?? undefined;
        } catch {
          /* noop */
        }
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
