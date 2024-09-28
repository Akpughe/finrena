// components/ProductFeatureComparison.tsx

"use client";

import React, { useState } from "react";
import useSupabaseClient from "@/hooks/useSupabaseClient";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { useFeaturesByCategoryQuery } from "@/hooks/use-features";
import { useProductsByCategoryQuery } from "@/hooks/use-products";
import { useFeatureValuesQuery } from "@/hooks/use-product-feature-values";

export default function ProductFeatureComparison() {
  const client = useSupabaseClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

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
  const {
    data: featureValues,
    isLoading: isLoadingFeatureValues,
    error: featureValuesError,
  } = useFeatureValuesQuery(client, selectedProductIds);

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    setSelectedCategoryId(categoryId);
    setSelectedProductIds([]);
  };

  // Handle product selection
  const handleProductSelection = (productId: number) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
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
    <div>
      <h1>Product Feature Comparison</h1>

      {/* Category Selection */}
      {isLoadingCategories ? (
        <div>Loading categories...</div>
      ) : (
        <div>
          <label>Select Category:</label>
          <select
            value={selectedCategoryId ?? ""}
            onChange={handleCategoryChange}>
            <option value="" disabled>
              -- Select a category --
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Product Selection */}
      {isLoadingProducts ? (
        <div>Loading products...</div>
      ) : productsError ? (
        <div>Error loading products: {productsError.message}</div>
      ) : (
        selectedCategoryId !== null &&
        products && (
          <div>
            <h2>Select Products:</h2>
            {products.map((product) => (
              <div key={product.id}>
                <label>
                  <input
                    type="checkbox"
                    value={product.id}
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => handleProductSelection(product.id)}
                  />
                  {product.name}
                </label>
              </div>
            ))}
          </div>
        )
      )}

      {/* Feature List and Comparison Table */}
      {selectedCategoryId !== null && features && features.length > 0 && (
        <div>
          <h2>Features:</h2>
          {isLoadingFeatures ? (
            <div>Loading features...</div>
          ) : featuresError ? (
            <div>Error loading features: {featuresError.message}</div>
          ) : (
            <>
              {selectedProductIds.length === 0 ? (
                // Display feature list without comparison table
                <ul>
                  {features.map((feature) => (
                    <li key={feature.id}>{feature.name}</li>
                  ))}
                </ul>
              ) : isLoadingFeatureValues ? (
                <div>Loading feature values...</div>
              ) : featureValuesError ? (
                <div>
                  Error loading feature values: {featureValuesError.message}
                </div>
              ) : (
                // Display comparison table
                <table border={1} cellPadding={5} cellSpacing={0}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {selectedProductIds.map((productId) => {
                        const product = products?.find(
                          (p) => p.id === productId
                        );
                        return <th key={productId}>{product?.name}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature.id}>
                        <td>{feature.name}</td>
                        {selectedProductIds.map((productId) => {
                          const value =
                            featureValuesMap.get(feature.id)?.get(productId) ||
                            "N/A";
                          return <td key={productId}>{value}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
