import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { saltAndHashPassword } from "./app/lib/utils";
import { signInSchema } from "./app/lib/definitions";
import { getUserFromDb } from "./app/lib/data";
import { ZodError } from "zod";
import prisma from "./app/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const pwHash = saltAndHashPassword(password);

          user = await getUserFromDb(email, pwHash);

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
        }
      },
      pages: {
        signIn: "/login",
      },
    }),
  ],
});
