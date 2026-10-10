import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api";
import SortableProductList from "@/components/SortableProductList";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="ব্রেডক্রাম্ব" className="breadcrumbs text-sm text-base-content/70">
        <ul>
          <li>
            <Link href="/" className="hover:text-primary">
              হোম
            </Link>
          </li>
          <li className="font-semibold text-base-content">
            {currentCategory.icon} {currentCategory.nameBn}
          </li>
        </ul>
      </nav>

      {/* Header Banner */}
      <header className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-16 shrink-0 place-items-center rounded-2xl bg-base-200 text-3xl shadow-inner"
          >
            {currentCategory.icon}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
              {currentCategory.nameBn}
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
              {currentCategory.nameBn} ক্যাটাগরির আজকের বাজার দর ও মূল্য তালিকা
            </p>
          </div>
        </div>

        <Link href="/" className="btn btn-outline btn-sm">
          ← সব ক্যাটাগরি
        </Link>
      </header>

      {/* Products list with sorting */}
      <SortableProductList
        products={products}
        emptyMessage={`এই ক্যাটাগরিতে (${currentCategory.nameBn}) বর্তমানে কোনো পণ্য পাওয়া যায়নি।`}
      />
    </div>
  );
}
