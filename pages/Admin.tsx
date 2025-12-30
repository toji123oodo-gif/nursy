import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, SubscriptionTier, Course } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  CreditCard, Activity, MoreVertical, FileText, 
  Trash2, Edit, Filter, Download, Calendar, RefreshCw,
  Plus, Save, X, UserPlus, Lock, Unlock, BookOpen, Image as ImageIcon
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'requests'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Real Data States
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalIncome: 0,
    expiringSoon: 0
  });

  // --- USER MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // User Form Data
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      subscriptionTier: 'free' as SubscriptionTier,
      expiryDate: '' // YYYY-MM-DD
  });

  // --- COURSE MODAL STATES ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Course Form Data
  const [courseFormData, setCourseFormData] = useState<{
      title: string;
      instructor: string;
      price: number;
      originalPrice: number;
      subject: string;
      image: string;
  }>({
      title: '',
      instructor: '',
      price: 0,
      originalPrice: 0,
      subject: '',
      image: ''
  });

  // Load Real Data from localStorage Master Index
  const loadData = () => {
    try {
      const storedUsers = localStorage.getItem('nursy_all_users_index');
      if (storedUsers) {
        const parsedUsers: User[] = JSON.parse(storedUsers);
        setAllUsers(parsedUsers);
        
        // Calculate Stats
        const now = new Date();
        const activeSubs = parsedUsers.filter(u => {
             if (u.subscriptionTier !== 'pro' || !u.subscriptionExpiry) return false;
             return new Date(u.subscriptionExpiry) > now;
        });

        const expiring = activeSubs.filter(u => {
            const expiry = new Date(u.subscriptionExpiry!);
            const diffTime = Math.abs(expiry.getTime() - now.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 5; 
        });

        setStats({
            totalUsers: parsedUsers.length,
            activeSubscriptions: activeSubs.length,
            totalIncome: activeSubs.length * 50, // 50 EGP per active user
            expiringSoon: expiring.length
        });
      }
    } catch (e) {
      console.error("Error loading admin data", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- USER OPERATIONS ---

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Check duplicate email
      if (allUsers.find(u => u.email === formData.email)) {
          showNotification('error', 'هذا البريد الإلكتروني مسجل بالفعل');
          return;
      }

      // Create New User Object
      const newUser: User = {
          id: `manual-user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subscriptionTier: formData.subscriptionTier,
          subscriptionExpiry: formData.subscriptionTier === 'pro' && formData.expiryDate 
            ? new Date(formData.expiryDate).toISOString() 
            : undefined
      };

      // Save to Master Index
      const newAllUsers = [...allUsers, newUser];
      localStorage.setItem('nursy_all_users_index', JSON.stringify(newAllUsers));

      // Save to User Specific Storage (Simulating DB record creation)
      localStorage.setItem(`nursy_user_data_${newUser.id}`, JSON.stringify(newUser));

      loadData();
      setIsAddModalOpen(false);
      resetForm();
      showNotification('success', 'تم إضافة العضو الجديد بنجاح');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser) return;

      const updatedUser: User = {
          ...editingUser,
          name: formData.name,
          phone: formData.phone,
          subscriptionTier: formData.subscriptionTier,
          subscriptionExpiry: formData.subscriptionTier === 'pro' && formData.expiryDate
             ? new Date(formData.expiryDate).toISOString()
             : undefined
      };

      // Update in Master List
      const newAllUsers = allUsers.map(u => u.id === editingUser.id ? updatedUser : u);
      localStorage.setItem('nursy_all_users_index', JSON.stringify(newAllUsers));
      
      // Update User Specific Data
      const userKey = `nursy_user_data_${updatedUser.id}`;
      const existingData = localStorage.getItem(userKey);
      const newData = existingData ? { ...JSON.parse(existingData), ...updatedUser } : updatedUser;
      localStorage.setItem(userKey, JSON.stringify(newData));

      loadData();
      setEditingUser(null);
      resetForm();
      showNotification('success', 'تم تحديث بيانات العضو والصلاحيات');
  };

  const handleDeleteUser = (userId: string) => {
      if(!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع.")) return;

      const newAllUsers = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('nursy_all_users_index', JSON.stringify(newAllUsers));
      localStorage.removeItem(`nursy_user_data_${userId}`);
      
      loadData();
      showNotification('success', 'تم حذف المستخدم');
  };

  // --- COURSE OPERATIONS ---

  const openAddCourseModal = () => {
      setCourseFormData({
          title: '',
          instructor: '',
          price: 0,
          originalPrice: 0,
          subject: '',
          image: ''
      });
      setEditingCourse(null);
      setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
      setCourseFormData({
          title: course.title,
          instructor: course.instructor,
          price: course.price,
          originalPrice: course.originalPrice || 0,
          subject: course.subject,
          image: course.image
      });
      setEditingCourse(course);
      setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
      e.preventDefault();

      const courseData: Course = {
          id: editingCourse ? editingCourse.id : `c-${Date.now()}`,
          title: courseFormData.title,
          instructor: courseFormData.instructor,
          price: Number(courseFormData.price),
          originalPrice: Number(courseFormData.originalPrice),
          subject: courseFormData.subject,
          image: courseFormData.image,
          lessons: editingCourse ? editingCourse.lessons : [] // Keep existing lessons or init empty
      };

      if (editingCourse) {
          updateCourse(courseData);
          showNotification('success', 'تم تعديل الكورس بنجاح');
      } else {
          addCourse(courseData);
          showNotification('success', 'تم إضافة الكورس بنجاح');
      }
      setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
      if(!window.confirm("هل أنت متأكد من حذف هذا الكورس؟")) return;
      deleteCourse(id);
      showNotification('success', 'تم حذف الكورس');
  };

  // --- HELPERS ---

  const openAddModal = () => {
      resetForm();
      // Default 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFormData(prev => ({ ...prev, expiryDate: date.toISOString().split('T')[0] }));
      setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
      let expiry = '';
      if (user.subscriptionExpiry) {
          try {
              expiry = new Date(user.subscriptionExpiry).toISOString().split('T')[0];
          } catch(e) {}
      } else {
          // Default to today + 30 if enabling pro
          const date = new Date();
          date.setDate(date.getDate() + 30);
          expiry = date.toISOString().split('T')[0];
      }

      setFormData({
          name: user.name,
          email: user.email, // Email usually read-only in edit
          phone: user.phone,
          subscriptionTier: user.subscriptionTier,
          expiryDate: expiry
      });
      setEditingUser(user);
  };

  const resetForm = () => {
      setFormData({
          name: '',
          email: '',
          phone: '',
          subscriptionTier: 'free',
          expiryDate: ''
      });
  };

  const handleManualActivation = (emailToActivate: string) => {
    const targetUser = allUsers.find(u => u.email === emailToActivate || u.phone === emailToActivate);
    
    if (targetUser) {
        // Calculate new expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const updatedUser = { 
            ...targetUser, 
            subscriptionTier: 'pro' as const, 
            subscriptionExpiry: expiryDate.toISOString() 
        };

        // Update in Master List
        const newAllUsers = allUsers.map(u => u.id === targetUser.id ? updatedUser : u);
        localStorage.setItem('nursy_all_users_index', JSON.stringify(newAllUsers));
        
        // Update in User Specific Storage
        const userKey = `nursy_user_data_${targetUser.id}`;
        const existingData = localStorage.getItem(userKey);
        const newData = existingData ? { ...JSON.parse(existingData), ...updatedUser } : updatedUser;
        localStorage.setItem(userKey, JSON.stringify(newData));

        loadData();
        showNotification('success', `تم تفعيل الاشتراك للطالب ${targetUser.name} بنجاح`);
        setSearchTerm('');
    } else {
        showNotification('error', 'المستخدم غير موجود.');
    }
  };
  
  // Filtered Users for Table
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
        activeTab === id 
        ? 'bg-brand-gold text-brand-main shadow-glow' 
        : 'text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-fade-in relative">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">لوحة التحكم</h1>
                    <p className="text-brand-muted text-sm flex items-center gap-2">
                        <span>إحصائيات حقيقية</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    </p>
                </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                <TabButton id="overview" label="نظرة عامة" icon={Activity} />
                <TabButton id="users" label="الطلاب" icon={Users} />
                <TabButton id="courses" label="الكورسات" icon={BookOpen} />
                <TabButton id="requests" label="طلبات التفعيل" icon={CreditCard} />
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
                        <div className="bg-brand-card border border-white/5 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-blue-400/10 text-blue-400">
                                    <Users size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stats.totalUsers}</h3>
                            <p className="text-brand-muted text-sm">إجمالي المسجلين</p>
                        </div>

                        <div className="bg-brand-card border border-white/5 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-green-400/10 text-green-400">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stats.activeSubscriptions}</h3>
                            <p className="text-brand-muted text-sm">اشتراكات نشطة</p>
                        </div>

                        <div className="bg-brand-card border border-white/5 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stats.totalIncome} <span className="text-lg">ج.م</span></h3>
                            <p className="text-brand-muted text-sm">الدخل المقدر (النشط)</p>
                        </div>

                         <div className="bg-brand-card border border-white/5 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
                                    <Calendar size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stats.expiringSoon}</h3>
                            <p className="text-brand-muted text-sm">ينتهي قريباً (5 أيام)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Action - Manual Activation */}
                        <div className="lg:col-span-1 bg-brand-card border border-white/5 p-6 rounded-2xl">
                             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldAlert size={20} className="text-brand-gold" />
                                تفعيل يدوي (30 يوم)
                             </h3>
                             <p className="text-sm text-brand-muted mb-4">أدخل بريد الطالب لتفعيل الاشتراك فوراً.</p>
                             <div className="space-y-3">
                                <input 
                                    type="text" 
                                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none"
                                    placeholder="البريد الإلكتروني أو الهاتف"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleManualActivation(searchTerm)}
                                    className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors"
                                >
                                    تفعيل فوري
                                </button>
                             </div>
                        </div>

                        {/* Recent Users List (Mini) */}
                        <div className="lg:col-span-2 bg-brand-card border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-brand-gold" />
                                آخر المنضمين
                             </h3>
                             <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {allUsers.length === 0 ? (
                                    <p className="text-brand-muted text-center py-4">لا يوجد مستخدمين مسجلين بعد.</p>
                                ) : (
                                    allUsers.slice().reverse().slice(0, 5).map((u, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-brand-main/50 rounded-xl border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-bold">{u.name}</p>
                                                <p className="text-xs text-brand-muted">{u.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${u.subscriptionTier === 'pro' ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-brand-muted'}`}>
                                                {u.subscriptionTier === 'pro' ? 'مشترك' : 'مجاني'}
                                            </span>
                                        </div>
                                    ))
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white">إدارة الطلاب ({filteredUsers.length})</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute right-3 top-3 text-brand-muted" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="بحث بالاسم أو البريد..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-brand-main border border-white/10 rounded-lg px-10 py-2.5 text-white text-sm focus:border-brand-gold outline-none"
                                />
                            </div>
                            <button 
                                onClick={openAddModal}
                                className="bg-brand-gold text-brand-main font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-brand-goldHover transition-colors"
                            >
                                <Plus size={18} />
                                <span className="hidden md:inline">إضافة عضو</span>
                            </button>
                            <button onClick={loadData} className="bg-brand-main border border-white/10 p-2.5 rounded-lg text-brand-muted hover:text-white hover:border-brand-gold" title="تحديث البيانات">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-brand-main/50 text-brand-muted text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">الطالب</th>
                                    <th className="px-6 py-4">الحالة</th>
                                    <th className="px-6 py-4">تاريخ الانتهاء</th>
                                    <th className="px-6 py-4">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-brand-muted">لا توجد نتائج مطابقة</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const isExpired = u.subscriptionTier === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) < new Date();
                                        return (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-bold text-sm">{u.name}</div>
                                                            <div className="text-xs text-brand-muted">{u.email}</div>
                                                            <div className="text-xs text-brand-muted font-mono">{u.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                        u.subscriptionTier === 'pro' && !isExpired
                                                        ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' 
                                                        : 'bg-gray-700/30 text-gray-400 border-gray-700'
                                                    }`}>
                                                        {u.subscriptionTier === 'pro' && !isExpired ? 'مشترك نشط' : 'غير مشترك'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono">
                                                    {u.subscriptionTier === 'pro' && u.subscriptionExpiry ? (
                                                        <span className={`${isExpired ? 'text-red-400' : 'text-green-400'} flex items-center gap-1`}>
                                                            <Calendar size={12} />
                                                            {new Date(u.subscriptionExpiry).toLocaleDateString('ar-EG')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-brand-muted">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => openEditModal(u)}
                                                            className="p-2 hover:bg-blue-500/10 rounded-lg text-brand-muted hover:text-blue-400 transition-colors"
                                                            title="تعديل العضو"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-2 hover:bg-red-500/10 rounded-lg text-brand-muted hover:text-red-400 transition-colors"
                                                            title="حذف العضو"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* COURSES TAB */}
            {activeTab === 'courses' && (
                <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white">إدارة الكورسات ({courses.length})</h3>
                        <button 
                            onClick={openAddCourseModal}
                            className="bg-brand-gold text-brand-main font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-brand-goldHover transition-colors"
                        >
                            <Plus size={18} />
                            <span className="hidden md:inline">إضافة كورس</span>
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-brand-main/50 text-brand-muted text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">الكورس</th>
                                    <th className="px-6 py-4">المحاضر</th>
                                    <th className="px-6 py-4">السعر</th>
                                    <th className="px-6 py-4">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 overflow-hidden shrink-0">
                                                    <img src={course.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">{course.title}</div>
                                                    <div className="text-xs text-brand-muted">{course.lessons.length} محاضرات</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-muted">
                                            {course.instructor}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="text-brand-gold font-bold">{course.price} ج.م</span>
                                            {course.originalPrice && <span className="text-brand-muted text-xs line-through mr-2">{course.originalPrice}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => openEditCourseModal(course)}
                                                    className="p-2 hover:bg-blue-500/10 rounded-lg text-brand-muted hover:text-blue-400 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-brand-muted hover:text-red-400 transition-colors"
                                                >
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
                    <div className="bg-brand-card border border-white/5 rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-brand-muted" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">لا توجد طلبات معلقة</h3>
                        <p className="text-brand-muted">يتم حالياً استقبال الطلبات عبر واتساب فقط، استخدم التفعيل اليدوي أعلاه.</p>
                    </div>
                </div>
            )}

        </div>

        {/* --- MODALS --- */}

        {/* Add/Edit Course Modal */}
        {isCourseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-brand-card z-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {editingCourse ? <Edit className="text-brand-gold" size={24} /> : <BookOpen className="text-brand-gold" size={24} />}
                            {editingCourse ? 'تعديل الكورس' : 'إضافة كورس جديد'}
                        </h3>
                        <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">عنوان الكورس</label>
                            <input 
                                required type="text" 
                                value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                placeholder="مثال: علم التشريح - Anatomy"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">المحاضر</label>
                            <input 
                                required type="text" 
                                value={courseFormData.instructor} onChange={e => setCourseFormData({...courseFormData, instructor: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                placeholder="د. أحمد محمد"
                            />
                        </div>
                         <div>
                            <label className="block text-sm text-brand-muted mb-1">المادة (Subject)</label>
                            <input 
                                required type="text" 
                                value={courseFormData.subject} onChange={e => setCourseFormData({...courseFormData, subject: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                placeholder="Anatomy"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">السعر (ج.م)</label>
                                <input 
                                    required type="number" 
                                    value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: Number(e.target.value)})}
                                    className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">السعر الأصلي</label>
                                <input 
                                    type="number" 
                                    value={courseFormData.originalPrice} onChange={e => setCourseFormData({...courseFormData, originalPrice: Number(e.target.value)})}
                                    className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm text-brand-muted mb-1">رابط الصورة</label>
                            <div className="flex gap-2">
                                <input 
                                    required type="text" 
                                    value={courseFormData.image} onChange={e => setCourseFormData({...courseFormData, image: e.target.value})}
                                    className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                    placeholder="https://example.com/image.jpg"
                                />
                                <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {courseFormData.image ? <img src={courseFormData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-brand-muted" />}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors flex items-center justify-center gap-2 mt-4">
                            <Save size={18} /> {editingCourse ? 'حفظ التعديلات' : 'إضافة الكورس'}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Add User Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-scale-up">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserPlus className="text-brand-gold" size={24} />
                            إضافة عضو جديد
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-brand-muted hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleAddUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">الاسم بالكامل</label>
                            <input 
                                required type="text" 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">البريد الإلكتروني</label>
                            <input 
                                required type="email" 
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">رقم الهاتف</label>
                            <input 
                                required type="text" 
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                            />
                        </div>
                        
                        <div className="border-t border-white/5 pt-4">
                            <label className="block text-sm font-bold text-white mb-2">الصلاحيات والاشتراك</label>
                            <div className="flex gap-2 mb-4">
                                <button type="button" onClick={() => setFormData({...formData, subscriptionTier: 'free'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.subscriptionTier === 'free' ? 'bg-brand-main border-white text-white' : 'border-white/10 text-brand-muted'}`}>مجاني</button>
                                <button type="button" onClick={() => setFormData({...formData, subscriptionTier: 'pro'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main border-brand-gold' : 'border-white/10 text-brand-muted'}`}>مدفوع (PRO)</button>
                            </div>
                            
                            {formData.subscriptionTier === 'pro' && (
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">تاريخ انتهاء الاشتراك</label>
                                    <input 
                                        type="date" required
                                        value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                        className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                    />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors flex items-center justify-center gap-2 mt-4">
                            <Save size={18} /> حفظ العضو
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-scale-up">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Edit className="text-brand-gold" size={20} />
                            تعديل بيانات العضو
                        </h3>
                        <button onClick={() => setEditingUser(null)} className="text-brand-muted hover:text-white"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                        <div className="bg-brand-main/50 p-3 rounded-lg border border-white/5 mb-4">
                            <p className="text-xs text-brand-muted">يتم تعديل الحساب:</p>
                            <p className="text-white font-bold text-sm">{editingUser.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-brand-muted mb-1">الاسم بالكامل</label>
                            <input 
                                required type="text" 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">رقم الهاتف</label>
                            <input 
                                required type="text" 
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                            />
                        </div>
                        
                        <div className="border-t border-white/5 pt-4 bg-brand-main/20 p-4 rounded-xl">
                            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                                {formData.subscriptionTier === 'pro' ? <Unlock size={16} className="text-green-500" /> : <Lock size={16} className="text-red-400" />}
                                حالة الاشتراك
                            </label>
                            <div className="flex gap-2 mb-4">
                                <button type="button" onClick={() => setFormData({...formData, subscriptionTier: 'free'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.subscriptionTier === 'free' ? 'bg-gray-700 border-gray-600 text-white' : 'border-white/10 text-brand-muted hover:bg-white/5'}`}>إلغاء الاشتراك (مجاني)</button>
                                <button type="button" onClick={() => setFormData({...formData, subscriptionTier: 'pro'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${formData.subscriptionTier === 'pro' ? 'bg-green-600 border-green-500 text-white' : 'border-white/10 text-brand-muted hover:bg-white/5'}`}>تفعيل (مدفوع)</button>
                            </div>
                            
                            {formData.subscriptionTier === 'pro' && (
                                <div className="animate-fade-in">
                                    <label className="block text-xs text-brand-muted mb-1">تاريخ انتهاء الصلاحية</label>
                                    <input 
                                        type="date" required
                                        value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                        className="w-full bg-brand-main border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold outline-none" 
                                    />
                                    <p className="text-[10px] text-brand-muted mt-2 text-center">سيتمكن الطالب من الوصول لجميع الكورسات حتى هذا التاريخ</p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl hover:bg-brand-goldHover transition-colors flex items-center justify-center gap-2 mt-2">
                            <Save size={18} /> حفظ التعديلات
                        </button>
                    </form>
                </div>
            </div>
        )}

    </div>
  );
};