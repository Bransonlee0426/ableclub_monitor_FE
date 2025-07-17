import apiClient from '../apiClient';

// Check user status interface
export interface CheckStatusParams {
  username: string;
}

export interface CheckStatusResponse {
  success: true;
  message: "查詢成功";
  data: {
    isRegistered: boolean;
  };
  error_code: null;
  errors: null;
  timestamp: null;
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
  data: {
    access_token: string;
    token_type: string;
  } | null;
  error_code: string | null;
  errors: any;
  timestamp: string | null;
}

// User information interface
export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  // Add more user fields as needed
}

export interface GetUserMeResponse {
  success: boolean;
  message: string;
  data: UserInfo | null;
  error_code: string | null;
  errors: any;
  timestamp: string | null;
}

/**
 * Check user registration status
 * @param params - Check status parameters
 * @returns Promise<CheckStatusResponse>
 */
export const checkUserStatus = (params: CheckStatusParams): Promise<CheckStatusResponse> => {
  return apiClient({
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
  return apiClient({
    url: '/api/v1/auth/login-or-register',
    method: 'post',
    data,
  });
};

/**
 * Get current user information
 * @returns Promise<GetUserMeResponse>
 */
export const getUserMe = (): Promise<GetUserMeResponse> => {
  return apiClient({
    url: '/api/v1/users/me',
    method: 'get',
  });
};