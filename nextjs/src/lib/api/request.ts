import type { AxiosRequestConfig } from 'axios';
import { httpClient } from './client';
import type { ApiSuccess, ListResult } from '@/types/common';

export async function requestItem<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request<ApiSuccess<T>>(config);
  return response.data.data;
}

export async function requestList<T>(config: AxiosRequestConfig): Promise<ListResult<T>> {
  const response = await httpClient.request<ApiSuccess<T[]>>(config);
  return {
    items: response.data.data,
    meta: response.data.meta ?? { page: 1, limit: response.data.data.length, total: response.data.data.length, totalPages: 1 },
  };
}

export async function requestVoid(config: AxiosRequestConfig): Promise<void> {
  await httpClient.request(config);
}
