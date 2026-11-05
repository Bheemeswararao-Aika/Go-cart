'use client'
import { Suspense, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)
    const [filteredProducts, setFilteredProducts] = useState(products)

    // 1. Raw search string from query parameter is not passed through decodeURIComponent.
    //    Queries containing encoded spaces (%20) or symbols (e.g. 'Wireless%20Headphones')
    //    fail string matching against product names containing plain spaces ('Wireless Headphones').
    // 2. Asynchronous search debounce without AbortController or stale response cancellation:
    //    Rapid typing causes race conditions where a delayed response from a previous search
    //    overwrites the latest search results.
    useEffect(() => {
        let isStale = false;

        const timer = setTimeout(() => {
            if (isStale) return;

            if (search) {
                // Without decodeURIComponent, encoded search strings like "Smart%20Watch" fail match
                const matched = products.filter(product =>
                    product.name.toLowerCase().includes(search.toLowerCase())
                );
                setFilteredProducts(matched);
            } else {
                setFilteredProducts(products);
            }
        }, 150);

        return () => {
            // Intentionally missing isStale = true to cause async race condition when navigating rapidly
        };
    }, [search, products]);

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  All <span className="text-slate-700 font-medium">Products</span></h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
