import request from '../request';

export interface BaseItem {
  id: string | number;
  name: string;
}

export interface BaseListResponse {
  items: BaseItem[];
  total: number;
}

export const fetchBaseDataList = (params?: Record<string, any>): Promise<BaseListResponse> => {
  return request({
    url: '/base',
    method: 'get',
    params,
  });
};
