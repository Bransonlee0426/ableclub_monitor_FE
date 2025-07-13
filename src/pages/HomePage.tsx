import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('keywords');
  const [notificationType, setNotificationType] = useState('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('請輸入有效的 Email 格式');
    } else {
      setEmailError('');
    }
  };

  const handleSave = () => {
    if (notificationType === 'email') {
      if (!email) {
        setEmailError('請輸入 Email 地址');
        return;
      }
      if (!validateEmail(email)) {
        setEmailError('請輸入有效的 Email 格式');
        return;
      }
    }
    
    console.log('保存設定:', { notificationType, email });
    alert('設定已保存！');
  };

  const handleLogout = () => {
    // Navigate back to login page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">儀表板</h1>
          <p className="text-base-content/70">歡迎使用您的應用程式</p>
        </div>
        <button 
          className="btn btn-outline btn-error btn-sm"
          onClick={handleLogout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          登出
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed w-full max-w-4xl mx-auto">
        <input 
          type="radio" 
          name="my_tabs_6" 
          className="tab" 
          aria-label="關鍵字提示"
          checked={activeTab === 'keywords'}
          onChange={() => setActiveTab('keywords')}
        />
        <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">關鍵字提示功能</h2>
            
            <div className="space-y-6">
              {/* 第一個欄位：通知方式選擇 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">選擇通知方式</span>
                </label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer">
                    <input 
                      type="radio" 
                      name="notification-type" 
                      className="radio radio-primary" 
                      checked={notificationType === 'email'}
                      onChange={() => setNotificationType('email')}
                    />
                    <span className="label-text ml-2">Email</span>
                  </label>
                  <label className="label cursor-pointer opacity-50">
                    <input 
                      type="radio" 
                      name="notification-type" 
                      className="radio radio-primary" 
                      disabled
                      checked={notificationType === 'telegram'}
                      onChange={() => setNotificationType('telegram')}
                    />
                    <span className="label-text ml-2">Telegram（敬請期待）</span>
                  </label>
                </div>
              </div>

              {/* 第二個欄位：根據選擇顯示對應輸入框 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    {notificationType === 'email' ? 'Email 地址' : 'Telegram'}
                  </span>
                </label>
                {notificationType === 'email' ? (
                  <div>
                    <input 
                      type="email" 
                      placeholder="請輸入您的 Email 地址" 
                      className={`input input-bordered w-full ${emailError ? 'input-error' : ''}`}
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {emailError && (
                      <label className="label">
                        <span className="label-text-alt text-error">{emailError}</span>
                      </label>
                    )}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    placeholder="Telegram 功能開發中..." 
                    className="input input-bordered w-full" 
                    disabled 
                  />
                )}
              </div>

              {/* 第三個欄位：儲存按鈕 */}
              <div className="form-control">
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleSave}
                  disabled={notificationType === 'telegram'}
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>

        <input 
          type="radio" 
          name="my_tabs_6" 
          className="tab" 
          aria-label="還沒想到的功能"
          checked={activeTab === 'future'}
          onChange={() => setActiveTab('future')}
          defaultChecked 
        />
        <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="text-center opacity-50">
            <h2 className="text-xl font-semibold mb-4">還沒想到的功能</h2>
            <p className="text-base-content/50">此功能尚未開發，敬請期待...</p>
            
            {/* Disabled state styling */}
            <div className="mt-6 space-y-4 pointer-events-none">
              <div className="form-control">
                <input 
                  type="text" 
                  placeholder="功能開發中..." 
                  className="input input-bordered w-full" 
                  disabled 
                />
              </div>
              <button className="btn btn-disabled" disabled>
                敬請期待
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 