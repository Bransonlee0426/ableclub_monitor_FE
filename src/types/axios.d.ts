/* eslint-disable */
import * as axios from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
    message: string;
    status: number;
    [key: string]: T;
  }
}
