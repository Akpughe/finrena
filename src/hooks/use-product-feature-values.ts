// use-product-feature-values.ts

import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';

export interface FeatureValue {
  id: number;
  product_id: number;
  feature_id: number;
  value: string | null;
  features?: {
    name: string;
    description: string | null;
  } | null;
}

export const featureValuesQueryKey = ['featureValues'];

// export function useFeatureValuesQuery(
//   client: TypedSupabaseClient,
//   productId: number,
//   queryOptions?: UseQueryOptions<FeatureValue[], Error, FeatureValue[], QueryKey>
// ) {
//     const queryKey =  [...featureValuesQueryKey, 'product', productId]

//   const queryFn = async (): Promise<FeatureValue[]> => {
//     const { data, error } = await client
//       .from('product_feature_values')
//       .select('*, features(name, description)')
//       .eq('product_id', productId)
//       .throwOnError();

//       if (error) {
//         throw error;
//       }
  

//     return data || [];

//   };

//   return useQuery<FeatureValue[], Error>({
//     queryKey,
//     queryFn,
//     ...queryOptions
//   });
// }

export function useFeatureValuesQuery(
  client: TypedSupabaseClient,
  productIds: number[],
  queryOptions?: UseQueryOptions<FeatureValue[], Error>
) {
  const queryKey = ['featureValues', ...productIds];

  const queryFn = async (): Promise<FeatureValue[]> => {
    if (productIds.length === 0) return [];

    const { data, error } = await client
      .from('product_feature_values')
      .select('*')
      .in('product_id', productIds);

    if (error) {
      throw error;
    }

    return data || [];
  };

  return useQuery<FeatureValue[], Error>({
    queryKey,
    queryFn,
    enabled: productIds.length > 0,
    ...queryOptions,
  });
}

export interface AddFeatureValueInput {
  product_id: number;
  feature_id: number;
  value: string;
}

export function useAddFeatureValueMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async (newFeatureValue: AddFeatureValueInput): Promise<FeatureValue> => {
    const { data, error } = await client
      .from('product_feature_values')
      .insert(newFeatureValue)
      .select('*')
      .single()
      .throwOnError();

      if (error) {
        throw error;
      }
  
  
      return data;
  
  };

  return useMutation<FeatureValue, Error, AddFeatureValueInput>({mutationFn});
}

export interface UpdateFeatureValueInput {
  id: number;
  value: string;
}

export function useUpdateFeatureValueMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async (updatedFeatureValue: UpdateFeatureValueInput): Promise<FeatureValue> => {
    const { id, value } = updatedFeatureValue;
    const { data, error } = await client
      .from('product_feature_values')
      .update({ value })
      .eq('id', id)
      .select('*')
      .single()
      .throwOnError();

      if (error) {
        throw error;
      }
  
  
      return data;
  
  };

  return useMutation<FeatureValue, Error, UpdateFeatureValueInput>({mutationFn});
}

export interface DeleteFeatureValueInput {
  id: number;
}

export function useDeleteFeatureValueMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async ({ id }: DeleteFeatureValueInput): Promise<null> => {
    await client.from('product_feature_values').delete().eq('id', id).throwOnError();
    return null;
  };

  return useMutation<null, Error, DeleteFeatureValueInput>({mutationFn});
}
