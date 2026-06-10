import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET || "f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Test Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@test.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Test Admin
          if (credentials.email === "admin@test.com" && credentials.password === "admin123") {
            console.log("Admin login match");
            let user = await prisma.user.findUnique({ where: { email: "admin@test.com" } });
            if (!user) {
              console.log("Creating test admin user");
              user = await prisma.user.create({ 
                data: { email: "admin@test.com", name: "Test Admin" } 
              });
            }
            return user;
          }

          // Test User
          if (credentials.email === "user@test.com" && credentials.password === "user123") {
            console.log("User login match");
            let user = await prisma.user.findUnique({ where: { email: "user@test.com" } });
            if (!user) {
              console.log("Creating test user");
              user = await prisma.user.create({ 
                data: { email: "user@test.com", name: "Test User" } 
              });
            }
            return user;
          }
        } catch (error) {
          console.error("Database error in authorize:", error);
          throw new Error("Database connection failed");
        }

        console.log("No match found for:", credentials.email);
        return null;
      }
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
};
