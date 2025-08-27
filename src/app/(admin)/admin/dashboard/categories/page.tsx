import { Suspense } from "react";

import { CategoriesHeader } from "./_components/categories-header";
import { CategoriesList } from "./_components/categories-list";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <CategoriesHeader />

      <Suspense fallback={<div>Carregando categorias...</div>}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
