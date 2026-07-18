import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Якщо користувач авторизований і намагається зайти на /admin, пропускаємо
    // В іншому випадку NextAuth сам перенаправить на сторінку входу
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Дозволяємо доступ тільки якщо є токен (користувач авторизований)
        return !!token;
      },
    },
    pages: {
      signIn: "/admin", // перенаправляємо на сторінку /admin для входу
    },
  }
);

// Захищаємо тільки маршрути, що починаються з /admin
export const config = {
  matcher: ["/admin/:path*"],
};