import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  CreditCard, Activity, BarChart3, MoreVertical, FileText, 
  Trash2, Edit, Filter, Download
} from 'lucide-react';

// Mock Data for Admin Simulation
const MOCK_USERS = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@student.com', phone: '01012345678', plan: 'free', status: 'active', joinDate: '2023-10-01' },
  { id: 2, name: 'سارة علي', email: 'sara@student.com', phone: '01123456789', plan: 'pro', status: 'active', joinDate: '2023-09-15' },
  { id: 3, name: 'محمود حسن', email: 'mahmoud@student.com', phone: '01234567890', plan: 'free', status: 'inactive', joinDate: '2023-11-20' },
  { id: 4, name: 'ميار خالد', email: 'mayar@student.com', phone: '01555555555', plan: 'pro', status: 'active', joinDate: '2023-12-05' },
];

const MOCK_REQUESTS = [
  { id: 101, user: 'كريم عادل', email: 'kareem@test.com', date: '2023-12-10', amount: 250, receipt: '#REC-9988' },
  { id: 102, user: 'نور ياسر', email: 'nour@test.com', date: '2023-12-11', amount: 250, receipt: '#REC-7766' },
];

export const Admin: React.FC = () => {
  const { user, upgradeToPro } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'requests'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveRequest = (id: number, email: string) => {
    // Simulate approval
    setRequests(prev => prev.filter(req => req.id !== id));
    
    // Check if it matches current user (Real Logic integration)
    if (user && user.email === email) {
        upgradeToPro();
    }
    
    showNotification('success', `تم تفعيل الاشتراك للطالب ${email} بنجاح`);
  };

  const handleRejectRequest = (id: number) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    showNotification('error', 'تم رفض طلب التفعيل');
  };

  const TabButton = ({ id, label, icon: Icon, count }: { id: typeof activeTab, label: string, icon: any, count?: number }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        activeTab === id 
        ? 'bg-brand-gold text-brand-main shadow-glow' 
        : 'text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-brand-main text-brand-gold' : 'bg-brand-gold text-brand-main'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-brand-muted text-sm">نظام إدارة منصة Nursy التعليمية</p>
                </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <TabButton id="overview" label="نظرة عامة" icon={Activity} />
                <TabButton id="users" label="الطلاب" icon={Users} />
                <TabButton id="requests" label="طلبات التفعيل" icon={CreditCard} count={requests.length} />
            </div>
        </header>

        {/* Notification Toast */}
        {notification && (
            <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-fade-in-up border ${
                notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' : 'bg-red-900/90 border-red-500 text-red-100'
            }`}>
                {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span className="font-bold">{notification.text}</span>
            </div>
        )}

        {/* CONTENT AREA */}
        <div className="space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'إجمالي الطلاب', val: '1,250', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            { label: 'الاشتراكات المفعلة', val: '850', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
                            { label: 'إجمالي الدخل', val: '212,500 ج.م', icon: CreditCard, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                            { label: 'عدد الكورسات', val: '5', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-brand-card border border-white/5 p-6 rounded-2xl shadow-lg hover:border-brand-gold/20 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-xs text-brand-muted bg-brand-main px-2 py-1 rounded">+12% هذا الشهر</span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-1">{stat.val}</h3>
                                <p className="text-brand-muted text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Action - Manual Activation */}
                        <div className="lg:col-span-1 bg-brand-card border border-white/5 p-6 rounded-2xl">
                             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldAlert size={20} className="text-brand-gold" />
                                تفعيل يدوي سريع
                             </h3>
                             <p className="text-sm text-brand-muted mb-4">تفعيل اشتراك طالب مباشرة عبر البريد الإلكتروني.</p>
                             <div className="space-y-3">
                                <input 
                                    type="email" 
                                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none"
                                    placeholder="email@student.com"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button 
                                    onClick={() => {
                                        if(searchTerm) {
                                            if(user && searchTerm === user.email) upgradeToPro();
                                            showNotification('success', `تم تفعيل الحساب ${searchTerm}`);
                                            setSearchTerm('');
                                        }
                                    }}
                                    className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors"
                                >
                                    تفعيل فوري
                                </button>
                             </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-brand-card border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-brand-gold" />
                                سجل النشاطات الحديثة
                             </h3>
                             <div className="space-y-4">
                                {[1,2,3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-brand-main/50 rounded-xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-bold">تم تفعيل اشتراك جديد</p>
                                            <p className="text-xs text-brand-muted">المستخدم user_{i+10}@nursy.com قام بدفع الاشتراك.</p>
                                        </div>
                                        <span className="text-xs text-brand-muted">منذ {i * 15 + 5} دقيقة</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white">إدارة الطلاب</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute right-3 top-3 text-brand-muted" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="بحث بالاسم أو البريد..."
                                    className="w-full bg-brand-main border border-white/10 rounded-lg px-10 py-2.5 text-white text-sm focus:border-brand-gold outline-none"
                                />
                            </div>
                            <button className="bg-brand-main border border-white/10 p-2.5 rounded-lg text-brand-muted hover:text-white hover:border-brand-gold">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-brand-main/50 text-brand-muted text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">الطالب</th>
                                    <th className="px-6 py-4">الباقة</th>
                                    <th className="px-6 py-4">تاريخ الانضمام</th>
                                    <th className="px-6 py-4">الحالة</th>
                                    <th className="px-6 py-4">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_USERS.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">{u.name}</div>
                                                    <div className="text-xs text-brand-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                u.plan === 'pro' 
                                                ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' 
                                                : 'bg-gray-700/30 text-gray-400 border-gray-700'
                                            }`}>
                                                {u.plan === 'pro' ? 'مشترك PRO' : 'مجاني'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-muted font-mono">{u.joinDate}</td>
                                        <td className="px-6 py-4">
                                             <span className={`flex items-center gap-1.5 text-xs font-bold ${u.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                {u.status === 'active' ? 'نشط' : 'موقوف'}
                                             </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-brand-muted hover:text-white transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-brand-muted hover:text-red-400 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === 'requests' && (
                <div className="animate-fade-in">
                    {requests.length === 0 ? (
                        <div className="bg-brand-card border border-white/5 rounded-2xl p-12 text-center">
                            <div className="w-20 h-20 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-brand-muted" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">لا توجد طلبات معلقة</h3>
                            <p className="text-brand-muted">جميع طلبات الاشتراك تم مراجعتها.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-brand-card border border-brand-gold/20 rounded-2xl p-6 shadow-glow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold"></div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{req.user}</h4>
                                            <p className="text-sm text-brand-muted font-mono">{req.email}</p>
                                        </div>
                                        <span className="bg-brand-gold text-brand-main text-xs font-bold px-2 py-1 rounded">
                                            {req.amount} EGP
                                        </span>
                                    </div>

                                    <div className="bg-brand-main rounded-xl p-4 mb-6 border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-brand-muted" size={20} />
                                            <div className="text-xs">
                                                <p className="text-white font-bold">إيصال الدفع</p>
                                                <p className="text-brand-muted font-mono">{req.receipt}</p>
                                            </div>
                                        </div>
                                        <button className="text-brand-gold text-xs font-bold hover:underline flex items-center gap-1">
                                            <Download size={12} /> معاينة
                                        </button>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleApproveRequest(req.id, req.email)}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            موافقة وتفعيل
                                        </button>
                                        <button 
                                            onClick={() => handleRejectRequest(req.id)}
                                            className="flex-1 bg-brand-main border border-white/10 hover:border-red-500/50 hover:text-red-400 text-brand-muted font-bold py-3 rounded-xl transition-all"
                                        >
                                            رفض
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-brand-muted mt-4 font-mono">{req.date}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};