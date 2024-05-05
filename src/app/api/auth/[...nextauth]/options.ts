import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: { label: "Username or Email", type: "string" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        // Check if user is sending both identifier and password
        if (!credentials?.identifier && !credentials?.password) {
          throw new Error("Provide identifier and password to login");
        }

        // Connect to database
        await dbConnect();

        try {
          // Find user from database using identifier: (email or username)
          const user = await User.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          // Check if user exists
          if (!user) {
            throw new Error("User not found");
          }
          //   Check if user is verified
          if (!user.isVerified) {
            throw new Error("Verify your account to login");
          }

          //  Compare password from user and password stored in database
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          console.log(err);
          throw new Error(err);
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
