import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  Settings,
  MoreHorizontal,
  Search,
  Filter,
  BarChart2,
  PieChart,
  Users,
  X,
  Loader2,
  FileText,
  Layout,
  ChevronRight,
  Save,
  Download,
  Image as ImageIcon,
  RefreshCw,
  Copy,
  Trash2
} from 'lucide-react';

// --- Types ---
type ContentType = 'gallery' | 'analytics' | 'table';

interface FeatureConfig {
  title: string;
  description: string;
  type: ContentType;
  actionLabel: string;
}

interface Slide {
  title: string;
  content: string;
  image_description?: string;
  keywords?: string;
}

interface GeneratedData {
  slides: Slide[];
}

interface GalleryItem {
  id: string; // Changed to string for UUID
  title: string;
  updatedAt: string;
  type?: string;
  content?: any;
}

// --- Configuration ---
const FEATURES: Record<string, FeatureConfig> = {
  // Design
  'manual': {
    title: '招商手册设计',
    description: '智能生成高质量招商手册PPT，支持一键导出PDF/PPTX。',
    type: 'gallery',
    actionLabel: '新建手册'
  },
  'poster': {
    title: '招商海报设计',
    description: '海量营销海报模板，支持一键替换文案与Logo。',
    type: 'gallery',
    actionLabel: '新建海报'
  },
  'scripts': {
    title: '招商话术 (百问百答)',
    description: 'AI 辅助生成标准化销售话术库，提升团队专业度。',
    type: 'table',
    actionLabel: '添加话术'
  },
  // Growth
  'geo': {
    title: 'GEO 全网推广',
    description: '基于地理位置的精准广告投放与效果监控。',
    type: 'analytics',
    actionLabel: '新建投放计划'
  },
  'digital-human': {
    title: '数字人短视频',
    description: '无需真人出镜，AI 数字人批量生产口播视频。',
    type: 'gallery',
    actionLabel: '制作视频'
  },
  'matrix': {
    title: '短视频矩阵系统',
    description: '多账号统一管理，一键分发视频内容。',
    type: 'analytics',
    actionLabel: '绑定账号'
  },
  'ai-acquisition': {
    title: 'AI 拓客系统',
    description: '全网挖掘潜在客户线索，自动清洗去重。',
    type: 'table',
    actionLabel: '开始拓客'
  },
  // Sales
  'live': {
    title: '招商日不落直播间',
    description: '7x24小时无人值守直播，持续获取线索。',
    type: 'analytics',
    actionLabel: '开启直播'
  },
  'private-followup': {
    title: '个微私域跟进',
    description: '个人微信自动化运营工具，提升私域转化率。',
    type: 'table',
    actionLabel: '添加账号'
  },
  'enterprise-wechat': {
    title: '企微客户管理',
    description: '企业微信客户资产管理与风控系统。',
    type: 'table',
    actionLabel: '同步客户'
  }
};

// --- Sub-components ---

