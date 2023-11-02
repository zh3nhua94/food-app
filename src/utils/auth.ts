import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";

// step 3
declare module "next-auth" {
	interface Session {
		user: User & {
			//from "next-auth"
			isAdmin: Boolean;
		};
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		isAdmin: Boolean;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	adapter: PrismaAdapter(prisma),
	// step 1
	session: {
		strategy: "jwt",
	},
	// step 2
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.isAdmin = token.isAdmin;
			}
			return session;
		},
		async jwt({ token }) {
			const userInDB = await prisma.user.findUnique({
				where: {
					email: token.email!,
				},
			});
			token.isAdmin = userInDB?.isAdmin!;
			return token;
		},
	},
};

export const getAuthSession = () => {
	return getServerSession(authOptions);
};
