import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Якщо користувач не авторизований і намагається зайти на /admin або /admin/*
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute && !token) {
      // Перенаправляємо на сторінку входу (/admin), але з параметром callbackUrl
      const signInUrl = new URL("/admin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Дозволяємо доступ до /admin якщо є токен
    return NextResponse.next();
  },
  {
    callbacks: {
      // Дозволяємо доступ до /admin тільки для адміна (перевірка email)
      authorized: ({ token }) => {
        // Якщо токен є і email співпадає з ADMIN_EMAIL
        return token?.email === process.env.ADMIN_EMAIL;
      },
    },
    pages: {
      signIn: "/admin", // сторінка входу
    },
  }
);

// Налаштовуємо, на які маршрути діє middleware
export const config = {
  matcher: [
    "/admin/:path*", // всі шляхи, що починаються з /admin
    // виключаємо API-роути, щоб не блокувати OAuth
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};