const GalleryView = ({ 
  items, 
  onItemClick,
  onSettingsClick,
  onDuplicate,
  onDelete
}: { 
  items: GalleryItem[];
  onItemClick?: (id: string) => void;
  onSettingsClick?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" onClick={() => setActiveMenuId(null)}>
      {items.map((item) => (
        <div 
          key={item.id} 
          onClick={() => onItemClick && onItemClick(item.id)}
          className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center text-slate-300">
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
              Preview {item.id}
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.updatedAt}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick && onSettingsClick(item.id);
              }}
              className="p-2 bg-white/90 rounded-lg shadow-sm hover:text-cta hover:bg-white transition-colors"
              title="快速编辑"
            >
              <Settings size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === item.id ? null : item.id);
                }}
                className={`p-2 bg-white/90 rounded-lg shadow-sm hover:text-cta hover:bg-white transition-colors ${activeMenuId === item.id ? 'text-cta bg-white opacity-100' : ''}`}
              >
                <MoreHorizontal size={16} />
              </button>
              
              {/* Dropdown Menu */}
              {activeMenuId === item.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={handleBackdropClick}></div>
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate && onDuplicate(item.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2"
                    >
                      <Copy size={14} /> 复制副本
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(item.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> 删除
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsView = () => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-slate-500 text-sm font-medium">总曝光量 (Impression)</h4>
          <BarChart2 size={18} className="text-cta" />
        </div>
        <div className="text-3xl font-bold text-primary mb-1">2,450,000</div>
        <div className="text-sm text-green-500 flex items-center gap-1">
          <span>+12.5%</span> <span className="text-slate-400">较上周</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-slate-500 text-sm font-medium">线索转化 (Leads)</h4>
          <Users size={18} className="text-cta" />
        </div>
        <div className="text-3xl font-bold text-primary mb-1">3,842</div>
        <div className="text-sm text-green-500 flex items-center gap-1">
          <span>+8.2%</span> <span className="text-slate-400">较上周</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-slate-500 text-sm font-medium">投入产出比 (ROI)</h4>
          <PieChart size={18} className="text-cta" />
        </div>
        <div className="text-3xl font-bold text-primary mb-1">1:4.5</div>
        <div className="text-sm text-red-500 flex items-center gap-1">
          <span>-2.1%</span> <span className="text-slate-400">较上周</span>
        </div>
      </div>
    </div>

    {/* Chart Placeholder */}
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <BarChart2 size={32} />
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">数据趋势图表</h3>
        <p className="text-slate-500 max-w-sm">此处将展示详细的数据分析图表，支持多维度筛选与对比。</p>
      </div>
    </div>
  </div>
);

const TableView = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {/* Table Toolbar */}
    <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="搜索记录..." 
          className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cta/20 w-full"
        />
      </div>
      <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
        <Filter size={16} /> 筛选
      </button>
    </div>

    {/* Table Content */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
          <tr>
            <th className="px-6 py-3 font-medium">ID</th>
            <th className="px-6 py-3 font-medium">名称/标题</th>
            <th className="px-6 py-3 font-medium">状态</th>
            <th className="px-6 py-3 font-medium">创建时间</th>
            <th className="px-6 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">#{2024000 + item}</td>
              <td className="px-6 py-4 text-slate-700">示例数据记录 - {item}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  运行中
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">2024-03-2{item}</td>
              <td className="px-6 py-4 text-cta font-medium cursor-pointer hover:underline">
                查看详情
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Pagination */}
    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
      <span>显示 1 到 5 条，共 128 条</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">上一页</button>
        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">下一页</button>
      </div>
    </div>
  </div>
);

// --- Editor Component ---

const SlideEditor = ({ 
  slides, 
  onSave, 
  onClose 
}: { 
  slides: Slide[], 
  onSave: (slides: Slide[]) => void, 
  onClose: () => void 
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedSlides, setEditedSlides] = useState<Slide[]>(slides);

  const currentSlide = editedSlides[currentSlideIndex];

  const handleContentChange = (field: keyof Slide, value: string) => {
    const newSlides = [...editedSlides];
    newSlides[currentSlideIndex] = {
      ...newSlides[currentSlideIndex],
      [field]: value
    };
    setEditedSlides(newSlides);
  };

  // Helper to generate placeholder image URL
  const getImageUrl = (slide: Slide) => {
    // Use keywords if available, otherwise fallback to abstract
    const query = slide.keywords || 'business,abstract';
    // Using a reliable placeholder service that supports text
    // In a real app, this would be the actual generated image URL
    return `https://placehold.co/800x600/e2e8f0/475569?text=${encodeURIComponent(query)}`;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Editor Header */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-slate-800">招商手册编辑器</h2>
          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded">自动保存中...</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Download size={18} /> 导出 PDF
          </button>
          <button 
            onClick={() => onSave(editedSlides)}
            className="flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-lg hover:bg-blue-600"
          >
            <Save size={18} /> 保存
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Slide List */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 font-medium text-slate-500 text-sm">
            幻灯片列表 ({editedSlides.length})
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {editedSlides.map((slide, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  idx === currentSlideIndex 
                    ? 'bg-white border-cta ring-1 ring-cta shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                  {idx === currentSlideIndex && <div className="w-2 h-2 bg-cta rounded-full"></div>}
                </div>
                <div className="text-xs font-medium text-slate-700 truncate">{slide.title}</div>
              </div>
            ))}
            <button className="w-full py-3 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm hover:border-cta hover:text-cta transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> 新增页面
            </button>
          </div>
        </div>

        {/* Main Content: Canvas/Form - Split View */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-6xl flex gap-6 h-[700px]">
            
            {/* Left Column: Text Editing */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-4">
                   <FileText size={16} /> 文本内容
                 </div>
                 <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-cta/30 transition-colors pb-2 bg-transparent"
                  placeholder="输入标题..."
                />
              </div>
              <div className="p-6 flex-1">
                <textarea
                  value={currentSlide.content}
                  onChange={(e) => handleContentChange('content', e.target.value)}
                  className="w-full h-full resize-none text-slate-600 leading-relaxed focus:outline-none text-base"
                  placeholder="在此输入正文内容..."
                />
              </div>
            </div>

            {/* Right Column: Visual Preview */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Image Preview Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-1/2">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <ImageIcon size={16} /> 配图预览
                  </div>
                  <button className="text-xs text-cta hover:text-blue-700 flex items-center gap-1">
                    <RefreshCw size={12} /> 重新生成
                  </button>
                </div>
                <div className="flex-1 bg-slate-100 relative group">
                  <img 
                    src={getImageUrl(currentSlide)} 
                    alt="Slide Visual" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                    <p className="text-white text-sm text-center">
                      AI 绘图提示词: <br/>
                      <span className="text-slate-200 italic">{currentSlide.image_description || '暂无描述'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide Layout Preview (Miniature) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50/50">
                  <Layout size={16} /> 幻灯片效果预览
                </div>
                <div className="flex-1 p-6 flex items-center justify-center bg-slate-100">
                  {/* Simulated 16:9 Slide */}
                  <div className="w-full aspect-video bg-white shadow-lg flex flex-col overflow-hidden relative">
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 opacity-20">
                      <img src={getImageUrl(currentSlide)} className="w-full h-full object-cover" />
                    </div>
                    {/* Content Layer */}
                    <div className="relative z-10 p-8 flex flex-col h-full">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentSlide.title}</h2>
                      <div className="flex-1 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {currentSlide.content}
                      </div>
                      <div className="text-xs text-slate-400 mt-4 text-right">
                        UI UX PRO MAX · Commercial Intelligence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const FeaturePage = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const { token, login, logout } = useAuth();
  
  // State for Create Manual Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedData | null>(null);
  
  // State for Editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // State for Gallery Items
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  // const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Fetch items on load
  useEffect(() => {
    if (featureId === 'manual' || featureId === 'poster') {
      fetchItems();
    }
  }, [featureId, token]);

  const fetchItems = async () => {
    if (!token) return;
    // setIsLoadingItems(true);
    try {
      const response = await fetch('http://localhost:8000/api/design/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter by current feature type if needed, or backend can filter
        // Currently backend returns all projects for user
        const mappedItems = data
          .filter((item: any) => item.type === featureId)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            updatedAt: new Date(item.updated_at).toLocaleString(),
            type: item.type,
            content: item.content
          }));
        setGalleryItems(mappedItems);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      // setIsLoadingItems(false);
    }
  };

  // Default to a generic view if ID not found (or handle 404)
  const feature = featureId && FEATURES[featureId] ? FEATURES[featureId] : {
    title: '未知功能',
    description: '该功能模块正在开发中...',
    type: 'table' as ContentType,
    actionLabel: '返回首页'
  };

  const handleActionClick = () => {
    if (featureId === 'manual') {
      setTopic('');
      setIndustry('');
      setTargetAudience('');
      setGeneratedResult(null);
      setCurrentEditingId(null);
      setIsModalOpen(true);
    }
  };

  const handleTemplateClick = (id: string) => {
    if (featureId === 'manual') {
      const item = galleryItems.find(i => i.id === id);
      if (item && item.content) {
        setGeneratedResult({ slides: item.content.slides });
        setCurrentEditingId(id);
        setIsEditorOpen(true);
      }
    }
  };

  const handleSettingsClick = (id: string) => {
    if (featureId === 'manual') {
      const item = galleryItems.find(i => i.id === id);
      if (item) {
        setTopic(item.title);
        // If we stored metadata in content, we could pre-fill industry/audience too
      }
      setIsModalOpen(true);
    }
  };

  const handleDuplicate = async (id: string) => {
    const itemToDuplicate = galleryItems.find(i => i.id === id);
    if (itemToDuplicate && token) {
      try {
        const response = await fetch('http://localhost:8000/api/design/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: itemToDuplicate.type || featureId || 'manual',
            title: `${itemToDuplicate.title} (副本)`,
            content: itemToDuplicate.content
          })
        });
        
        if (response.ok) {
          fetchItems(); // Refresh list
        }
      } catch (error) {
        console.error('Error duplicating project:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个项目吗？') && token) {
      try {
        const response = await fetch(`http://localhost:8000/api/design/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setGalleryItems(galleryItems.filter(i => i.id !== id));
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/design/manual/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Assuming backend doesn't check token for generation yet, but good practice
        },
        body: JSON.stringify({
          topic,
          industry,
          target_audience: targetAudience
        }),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setGeneratedResult(data.data);
      } else {
        alert('Generation failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error generating manual:', error);
      alert('Error connecting to server');
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = async () => {
    if (generatedResult) {
      if (!token) {
        if (window.confirm('您尚未登录。是否使用演示账号自动登录并继续？')) {
          try {
            const response = await fetch('http://localhost:8000/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: 'admin@czbank.com',
                password: 'admin123'
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              login(data.access_token);
              alert('登录成功！请再次点击“进入编辑”。');
            } else {
              throw new Error('Login failed');
            }
            return;
          } catch (e) {
            alert('自动登录失败，请手动登录。');
            return;
          }
        } else {
          return;
        }
      }

      setIsCreatingProject(true);
      if (!currentEditingId) {
        try {
          const response = await fetch('http://localhost:8000/api/design/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              type: featureId || 'manual',
              title: topic || '未命名项目',
              content: generatedResult
            })
          });
          
          if (response.ok) {
            const newProject = await response.json();
            setCurrentEditingId(newProject.id);
            fetchItems();
            setIsModalOpen(false);
            setIsEditorOpen(true);
          } else {
            if (response.status === 401) {
              alert('登录已过期，请重新登录');
              logout();
              return; 
            }
            const errorData = await response.json().catch(() => null);
            const message = errorData?.detail || errorData?.message || '创建项目失败，请重试';
            alert(message);
          }
        } catch (error) {
          console.error('Error creating initial project:', error);
          alert('无法连接到服务器，请检查网络');
        } finally {
          setIsCreatingProject(false);
        }
      } else {
        // Already has ID (e.g. opened from gallery)
        setIsModalOpen(false);
        setIsEditorOpen(true);
        setIsCreatingProject(false);
      }
    }
  };

  const handleSaveEditor = async (slides: Slide[]) => {
    if (currentEditingId && token) {
      try {
        const response = await fetch(`http://localhost:8000/api/design/projects/${currentEditingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: topic, // Optional: update title if changed
            content: { slides }
          })
        });
        
        if (response.ok) {
          alert('保存成功！');
          fetchItems(); // Refresh list to update timestamp
          setIsEditorOpen(false);
        } else {
          alert('保存失败');
        }
      } catch (error) {
        console.error('Error saving project:', error);
        alert('保存出错');
      }
    }
  };

  // If editor is open, render editor instead of dashboard
  if (isEditorOpen && generatedResult) {
    return (
      <SlideEditor 
        slides={generatedResult.slides} 
        onSave={handleSaveEditor}
        onClose={() => setIsEditorOpen(false)}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-cta mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> 返回仪表盘
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{feature.title}</h1>
            <p className="text-slate-500 max-w-2xl">{feature.description}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary py-2 px-4 flex items-center gap-2">
              <Share2 size={18} /> 分享
            </button>
            <button 
              onClick={handleActionClick}
              className="btn-primary py-2 px-4 flex items-center gap-2 shadow-lg shadow-cta/20"
            >
              <Plus size={18} /> {feature.actionLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {feature.type === 'gallery' && (
          <GalleryView 
            items={galleryItems}
            onItemClick={handleTemplateClick} 
            onSettingsClick={handleSettingsClick}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
        {feature.type === 'analytics' && <AnalyticsView />}
        {feature.type === 'table' && <TableView />}
      </div>

      {/* Create Manual Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-primary">新建招商手册</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!generatedResult ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h4 className="text-sm font-bold text-blue-800 mb-1">AI 智能设计助手</h4>
                    <p className="text-sm text-blue-600">请输入项目的基础信息，AI 将为您生成专业的招商手册大纲，生成后您可以逐页编辑内容。</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">项目主题/名称</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="例如：未来城市商业综合体"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">所属行业</label>
                    <input 
                      type="text" 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="例如：商业地产、人工智能、SaaS"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">目标受众</label>
                    <input 
                      type="text" 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="例如：政府机构、天使投资人、合作伙伴"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-green-800">生成成功</h4>
                        <p className="text-xs text-green-600">已生成 {generatedResult.slides.length} 页演示文稿大纲。</p>
                      </div>
                   </div>
                   
                   <div className="border border-slate-200 rounded-lg overflow-hidden">
                     <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-medium text-slate-500">
                       大纲预览
                     </div>
                     <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                       {generatedResult.slides.map((slide, idx) => (
                         <div key={idx} className="px-4 py-3 flex items-center gap-3">
                           <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                           <span className="text-sm text-slate-700">{slide.title}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              {!generatedResult ? (
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="px-6 py-2 bg-cta text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> 生成中...
                    </>
                  ) : (
                    '开始生成'
                  )}
                </button>
              ) : (
                <button 
                  onClick={startEditing}
                  disabled={isCreatingProject}
                  className="px-6 py-2 bg-cta text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingProject ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> 正在打开...
                    </>
                  ) : (
                    <>进入编辑 <ChevronRight size={16} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeaturePage;
