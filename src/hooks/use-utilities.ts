/* eslint-disable */

// use-utilities.ts

import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';
import { Product } from './use-products';

export function useSearchProductsQuery(
  client: TypedSupabaseClient,
  searchTerm: string,
  queryOptions?: UseQueryOptions<Product[], Error, Product[], QueryKey>
) {
    const queryKey = ['searchProducts', searchTerm]

  const queryFn = async (): Promise<Product[]> => {

    const { data, error } = await client
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`);

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to search.');
      }

      return data || [];

  };

  return useQuery<Product[], Error>({
    queryKey,
    queryFn,
    ...queryOptions,
  });
}

export interface ComparisonData {
  product_id: number;
  value: string | null;
  features: {
    id: number;
    name: string;
  } | null;
}

export function useCompareProductsQuery(
  client: TypedSupabaseClient,
  categoryId: number,
  productIds: number[],
  queryOptions?: UseQueryOptions<ComparisonData[], Error, ComparisonData[], QueryKey>
) {
    const queryKey =   ['compareProducts', categoryId, ...productIds]
  const queryFn = async (): Promise<ComparisonData[]> => {
    // Fetch comparison metrics for the category
    const { data: metrics } = await client
      .from('comparison_metrics')
      .select('feature_id')
      .eq('category_id', categoryId)
      .throwOnError();

    const featureIds:any = metrics?.map((metric) => metric.feature_id);

    // Fetch feature values for the selected products and features
    const { data: featureValues, error:featureValuesError } = await client
      .from('product_feature_values')
      .select('product_id, value, features!inner(id, name)')
      .in('product_id', productIds)
      .in('feature_id', featureIds)
      .throwOnError();


      if (featureValuesError) {
        throw featureValuesError;
      }
  
      if (!featureValues) {
        throw new Error('Failed to insert category.');
      }


    return featureValues || [];
  };

  return useQuery<ComparisonData[], Error>({
    queryKey,
    queryFn,
    ...queryOptions
  });
}
