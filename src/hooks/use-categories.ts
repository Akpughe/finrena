// use-categories.ts

import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export const categoriesQueryKey = ['categories'];

export function useCategoriesQuery(
  client: TypedSupabaseClient,
  queryOptions?: UseQueryOptions<Category[], Error, Category[], QueryKey>
) {
  const queryFn = async (): Promise<Category[]> => {
    const { data } = await client.from('categories').select('*').throwOnError();
    return data || [];
  };

  return  useQuery<Category[], Error>({queryKey:categoriesQueryKey, queryFn, ...queryOptions })
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export function useCreateCategoryMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<Category, Error, CreateCategoryInput>
) {
  const mutationFn = async (newCategory: CreateCategoryInput): Promise<Category> => {
    const { data, error } = await client
      .from('categories')
      .insert(newCategory)
      .select('*')
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert category.');
      }
  
    
      return data;
  };

  return useMutation<Category, Error, CreateCategoryInput>({mutationFn,});
}

export interface UpdateCategoryInput {
  id: number;
  name?: string;
  description?: string;
}

export function useUpdateCategoryMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<Category, Error, UpdateCategoryInput>
) {
  const mutationFn = async (updatedCategory: UpdateCategoryInput): Promise<Category> => {
    const { id, ...updates } = updatedCategory;
    const { data, error } = await client
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert category.');
      }
  
    
      return data;
  };

  return useMutation<Category, Error, UpdateCategoryInput>({mutationFn});
}

export interface DeleteCategoryInput {
  id: number;
}

export function useDeleteCategoryMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<null, Error, DeleteCategoryInput>
) {
  const mutationFn = async ({ id }: DeleteCategoryInput): Promise<null> => {
    await client.from('categories').delete().eq('id', id).throwOnError();
    return null;
  };

  return useMutation<null, Error, DeleteCategoryInput>({mutationFn});
}
