// use-comparison-metrics.ts

import { QueryKey, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { TypedSupabaseClient } from './useSupabaseClient';

export interface ComparisonMetric {
  id: number;
  category_id: number;
  feature_id: number;
  Features?: {
    name: string;
    description: string | null;
  };
}

export const comparisonMetricsQueryKey = ['comparisonMetrics'];

export function useComparisonMetricsQuery(
  client: TypedSupabaseClient,
  categoryId: number,
  queryOptions?: UseQueryOptions<ComparisonMetric[], Error, ComparisonMetric[], QueryKey>
) {
const queryKey = [...comparisonMetricsQueryKey, 'category', categoryId]
  const queryFn = async (): Promise<ComparisonMetric[]> => {
    const { data, error } = await client
      .from('comparison_metrics')
      .select('*, features(name, description)')
      .eq('category_id', categoryId)
      .throwOnError();
    
      if(error){
        throw error
      }

    return data || [];
  };

  return useQuery<ComparisonMetric[], Error>({
    queryKey,
    queryFn,
    ...queryOptions
  });
}

export interface CreateComparisonMetricInput {
  category_id: number;
  feature_id: number;
}

export function useCreateComparisonMetricMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async (
    newComparisonMetric: CreateComparisonMetricInput
  ): Promise<ComparisonMetric> => {
    const { data, error } = await client
      .from('comparison_metrics')
      .insert(newComparisonMetric)
      .select('*')
      .single()
      .throwOnError();

      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Failed to insert comparison metric.');
      }
  
      return data;
  

  };

  return useMutation<ComparisonMetric, Error, CreateComparisonMetricInput>({mutationFn});
}

export interface DeleteComparisonMetricInput {
  id: number;
}

export function useDeleteComparisonMetricMutation(
  client: TypedSupabaseClient
) {
  const mutationFn = async ({ id }: DeleteComparisonMetricInput): Promise<null> => {
    await client.from('comparison_metrics').delete().eq('id', id).throwOnError();
    return null;
  };

  return useMutation<null, Error, DeleteComparisonMetricInput>({mutationFn});
}
