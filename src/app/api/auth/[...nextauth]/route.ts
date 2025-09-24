import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = "http://xyzstay-nginx/api";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
          console.error("Login error:", err.response?.data || err.message);
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
    },
    async session({ session, token }) {
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
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
