// components/Compare.tsx

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import useSupabaseClient from "@/hooks/useSupabaseClient";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { useFeaturesByCategoryQuery } from "@/hooks/use-features";
import { useProductsByCategoryQuery } from "@/hooks/use-products";
import { useFeatureValuesQuery } from "@/hooks/use-product-feature-values";
import Head from "next/head";

const Compare = () => {
  const client = useSupabaseClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // We'll use an array of 4 elements to hold the selected product IDs for each column
  const [selectedProducts, setSelectedProducts] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } =
    useCategoriesQuery(client);

  // Fetch features for the selected category
  const {
    data: features,
    isLoading: isLoadingFeatures,
    error: featuresError,
  } = useFeaturesByCategoryQuery(client, selectedCategoryId ?? 0);

  // Fetch products for the selected category
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProductsByCategoryQuery(client, selectedCategoryId ?? 0);

  // Fetch feature values for the selected products
  const selectedProductIds = selectedProducts.filter(
    (id): id is number => id !== null
  );

  const { data: featureValues } = useFeatureValuesQuery(
    client,
    selectedProductIds
  );

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    setSelectedCategoryId(categoryId);
    setSelectedProducts([null, null, null, null]); // Reset selected products
  };

  // Handle product selection for a column
  const handleProductSelect = (
    columnIndex: number,
    productId: number | null
  ) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[columnIndex] = productId;
      return newSelected;
    });
  };

  // Prepare data for rendering
  const featureValuesMap = new Map<number, Map<number, string>>();

  if (featureValues) {
    featureValues.forEach((fv) => {
      const featureId = fv.feature_id;
      const productId = fv.product_id;
      const value = fv.value || "N/A";

      if (!featureValuesMap.has(featureId)) {
        featureValuesMap.set(featureId, new Map());
      }
      featureValuesMap.get(featureId)?.set(productId, value);
    });
  }

  return (
    <>
      <Head>
        <title>Compare | Finrena</title>
      </Head>
      <Navbar />

      <div className="pt-20 px-16">
        <h2 className="text-5xl font-bold">
          Choose the right solution for you
        </h2>
        <p className="text-xl pt-4">
          Use our comparison matrix to find the perfect solution
        </p>

        <div className="pt-10">
          {isLoadingCategories ? (
            <div>Loading categories...</div>
          ) : (
            <div>
              <select
                className="h-10 w-fit px-3 border border-[#1D1D2340] rounded-lg flex items-center justify-center text-sm"
                value={selectedCategoryId ?? ""}
                onChange={handleCategoryChange}>
                <option value="" disabled>
                  Select a category
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="pt-10">
          {selectedCategoryId !== null && features && features.length > 0 && (
            <div>
              {isLoadingFeatures ? (
                <div>Loading features...</div>
              ) : featuresError ? (
                <div>Error loading features: {featuresError.message}</div>
              ) : (
                <>
                  {/* Display comparison table with 4 columns for products */}
                  <table className="w-full text-sm text-left text-black space-y-5">
                    <thead>
                      <tr>
                        <th className="px-4 py-4">
                          <p className="text-left">Feature</p>
                        </th>
                        {Array.from({ length: 4 }, (_, index) => (
                          <th className="px-4 py-4" key={index}>
                            {isLoadingProducts ? (
                              <div>Loading products...</div>
                            ) : productsError ? (
                              <div>
                                Error loading products: {productsError.message}
                              </div>
                            ) : (
                              <select
                                className="h-10 w-fit px-3 border border-[#1D1D2340] rounded-lg flex items-center justify-center text-sm"
                                value={selectedProducts[index] ?? ""}
                                onChange={(e) =>
                                  handleProductSelect(
                                    index,
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }>
                                <option value="">Select a product</option>
                                {products?.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature) => (
                        <tr
                          key={feature.id}
                          className="border-b border-[#e5e7eb] bg-white">
                          <td className="px-4 py-4">{feature.name}</td>
                          {Array.from({ length: 4 }, (_, index) => {
                            const productId = selectedProducts[index];
                            let value = "N/A";
                            if (productId && featureValuesMap.has(feature.id)) {
                              value =
                                featureValuesMap
                                  .get(feature.id)
                                  ?.get(productId) || "N/A";
                            }
                            return (
                              <td className="px-4 py-4" key={index}>
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Compare;
