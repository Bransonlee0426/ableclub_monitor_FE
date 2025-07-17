import apiClient from '../apiClient';

export interface BaseItem {
  id: string | number;
  name: string;
}

export interface BaseListResponse {
  items: BaseItem[];
  total: number;
}

export const fetchBaseDataList = (params?: Record<string, any>): Promise<BaseListResponse> => {
  return apiClient({
    url: '/base',
    method: 'get',
    params,
  });
};
