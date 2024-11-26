import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmailAndPassword } from "@/app/lib/data";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (!!auth?.user) {
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        if (isOnDashboard) {
          return true;
        } else {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      return false;
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email) {
          return null;
        }

        let user = null;

        user = await fetchUserByEmailAndPassword(email, password);

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
});
