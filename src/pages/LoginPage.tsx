import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    inviteCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', formData);
    
    // Simple validation
    if (formData.account && formData.password) {
      // Navigate to HomePage after successful login
      navigate('/home');
    } else {
      alert('請填寫所有欄位');
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
                name="account"
                placeholder="請輸入您的帳號"
                className="input input-bordered w-full h-12 sm:h-12 text-base"
                value={formData.account}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-medium text-sm sm:text-base">密碼</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="請輸入您的密碼"
                  className="input input-bordered w-full h-12 sm:h-12 pr-12 text-base"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
            </div>

            {/* Invite Code Field */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-medium text-sm sm:text-base">邀請碼</span>
              </label>
              <input
                type="text"
                name="inviteCode"
                placeholder="請輸入邀請碼"
                className="input input-bordered w-full h-12 sm:h-12 text-base"
                value={formData.inviteCode}
                onChange={handleInputChange}
              />
            </div>

            {/* Login Button */}
            <div className="form-control mt-4 sm:mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 sm:h-12 text-base sm:text-lg font-medium touch-manipulation"
              >
                登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;