import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Дозволяємо доступ до /admin без токена (покажемо сторінку входу)
        if (req.nextUrl.pathname === "/admin") {
          return true;
        }
        // Для всіх інших /admin/* потрібен токен
        return !!token;
      },
    },
    pages: {
      signIn: "/admin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};