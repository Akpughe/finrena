import Image from "next/image";
import localFont from "next/font/local";
import { useCategoriesQuery } from "@/hooks/use-categories";
import {
  useProductsQuery,
  useProductsByCategoryQuery,
  useProductDetailsQuery,
} from "@/hooks/use-products";
import { useFeaturesByCategoryQuery } from "@/hooks/use-features";
import useSupabaseClient from "@/hooks/useSupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryPill from "@/components/CategoryPill";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const client = useSupabaseClient();

  const [categoryId, setCategoryId] = useState<number>(1);
  const [productId, setProductId] = useState(1);

  function replaceSpacesWithHyphens(path: string) {
    return path.includes(" ") ? path.replace(/\s+/g, "-") : path;
  }

  const { data: categories, isLoading: isLoadingCategories } =
    useCategoriesQuery(client);

  const productData = useProductsQuery(client);

  const {
    data: productsByCategory,
    isLoading,
    error,
  } = useProductsByCategoryQuery(client, categoryId ?? 0);

  const { data: productDetails } = useProductDetailsQuery(client, productId);

  const {
    data: features,
    isLoading: isLoadingFeatures,
    error: featuresError,
  } = useFeaturesByCategoryQuery(client, categoryId ?? 0);

  console.log("categoryData", categories);
  console.log("productData", productData.data);
  console.log("product by category", productsByCategory);
  console.log("productDetails", productDetails);
  console.log("features", features);

  return (
    <>
      <Navbar />

      <div className="pt-10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[#81BBDF] font-bold text-5xl text-center">
            Compare . Choose . Prosper
          </h3>
          <p className="text-[#1D1D23] pt-4 text-center font-semibold">
            Make Informed Decisions. Find the perfect payment solution for your
            business
          </p>
        </div>

        <div className="pt-20 flex lg:flex-row flex-col justify-center gap-8 max-w-full mx-auto px-10">
          <div className="lg:w-80 w-full bg-[#00000008] py-8 px-4 rounded-xl h-fit">
            <p>Categories</p>

            <div className="px-2 pt-5 flex gap-x-4 gap-y-2 flex-wrap">
              {categories?.map((cate) => (
                <CategoryPill
                  text={cate?.name}
                  onClick={() => console.log("payment")}
                />
              ))}
            </div>
          </div>

          <div className=" flex-1 max-w-[77rem]">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-rows-auto gap-4">
              {productData.data?.map((prod) => {
                const path_name = replaceSpacesWithHyphens(prod.name);
                const finalPathName = path_name.toLowerCase();
                return (
                  <ProductCard
                    logoUrl={prod.logo_url}
                    name={prod.name}
                    description={prod.description}
                    onClick={() => router.push(`/product-info/${prod.id}`)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
