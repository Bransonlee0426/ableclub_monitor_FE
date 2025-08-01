import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('keywords');
  const [notificationType, setNotificationType] = useState('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // Fetch user notification settings on component mount
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await apiClient.get('/api/v1/me/notify-settings/');
        // Since apiClient response interceptor returns response.data directly,
        // we need to access data property from the returned object
        const data = response.data;
        
        // Update states with fetched data
        setNotificationType(data.notify_type);
        setEmail(data.email_address || '');
        setKeywords(data.keywords || []);
        setUpdatedAt(data.updated_at);
      } catch (error: any) {
        // Ignore 404 errors (user hasn't set up notifications yet)
        if (error.response?.status !== 404) {
          console.error('Failed to fetch notification settings:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

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

  const handleSave = async () => {
    // 0. 前置表單驗證 (Email)
    if (notificationType === 'email') {
      if (!email || !validateEmail(email)) {
        setEmailError('請輸入有效的 Email 格式');
        return;
      }
    }
    
    setIsSaving(true);
    setAlertInfo(null);
    
    // 1. 準備請求 Body
    const requestBody = {
      notify_type: notificationType,
      email_address: email,
      keywords: keywords,
    };
    
    try {
      let response;
      // 2. 判斷使用 POST (新增) 或 PUT (更新)
      if (updatedAt) { // updatedAt 有值，代表是更新
        response = await apiClient.put('/api/v1/me/notify-settings/', requestBody);
      } else { // updatedAt 為 null，代表是新增
        response = await apiClient.post('/api/v1/me/notify-settings/', requestBody);
      }
      
      // 3. 處理成功回應
      setAlertInfo({ type: 'success', message: response.message || '操作成功！' });
      setIsAlertVisible(true);
      // 更新畫面上的 "最後更新時間"
      setUpdatedAt(response.data.updated_at);
    } catch (error: any) {
      // 4. 處理失敗回應
      const errorMessage = error.response?.data?.message || '操作失敗，請稍後再試。';
      setAlertInfo({ type: 'error', message: errorMessage });
      setIsAlertVisible(true);
    } finally {
      // 5. 結束載入狀態
      setIsSaving(false);
      // 3秒後開始漸出動效，再0.3秒後完全清除
      setTimeout(() => {
        setIsAlertVisible(false);
        setTimeout(() => setAlertInfo(null), 300);
      }, 3000);
    }
  };

  const handleLogout = () => {
    // Use AuthContext to handle logout
    logout();
    // Navigate back to login page
    navigate('/login');
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-2 sm:p-6">
      {/* 全域提示訊息 - 顯示在畫面上方中間 */}
      {alertInfo && (
        <div className={`fixed top-7 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isAlertVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div role="alert" className={`alert alert-outline text-center ${
            alertInfo.type === 'success' 
              ? 'border-info text-info' 
              : 'border-error text-error'
          }`} style={{ padding: '0.5rem 1rem' }}>
            <span>{alertInfo.message}</span>
          </div>
        </div>
      )}
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
          className="tab !w-36" 
          aria-label="關鍵字提示"
          checked={activeTab === 'keywords'}
          onChange={() => setActiveTab('keywords')}
        />
        <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">關鍵字提示功能</h2>
            
            <div className="space-y-2">
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

              {/* 第三個欄位：關鍵字提示 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">關鍵字設定</span>
                </label>
                <div className="space-y-2">
                  {/* Keywords display */}
                  <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-base-300 rounded-lg">
                    {keywords.length > 0 ? (
                      keywords.map((keyword, index) => (
                        <div key={index} className="badge badge-primary gap-1" style={{ padding: '15px 0px 15px 15px' }}>
                          {keyword}
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-primary-content hover:text-error"
                            onClick={() => {
                              const newKeywords = keywords.filter((_, i) => i !== index);
                              setKeywords(newKeywords);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-base-content/50 text-sm">尚未設定關鍵字</span>
                    )}
                  </div>
                  
                  {/* Keyword input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="輸入關鍵字"
                      className="input input-bordered flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.currentTarget;
                          const value = target.value.trim();
                          if (value && !keywords.includes(value)) {
                            setKeywords([...keywords, value]);
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-primary"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !keywords.includes(value)) {
                          setKeywords([...keywords, value]);
                          input.value = '';
                        }
                      }}
                    >
                      新增
                    </button>
                  </div>
                  
                  {/* Keywords helper text */}
                  <div className="text-xs text-base-content/50">
                    <p>• 設定您感興趣的關鍵字，當相關內容出現時會通知您</p>
                    <p>• 支援多個關鍵字，按 Enter 鍵或點擊新增按鈕來添加</p>
                  </div>
                </div>
              </div>


              {/* 第四個欄位：儲存按鈕 */}
              <div className="form-control">
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleSave}
                  disabled={notificationType === 'telegram' || isSaving}
                >
                  {isSaving ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    '儲存'
                  )}
                </button>
              </div>

              {/* 更新時間顯示 */}
              {updatedAt && (
                <div className="text-left">
                  <p className="text-xs text-base-content/50">
                    最後更新時間: {
                      (() => {
                        // Convert API format "2025-07-28-13:18" to standard ISO format
                        const formatApiDate = (apiDate: string) => {
                          const parts = apiDate.split('-');
                          if (parts.length === 4) {
                            const year = parts[0];
                            const month = parts[1];
                            const day = parts[2];
                            const time = parts[3];
                            return `${year}-${month}-${day}T${time}:00`;
                          }
                          return apiDate; // fallback to original format
                        };
                        
                        const standardDate = formatApiDate(updatedAt);
                        return new Date(standardDate).toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).replace('T', ' ').substring(0, 16).replace(/-/g, '/');
                      })()
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <input 
          type="radio" 
          name="my_tabs_6" 
          className="tab !w-40" 
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