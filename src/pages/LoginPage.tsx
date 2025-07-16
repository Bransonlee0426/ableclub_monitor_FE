import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUserStatus, loginOrRegister } from '../api/auth';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Component states as per specification
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isInviteCodeDisabled, setIsInviteCodeDisabled] = useState<boolean>(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [apiErrorMessage, setApiErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const debounceRef = useRef<number | null>(null);

  // Debounce logic for username input
  useEffect(() => {
    if (username.trim()) {
      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new timeout for 300ms
      debounceRef.current = setTimeout(async () => {
        setIsCheckingStatus(true);
        try {
          const response = await checkUserStatus({ username });
          
          // API success: set invite code field state based on isRegistered
          setIsInviteCodeDisabled(response.isRegistered);
        } catch (error) {
          // API failure: use tolerant strategy (enable invite code field)
          setIsInviteCodeDisabled(false);
          console.error('Check status API error:', error);
        } finally {
          setIsCheckingStatus(false);
        }
      }, 300);
    } else {
      // Reset to initial state when username is empty
      setIsInviteCodeDisabled(true);
    }

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isLoading || isCheckingStatus) {
      return;
    }

    // Clear all error messages
    setUsernameError('');
    setPasswordError('');
    setApiErrorMessage('');

    // Frontend validation
    let hasError = false;
    
    if (!username.trim()) {
      setUsernameError('請輸入帳號');
      hasError = true;
    }
    
    if (!password.trim()) {
      setPasswordError('請輸入密碼');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Start API request
    setIsLoading(true);
    
    try {
      const response = await loginOrRegister({
        username,
        password,
        inviteCode: inviteCode || null
      });

      // Success: store token and redirect
      if (response.success && response.token?.access_token) {
        // Store token in localStorage (you can modify this to use HttpOnly cookies if preferred)
        localStorage.setItem('access_token', response.token.access_token);
        
        // Navigate to home page
        navigate('/home');
      }
    } catch (error: any) {
      // Failure: display API error message
      const errorMessage = error?.response?.data?.message || error?.message || '登入失敗，請稍後再試';
      setApiErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-2 sm:p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl mx-2 sm:mx-0">
        <div className="card-body p-4 sm:p-8">
          {/* Login Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">歡迎登入</h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-1 sm:mt-2">請填寫您的登入資訊</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            {/* Account Field */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-medium text-sm sm:text-base">帳號</span>
              </label>
              <input
                type="text"
                placeholder="請輸入您的帳號"
                className="input input-bordered w-full h-12 sm:h-12 text-base"
                value={username}
                onChange={handleUsernameChange}
              />
              {/* Username error message */}
              {usernameError && (
                <p className="text-error text-sm mt-1">{usernameError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-medium text-sm sm:text-base">密碼</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="請輸入您的密碼"
                  className="input input-bordered w-full h-12 sm:h-12 pr-12 text-base"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-primary transition-colors touch-manipulation"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Eye open icon (showing password)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    // Eye closed icon (hiding password)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password error message */}
              {passwordError && (
                <p className="text-error text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Invite Code Field */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-medium text-sm sm:text-base">邀請碼</span>
              </label>
              <input
                type="text"
                placeholder="請輸入邀請碼"
                className={`input input-bordered w-full h-12 sm:h-12 text-base ${isInviteCodeDisabled ? 'input-disabled bg-base-300' : ''}`}
                value={inviteCode}
                onChange={handleInviteCodeChange}
                disabled={isInviteCodeDisabled}
              />
            </div>

            {/* API Error Message */}
            {apiErrorMessage && (
              <div className="text-error text-sm text-center">
                {apiErrorMessage}
              </div>
            )}

            {/* Login Button */}
            <div className="form-control mt-4 sm:mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 sm:h-12 text-base sm:text-lg font-medium touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-ring loading-md"></span>
                ) : (
                  '登入'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;