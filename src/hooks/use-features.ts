// use-features.ts

import { QueryKey, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';

export interface Feature {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
}

export const featuresQueryKey = ['features'];

export function useFeaturesQuery(
  client: TypedSupabaseClient,
  categoryId: number,
  queryOptions?: UseQueryOptions<Feature[], Error, Feature[], QueryKey>
) {
    const queryKey= [...featuresQueryKey, 'category', categoryId]
  const queryFn = async (): Promise<Feature[]> => {
    const { data } = await client
      .from('features')
      .select('*')
      .eq('category_id', categoryId)
      .throwOnError();
    return data || [];
  };


  return useQuery({queryKey, queryFn, ...queryOptions})

}


export function useFeaturesByCategoryQuery(
  client: TypedSupabaseClient,
  categoryId: number,
  queryOptions?: UseQueryOptions<Feature[], Error>
) {
  const queryKey = [...featuresQueryKey, 'category', categoryId];

  const queryFn = async (): Promise<Feature[]> => {
    const { data, error } = await client
      .from('features')
      .select('*')
      .eq('category_id', categoryId);

    if (error) {
      throw error;
    }

    return data || [];
  };

  return useQuery<Feature[], Error>({
    queryKey,
    queryFn,
    enabled: !!categoryId,
    ...queryOptions,
  });
}

export interface CreateFeatureInput {
  category_id: number;
  name: string;
  description?: string;
}

export function useCreateFeatureMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async (newFeature: CreateFeatureInput): Promise<Feature> => {
    const { data, error } = await client
      .from('features')
      .insert(newFeature)
      .select('*')
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert feature.');
      }

    return data;
  };

  return useMutation<Feature, Error, CreateFeatureInput>({mutationFn});
}

export interface UpdateFeatureInput {
  id: number;
  name?: string;
  description?: string;
}

export function useUpdateFeatureMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async (updatedFeature: UpdateFeatureInput): Promise<Feature> => {
    const { id, ...updates } = updatedFeature;
    const { data, error } = await client
      .from('features')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to update feature.');
      }

    return data;
  };

  return useMutation<Feature, Error, UpdateFeatureInput>({mutationFn});
}

export interface DeleteFeatureInput {
  id: number;
}

export function useDeleteFeatureMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async ({ id }: DeleteFeatureInput): Promise<null> => {
    await client.from('features').delete().eq('id', id).throwOnError();
    return null;
  };

  return useMutation<null, Error, DeleteFeatureInput>({mutationFn});
}
