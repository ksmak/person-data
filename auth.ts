import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmailAndPassword } from "@/app/lib/data";
import prisma from "@/client";
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
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
          return null;
        }

        return user;
      },
    }),
  ],
});
