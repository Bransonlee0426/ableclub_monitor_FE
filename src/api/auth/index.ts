import request from '../request';

// Check user status interface
export interface CheckStatusParams {
  username: string;
}

export interface CheckStatusResponse {
  isRegistered: boolean;
}

// Login or register interface
export interface LoginOrRegisterParams {
  username: string;
  password: string;
  inviteCode?: string | null;
}

export interface LoginOrRegisterResponse {
  success: boolean;
  message: string;
  token: {
    access_token: string;
    token_type: string;
  };
  errors: any;
  error_code: any;
}

/**
 * Check user registration status
 * @param params - Check status parameters
 * @returns Promise<CheckStatusResponse>
 */
export const checkUserStatus = (params: CheckStatusParams): Promise<CheckStatusResponse> => {
  return request({
    url: '/api/v1/users/check-status',
    method: 'get',
    params,
  });
};

/**
 * User login or register
 * @param data - Login or register data
 * @returns Promise<LoginOrRegisterResponse>
 */
export const loginOrRegister = (data: LoginOrRegisterParams): Promise<LoginOrRegisterResponse> => {
  return request({
    url: '/api/v1/auth/login-or-register',
    method: 'post',
    data,
  });
};