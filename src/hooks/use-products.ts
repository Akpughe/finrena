// use-products.ts

import { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
  category: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  features: Array<{
    id: number;
    name: string;
    description: string | null;
    value: string | null;
  }>;
}

export const productsQueryKey = ['products'];

export function useProductsQuery(
  client: TypedSupabaseClient,
  queryOptions?: UseQueryOptions<Product[], Error, Product[], QueryKey>
) {
  const queryFn = async (): Promise<Product[]> => {
    const { data } = await client.from('products').select('*').throwOnError();
    return data || [];
  };

  return useQuery({queryKey:productsQueryKey, queryFn, ...queryOptions})
}

export function useProductsByCategoryQuery(
  client: TypedSupabaseClient,
  categoryId: number,
  queryOptions?: UseQueryOptions<Product[], Error, Product[], QueryKey>
) {
    const queryKey = [...productsQueryKey, 'category', categoryId];

  const queryFn = async (): Promise<Product[]> => {
    const { data } = await client.from('products').select('*').eq('category_id', categoryId).throwOnError();
    return data || [];
  };

  return useQuery<Product[], Error, Product[], QueryKey>({
    queryKey,
    queryFn,
    enabled: !!categoryId,
    ...queryOptions,
  });
  
}

export interface CreateProductInput {
  category_id: number;
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
}

export function useCreateProductMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<Product, Error, CreateProductInput>
) {
  const mutationFn = async (newProduct: CreateProductInput): Promise<Product> => {
    const { data, error } = await client
      .from('products')
      .insert(newProduct)
      .select('*')
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert product.');
      }
    return data;
  };

  return useMutation<Product, Error, CreateProductInput>({mutationFn});
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
}

export function useUpdateProductMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<Product, Error, UpdateProductInput>
) {
  const mutationFn = async (updatedProduct: UpdateProductInput): Promise<Product> => {
    const { id, ...updates } = updatedProduct;
    const { data, error } = await client
      .from('products')
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

  return useMutation<Product, Error, UpdateProductInput>({mutationFn});
}

export interface DeleteProductInput {
  id: number;
}

export function useDeleteProductMutation(
  client: TypedSupabaseClient,
  options?: UseMutationOptions<null, Error, DeleteProductInput>
) {
  const mutationFn = async ({ id }: DeleteProductInput): Promise<null> => {
    await client.from('products').delete().eq('id', id).throwOnError();
    return null;
  };

  return useMutation<null, Error, DeleteProductInput>({mutationFn});
}

export function useProductByIdQuery(
  client: TypedSupabaseClient,
  productId: number,
  queryOptions?: UseQueryOptions<Product, Error, Product, QueryKey>
) {
    const queryKey = ['product', productId]

  const queryFn = async (): Promise<Product> => {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert category.');
      }

    return data;
  };

  return useQuery<Product, Error>({
    queryKey,
    queryFn,
    ...queryOptions,
  });
}

export function useProductDetailsQuery(
  client: TypedSupabaseClient,
  productId: number,
  queryOptions?: UseQueryOptions<ProductDetails, Error>
) {
  const queryKey = ['productDetails', productId];

  const queryFn = async (): Promise<ProductDetails> => {
    // Fetch product details with related category and features
    const { data, error } = await client
      .from('products')
      .select(
        `
        id,
        name,
        description,
        website_url,
        logo_url,
        category:categories(
          id,
          name,
          description
        ),
        product_feature_values(
          value,
          feature:features(
            id,
            name,
            description
          )
        )
      `
      )
      .eq('id', productId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Product not found.');
    }

    // Transform data to match ProductDetails interface
    const productDetails: ProductDetails = {
      id: data.id,
      name: data.name,
      description: data.description,
      website_url: data.website_url,
      logo_url: data.logo_url,
      category: data.category,
      features: data.product_feature_values.map((pfv: any) => ({
        id: pfv.feature.id,
        name: pfv.feature.name,
        description: pfv.feature.description,
        value: pfv.value,
      })),
    };

    return productDetails;
  };

  return useQuery<ProductDetails, Error>({
    queryKey,
    queryFn,
    enabled: !!productId,
    ...queryOptions,
  });
}
