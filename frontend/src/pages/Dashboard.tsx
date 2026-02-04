import { 
  Palette, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Image, 
  MessageSquareText, 
  Globe, 
  Bot, 
  MonitorPlay, 
  UserPlus, 
  Video, 
  Users, 
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, colorClass = "bg-blue-50 text-blue-600", link }: { icon: any, title: string, description: string, colorClass?: string, link: string }) => (
  <Link to={link} className="card h-full flex flex-col group">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass} transition-colors group-hover:scale-110 duration-200`}>
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-cta transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    <div className="mt-auto pt-4 flex items-center text-cta text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
      立即使用 <ChevronRight size={16} className="ml-1" />
    </div>
  </Link>
);

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-2 mb-6 mt-8 pb-2 border-b border-slate-200">
    <Icon size={24} className="text-primary" />
    <h2 className="text-2xl font-bold text-primary">{title}</h2>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">欢迎回来, 管理员</h1>
        <p className="text-slate-500">AI数智化招商营销系统已准备就绪，今日新增潜在客户 <span className="text-cta font-bold">128</span> 位。</p>
      </div>

      {/* Module 1: Design */}
      <SectionHeader title="招商品宣设计" icon={Palette} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <FeatureCard 
          icon={BookOpen} 
          title="招商手册设计" 
          description="根据输入的行业和内容自动生成招商PPT，智能排版，只需手动填写关键信息。"
          colorClass="bg-purple-50 text-purple-600"
          link="/design/manual"
        />
        <FeatureCard 
          icon={Image} 
          title="招商海报设计" 
          description="一键生成长图海报和朋友圈日签。包含合伙人加盟案例见证、加盟优势等模板。"
          colorClass="bg-pink-50 text-pink-600"
          link="/design/poster"
        />
        <FeatureCard 
          icon={MessageSquareText} 
          title="招商话术 (百问百答)" 
          description="生成标准化沟通话术，智能解决加盟商的各种疑难问题，提升转化率。"
          colorClass="bg-orange-50 text-orange-600"
          link="/design/scripts"
        />
      </div>

      {/* Module 2: Growth */}
      <SectionHeader title="招商推广获客" icon={TrendingUp} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <FeatureCard 
          icon={Globe} 
          title="GEO 全网推广" 
          description="通过全网关键词软文推广，提升品牌影响力，覆盖精准地域流量。"
          colorClass="bg-blue-50 text-blue-600"
          link="/growth/geo"
        />
        <FeatureCard 
          icon={Bot} 
          title="数字人短视频" 
          description="自动生成招商推广营销的数字人短视频，降低拍摄成本，批量生产内容。"
          colorClass="bg-cyan-50 text-cyan-600"
          link="/growth/digital-human"
        />
        <FeatureCard 
          icon={MonitorPlay} 
          title="短视频矩阵系统" 
          description="通过自媒体短视频矩阵体系进行宣发推广，实现流量的指数级增长。"
          colorClass="bg-indigo-50 text-indigo-600"
          link="/growth/matrix"
        />
        <FeatureCard 
          icon={UserPlus} 
          title="AI 拓客系统" 
          description="自媒体智能获客，全网搜索精准客户名单，自动筛选意向客户。"
          colorClass="bg-sky-50 text-sky-600"
          link="/growth/ai-acquisition"
        />
      </div>

      {/* Module 3: Sales */}
      <SectionHeader title="招商成交" icon={DollarSign} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Video} 
          title="招商日不落直播间" 
          description="将有意向的客户拉进直播间，利用录播技术实现7x24小时不间断直播转化。"
          colorClass="bg-red-50 text-red-600"
          link="/sales/live"
        />
        <FeatureCard 
          icon={Users} 
          title="个微私域跟进" 
          description="招商专员加客户微信，实现24小时自动回复、朋友圈自动点赞互动。"
          colorClass="bg-green-50 text-green-600"
          link="/sales/private-followup"
        />
        <FeatureCard 
          icon={Briefcase} 
          title="企微客户管理" 
          description="聚合聊天、标签管理、关键词回复等功能，企业级精细化客户运营。"
          colorClass="bg-emerald-50 text-emerald-600"
          link="/sales/enterprise-wechat"
        />
      </div>

    </div>
  );
};

export default Dashboard;