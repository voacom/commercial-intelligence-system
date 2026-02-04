import React, { useState } from 'react';
import { 
  Bot, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      login(data.access_token);
      
      // Navigate to where they were trying to go, or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('登录失败，请检查账号和密码是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cta blur-[100px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400 blur-[100px]"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cta flex items-center justify-center shadow-lg shadow-cta/30">
              <Bot size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">商业全智能<span className="text-cta">.AI</span></span>
          </div>
          
          <h2 className="text-4xl font-bold leading-tight mb-6">
            AI 驱动的<br />
            <span className="text-cta">全链路</span> 招商营销系统
          </h2>
          
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            从品牌宣发、精准获客到成交转化的全流程智能化解决方案。让数据为商业赋能，让 AI 提升招商效率。
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-cta/20 flex items-center justify-center text-cta">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white">智能化内容生产</h4>
                <p className="text-sm text-slate-400">自动生成 PPT、海报与短视频</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-cta/20 flex items-center justify-center text-cta">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white">企业级数据安全</h4>
                <p className="text-sm text-slate-400">私有化部署与全链路加密保护</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary mb-2">欢迎回来</h2>
            <p className="text-slate-500">请输入您的账号信息以访问管理后台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full" />
                {error}
              </div>
            )}
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary" htmlFor="email">工作邮箱</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/20 focus:border-cta transition-all text-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary" htmlFor="password">密码</label>
                <Link to="#" className="text-sm text-cta hover:text-cta/80 font-medium">忘记密码?</Link>
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/20 focus:border-cta transition-all text-primary"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="w-4 h-4 text-cta border-slate-300 rounded focus:ring-cta"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600">
                记住此设备 30 天
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-cta text-white font-bold rounded-lg shadow-lg shadow-cta/30 hover:bg-cta/90 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  登录中...
                </>
              ) : (
                <>
                  立即登录 <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              还没有账号?{' '}
              <Link to="#" className="text-cta font-semibold hover:underline">
                联系管理员开通
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center w-full">
          <p className="text-xs text-slate-400">
            © 2024 CZBank Commercial Intelligence AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;