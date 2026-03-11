// frontend/src/app/products/[id]/page.tsx

import { getProduct } from "@/lib/productApi";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    const product = await getProduct(id);

    return (
        <main className="mx-auto max-w-6xl px-6 py-14">

            <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">

                {/* 左側圖片 */}
                <ProductGallery
                    name={product.name}
                    imageUrls={product.imageUrls}
                    fallbackImage={product.imageUrl}
                />

                {/* 右側商品資訊 */}
                <section className="flex flex-col gap-6 pt-2">

                    <div className="space-y-3">

                        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-semibold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                        </p>

                    </div>

                    <p className="text-sm text-gray-500">
                        {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                    </p>

                    {product.description && (
                        <p className="max-w-[42ch] leading-8 text-gray-600">
                            {product.description}
                        </p>
                    )}

                    <div className="pt-2">
                        <AddToCartButton productId={product.id} />
                    </div>

                </section>

            </div>

            {/* 商品描述 */}
            <section className="mt-20 border-t border-gray-200 pt-10">

                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Product Details
                </h2>

                <p className="max-w-3xl leading-8 text-gray-600">
                    {product.description || "No additional product details available."}
                </p>

            </section>

        </main>
    );
}