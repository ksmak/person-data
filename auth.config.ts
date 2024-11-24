import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { fetchUserByEmailAndPassword, fetchUserWithSubs } from '@/app/lib/data';
import { Subscription } from '@prisma/client';

// declare module "next-auth" {
//     interface Session {
//         user: {
//             subs: Subscription | {}
//         } & DefaultSession["user"]
//     }
// }

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            if (!!auth?.user) {
                const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
                if (isOnDashboard) {
                    return true;
                } else {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }

            return false;
        },
        // async session({ session, token, user }) {
        //     const baseUser = await fetchUserWithSubs(session.user.id);
        //     return {
        //         ...session,
        //         user: {
        //             ...session.user,
        //             subs: baseUser?.subs
        //         },
        //     }
        // },
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
} satisfies NextAuthConfig;