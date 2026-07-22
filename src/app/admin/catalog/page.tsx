'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

type Product = {
  id: string;
  categoryId: string;
  // інші поля не потрібні
};

export default function AdminCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      setCategories(data.categories || []);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Помилка завантаження категорій:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю категорію разом з усіма товарами?')) return;
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const newCategories = data.categories.filter((c: any) => c.id !== id);
      const newProducts = data.products.filter((p: any) => p.categoryId !== id);
      
      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories, products: newProducts }),
      });
      
      setCategories(newCategories);
      setProducts(newProducts);
      router.refresh();
    } catch (err) {
      alert('Помилка видалення категорії');
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;

  // Підрахунок кількості товарів у кожній категорії
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Категорії каталогу</h1>
        <Link
          href="/admin/catalog/new"
          className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
        >
          + Додати категорію
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400">Категорій поки немає. Створіть першу!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = getProductCount(cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 bg-gray-100">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📁</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#1a3c34]">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Слаг: {cat.slug}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link
                      href={`/admin/catalog/${cat.id}`}
                      className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      Товари ({count})
                    </Link>
                    <Link
                      href={`/admin/catalog/${cat.id}/edit`}
                      className="px-4 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="px-4 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Видалити
                    </button>
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="px-4 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    >
                      Переглянути
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}