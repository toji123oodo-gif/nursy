
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, SubscriptionTier, Course } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Activity, Trash2, Edit, RefreshCw, BookOpen, AlertCircle, Loader2
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalIncome: 0,
    expiringSoon: 0
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
      name: '',
      subscriptionTier: 'free' as SubscriptionTier
  });

  useEffect(() => {
    setIsDataLoading(true);
    console.log("Admin: Fetching users...");

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      
      console.log(`Admin: Loaded ${users.length} students.`);
      setAllUsers(users);

      const now = new Date();
      const activeSubs = users.filter(u => {
           if (u.subscriptionTier !== 'pro' || !u.subscriptionExpiry) return false;
           return new Date(u.subscriptionExpiry) > now;
      });

      setStats({
          totalUsers: users.length,
          activeSubscriptions: activeSubs.length,
          totalIncome: activeSubs.length * 50,
          expiringSoon: 0 
      });
      setIsDataLoading(false);
    }, (error) => {
      console.error("Admin Firestore Error:", error);
      setIsDataLoading(false);
      if (error.code === 'permission-denied') {
        showNotification('error', 'تم رفض الوصول لقاعدة البيانات. يرجى مراجعة Firestore Rules.');
      }
    });

    return () => unsubscribe();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleManualActivation = async (queryStr: string) => {
    const targetUser = allUsers.find(u => 
      (u.email && u.email.toLowerCase() === queryStr.toLowerCase()) || 
      (u.phone && u.phone === queryStr)
    );
    
    if (targetUser) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        const updatedUser = { 
            ...targetUser, 
            subscriptionTier: 'pro' as const, 
            subscriptionExpiry: expiryDate.toISOString() 
        };
        try {
            await setDoc(doc(db, "users", targetUser.id), updatedUser, { merge: true });
            showNotification('success', `تم تفعيل الاشتراك لـ ${targetUser.name}`);
        } catch (error) {
            showNotification('error', 'فشل التحديث');
        }
    } else {
        showNotification('error', 'الطالب غير موجود في قاعدة البيانات');
    }
  };

  const filteredUsers = allUsers.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || "").includes(searchTerm)
  );

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
        activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-brand-muted text-sm">إدارة الطلاب والمحتوى</p>
                </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                <TabButton id="overview" label="نظرة عامة" icon={Activity} />
                <TabButton id="users" label="الطلاب" icon={Users} />
                <TabButton id="courses" label="الكورسات" icon={BookOpen} />
            </div>
        </header>

        {notification && (
            <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-2xl animate-fade-in-up border ${
                notification.type === 'success' ? 'bg-green-900 border-green-500 text-green-100' : 'bg-red-900 border-red-500 text-red-100'
            }`}>
                {notification.text}
            </div>
        )}

        {isDataLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p>جاري جلب بيانات الطلاب...</p>
            </div>
        ) : (
            <>
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-brand-card border border-white/5 p-6 rounded-2xl">
                                <p className="text-brand-muted text-sm mb-1">إجمالي الطلاب</p>
                                <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-6 rounded-2xl">
                                <p className="text-brand-muted text-sm mb-1">اشتراكات نشطة</p>
                                <h3 className="text-3xl font-black text-green-400">{stats.activeSubscriptions}</h3>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-6 rounded-2xl">
                                <p className="text-brand-muted text-sm mb-1">الدخل المتوقع</p>
                                <h3 className="text-3xl font-black text-brand-gold">{stats.totalIncome} ج.م</h3>
                            </div>
                        </div>

                        <div className="bg-brand-card border border-white/5 p-6 rounded-2xl max-w-md">
                            <h3 className="font-bold text-white mb-4">تفعيل سريع لاشتراك</h3>
                            <input 
                                type="text" 
                                placeholder="رقم الهاتف أو البريد..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white mb-4 outline-none"
                            />
                            <button 
                                onClick={() => handleManualActivation(searchTerm)}
                                className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-all"
                            >
                                تفعيل 30 يوم
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-bold text-white">قائمة الطلاب ({filteredUsers.length})</h3>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute right-3 top-2.5 text-brand-muted" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="بحث عن طالب..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-brand-main border border-white/10 rounded-lg pr-10 pl-4 py-2 text-white text-sm outline-none"
                                />
                            </div>
                        </div>
                        {filteredUsers.length === 0 ? (
                            <div className="p-20 text-center text-brand-muted">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>لا يوجد طلاب مسجلين حالياً</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="bg-brand-main/50 text-brand-muted text-xs font-bold uppercase">
                                        <tr>
                                            <th className="px-6 py-4">الطالب</th>
                                            <th className="px-6 py-4">التواصل</th>
                                            <th className="px-6 py-4">الباقة</th>
                                            <th className="px-6 py-4">تحكم</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                                                <td className="px-6 py-4 text-brand-muted text-sm">{u.email}<br/>{u.phone}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-brand-muted'}`}>
                                                        {u.subscriptionTier === 'pro' ? 'مشترك PRO' : 'مجاني'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingUser(u)} className="p-2 text-brand-muted hover:text-brand-gold"><Edit size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}
    </div>
  );
};
