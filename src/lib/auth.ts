import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL = "http://xyzstay-nginx/api";
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        id: {
          type: "number",
        },
        email: {
          type: "text",
        },
        name: {
          type: "text",
        },
        token: {
          type: "text",
        },
        password: {
          type: "password",
        },
      },
      authorize: async (credentials, req) => {
        // Ambil data user terbaru dari backend
        try {
          const res = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data?.data && data?.data?.id) {
            return data.data;
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = +user.id;
        token.token = user.token;
        token.phone_number = user.phone_number;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as number;
        session.user.token = token.token as number;
        session.user.phone_number = token.phone_number;
      }
      return session;
    },
  },
};
