import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Якщо немає сесії, перенаправляємо на /admin (сторінка входу)
  if (!session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}