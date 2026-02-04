import { useState } from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bot, 
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active = false, isSidebarOpen }: { icon: any, label: string, path: string, active?: boolean, isSidebarOpen: boolean }) => (
  <Link to={path} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-cta text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} />
    {isSidebarOpen && <span className="font-medium">{label}</span>}
  </Link>
);

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      
      {/* Sidebar */}
      <aside className={`bg-primary text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-tight">商业全智能<span className="text-cta">.AI</span></h1>
          ) : (
            <span className="text-xl font-bold text-cta">AI</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="概览大屏" path="/" active={isActive('/')} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Palette} label="品宣设计" path="/design" active={isActive('/design')} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={TrendingUp} label="推广获客" path="/growth" active={isActive('/growth')} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={DollarSign} label="招商成交" path="/sales" active={isActive('/sales')} isSidebarOpen={isSidebarOpen} />
          <div className="my-4 border-t border-slate-700"></div>
          <SidebarItem icon={Users} label="客户管理" path="/crm" active={isActive('/crm')} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={Bot} label="AI 助理" path="/ai" active={isActive('/ai')} isSidebarOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-cta flex items-center justify-center font-bold">CZ</div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">CZBank Admin</p>
                <p className="text-xs text-slate-400 truncate">超级管理员</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg w-full transition-colors ${!isSidebarOpen && 'justify-center'}`}
            title="退出登录"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="text-sm">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索功能或客户..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cta/20 w-64 transition-all focus:w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="btn-primary py-2 px-4 text-sm shadow-sm">
              + 新建项目
            </button>
          </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;