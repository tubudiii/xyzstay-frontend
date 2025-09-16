import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const data = res.data?.data; // ✅ ambil dari "data"

          if (data?.token) {
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              phone_number: data.phone_number,
              token: data.token, // ✅ ini token user
            };
          }
          return null;
        } catch (err: any) {
          console.error("Login error", err.response?.data || err.message);
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
      // Validasi user masih ada di database
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/user/${token.id}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );
        const userData = res.data?.data;
        if (!userData) {
          // User sudah dihapus, kosongkan session.user
          session.user = undefined;
          return session;
        }
        session.user = {
          ...session.user,
          id: token.id as number,
          name: token.name as string,
          email: token.email as string,
          phone_number: token.phone_number as string,
          token: token.token as string,
        };
        return session;
      } catch (err) {
        // Jika error (misal user tidak ditemukan), kosongkan session.user
        session.user = undefined;
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
