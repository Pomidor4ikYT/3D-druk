import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Дозволяємо вхід тільки адміну
      return user.email === process.env.ADMIN_EMAIL;
    },
    async session({ session }) {
      if (session.user) {
        session.user.email = session.user.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
  },
  // Додаємо явні налаштування кук для безпеки
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NEXTAUTH_URL?.startsWith("https://") || false,
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };