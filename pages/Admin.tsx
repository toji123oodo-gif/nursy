
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, Course, Lesson, ContentItem, ActivationCode } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Trash2, Edit, BookOpen, 
  DollarSign, UserCheck, UserPlus, 
  Plus, Save, X, 
  Layout, BarChart3, 
  Zap, Bell, CreditCard, UserCog,
  Monitor, Smartphone, Key, Ticket, 
  ChevronRight, Play, FileText, PlusCircle, Trash,
  Layers, Video, FileDown, ExternalLink, Copy, Check,
  AlertCircle, Download, Filter, Clock, ArrowUpRight, Activity,
  MessageCircle, Globe, HardDrive, Calendar, MousePointer2,
  HelpCircle, Sparkles, User as UserIcon
} from 'lucide-react';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [codeFilter, setCodeFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Data States
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  // Modals States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Stats Logic
  const stats = useMemo(() => {
    const activePro = allUsers.filter(u => u.subscriptionTier === 'pro').length;
    const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
    return {
      totalStudents: allUsers.length,
      activePro,
      totalIncome: activePro * 50, // القيمة الافتراضية للاشتراك
      totalCourses: courses.length,
      totalLessons
    };
  }, [allUsers, courses]);

  // Real-time Data Listeners
  useEffect(() => {
    if (!db) return;
    
    // Listen for users
    const unsubUsers = db.collection("users").orderBy("lastSeen", "desc").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });

    // Listen for codes
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(200).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });

    // Listen for activity logs
    const unsubActivity = db.collection("admin_notifications").orderBy("timestamp", "desc").limit(10).onSnapshot(s => {
      setRecentActivities(s.docs.map(d => ({id: d.id, ...d.data()})));
    });

    return () => { unsubUsers(); unsubCodes(); unsubActivity(); };
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Student Management Logic ---
  const handleUpdateUser = async () => {
    if (!editingUser || !db) return;
    try {
        await db.collection("users").doc(editingUser.id).update(editingUser);
        setIsUserModalOpen(false);
        showNotification('success', 'تم تحديث بيانات الطالب وحالته بنجاح');
    } catch (e) {
        showNotification('error', 'فشل تحديث بيانات الطالب');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف الطالب نهائياً؟')) return;
    try {
        await db.collection("users").doc(id).delete();
        showNotification('success', 'تم حذف حساب الطالب بنجاح');
    } catch (e) {
        showNotification('error', 'حدث خطأ أثناء الحذف');
    }
  };

  const toggleUserTier = (tier: 'free' | 'pro') => {
    if (!editingUser) return;
    const expiry = tier === 'pro' 
        ? (editingUser.subscriptionExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
        : null;
    
    setEditingUser({
        ...editingUser,
        subscriptionTier: tier,
        subscriptionExpiry: expiry as any
    });
  };

  const toggleUserRole = (role: 'student' | 'admin') => {
    if (!editingUser) return;
    if (role === 'admin' && !window.confirm('تحذير أمان: هل أنت متأكد من ترقية هذا المستخدم إلى "مدير"؟ سيكون له صلاحيات كاملة للتحكم في المنصة.')) return;
    setEditingUser({
      ...editingUser,
      role: role
    });
  };

  // --- Activation Codes Logic ---
  const generateCodes = async (count: number, days: number) => {
    if (!db) return;
    try {
      const batch = db.batch();
      for (let i = 0; i < count; i++) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const ref = db.collection("activation_codes").doc();
        batch.set(ref, {
          id: ref.id,
          code,
          isUsed: false,
          days,
          createdAt: new Date().toISOString()
        });
      }
      await batch.commit();
      showNotification('success', `تم إنشاء ${count} كود بنجاح`);
    } catch (e) {
      showNotification('error', 'فشل إنشاء الأكواد');
    }
  };

  const exportCodesToText = () => {
    const unused = activationCodes.filter(c => !c.isUsed).map(c => `${c.code} (${c.days} يوم)`).join('\n');
    const blob = new Blob([unused], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `أكواد_نيرسي_${new Date().toLocaleDateString('ar-EG')}.txt`;
    a.click();
    showNotification('success', 'تم تصدير ملف الأكواد بنجاح');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --- Content Management Logic ---
  const handleSaveCourse = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) {
        await updateCourse(editingCourse as Course);
      } else {
        const newId = 'c' + Date.now();
        await addCourse({ ...editingCourse, id: newId } as Course);
      }
      setIsCourseModalOpen(false);
      showNotification('success', 'تم حفظ الكورس بنجاح');
    } catch (e) {
      showNotification('error', 'فشل حفظ الكورس');
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
    setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newLesson] }));
  };

  const addContentToLesson = (lessonIdx: number, type: 'video' | 'pdf') => {
    const newContent: ContentItem = { 
        id: 'cnt' + Date.now(), 
        type, 
        title: type === 'video' ? 'فيديو شرح' : 'ملخص PDF', 
        url: '' 
    };
    const newLessons = [...(editingCourse?.lessons || [])];
    newLessons[lessonIdx].contents = [...(newLessons[lessonIdx].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: newLessons }));
  };

  // Filters
  const filteredUsers = allUsers.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (u.phone || '').includes(searchTerm);
    const matchFilter = userFilter === 'all' || u.subscriptionTier === userFilter;
    return matchSearch && matchFilter;
  });

  const filteredCodes = activationCodes.filter(c => {
    if (codeFilter === 'used') return c.isUsed;
    if (codeFilter === 'unused') return !c.isUsed;
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="text-right">
            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Nursy <span className="text-brand-gold">Admin</span></h1>
            <p className="text-brand-muted text-sm font-bold flex items-center gap-2">
                <ShieldAlert size={16} className="text-brand-gold" /> لوحة التحكم المركزية للمنصة
            </p>
          </div>
          <div className="flex bg-brand-card p-2 rounded-[2rem] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
            {[
              {id: 'overview', label: 'الرئيسية', icon: Layout},
              {id: 'users', label: 'الطلاب', icon: Users},
              {id: 'courses', label: 'المحتوى', icon: BookOpen},
              {id: 'codes', label: 'الأكواد', icon: Key}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-gold text-brand-main shadow-glow scale-105' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TABS CONTENT --- */}

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي الطلاب', val: stats.totalStudents, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: '+12%' },
                { label: 'مشتركين PRO', val: stats.activePro, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10', trend: 'Active' },
                { label: 'عدد المحاضرات', val: stats.totalLessons, icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'Full' },
                { label: 'دخل متوقع (ج.م)', val: stats.totalIncome, icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: 'EGP' },
              ].map((s, i) => (
                <div key={i} className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 group hover:border-brand-gold/30 transition-all shadow-xl relative overflow-hidden">
                  <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    <s.icon size={28} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                        <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
                        <h3 className="text-4xl font-black text-white">{s.val}</h3>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.color} bg-white/5 border border-white/5`}>{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Live Activity Feed */}
               <div className="lg:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><Activity className="text-brand-gold" /> آخر النشاطات</h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-main rounded-xl border border-white/5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-brand-muted font-black uppercase">Live Update</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-brand-main rounded-[2rem] border border-white/5 group hover:border-brand-gold/20 transition-all">
                        <div className="w-12 h-12 bg-brand-gold/5 text-brand-gold rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/10">
                          {act.type === 'support' ? <MessageCircle size={20} /> : <Zap size={20} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-bold leading-relaxed">{act.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] text-brand-muted flex items-center gap-1.5 font-mono"><Clock size={12} /> {new Date(act.timestamp).toLocaleString('ar-EG')}</span>
                             {act.userName && <span className="text-[10px] text-brand-gold font-black bg-brand-gold/5 px-3 py-0.5 rounded-full">بواسطة: {act.userName}</span>}
                          </div>
                        </div>
                        <ArrowUpRight size={18} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {recentActivities.length === 0 && <p className="text-center text-brand-muted py-20 italic">لا توجد نشاطات مسجلة حالياً</p>}
                  </div>
               </div>

               {/* Control Center */}
               <div className="space-y-8">
                  <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8">إجراءات سريعة</h3>
                    <div className="space-y-4">
                       <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="w-full bg-brand-gold text-brand-main font-black p-5 rounded-2xl flex items-center justify-between shadow-glow hover:scale-[1.03] transition-all">
                          <span>إضافة كورس دراسي</span>
                          <PlusCircle size={22} />
                       </button>
                       <button onClick={() => setActiveTab('codes')} className="w-full bg-white/5 text-white font-black p-5 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-brand-gold/10 hover:text-brand-gold transition-all">
                          <span>توليد أكواد تفعيل</span>
                          <Ticket size={22} />
                       </button>
                       <button onClick={() => setActiveTab('users')} className="w-full bg-white/5 text-white font-black p-5 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-brand-gold/10 hover:text-brand-gold transition-all">
                          <span>إدارة الطلاب</span>
                          <Users size={22} />
                       </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-gold/20 to-transparent border border-brand-gold/20 rounded-[3rem] p-10 relative overflow-hidden">
                     <HelpCircle className="absolute -bottom-6 -left-6 text-brand-gold opacity-10" size={120} />
                     <h4 className="text-brand-gold font-black text-lg mb-4 flex items-center gap-2"><Sparkles size={20} /> نصيحة الإدارة</h4>
                     <p className="text-brand-muted text-xs leading-relaxed font-bold">
                        راقب سجل النشاطات باستمرار للتأكد من عدم وجود تسجيلات دخول مشبوهة من أجهزة متعددة لنفس الطالب.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- USERS --- */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-brand-card rounded-[3.5rem] border border-white/5 p-10 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-12">
                <div className="relative w-full lg:w-1/3">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                  <input type="text" placeholder="ابحث بالاسم أو رقم الهاتف..." className="w-full bg-brand-main border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-brand-gold transition-all shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex bg-brand-main p-2 rounded-2xl border border-white/5">
                   {['all', 'pro', 'free'].map(f => (
                     <button key={f} onClick={() => setUserFilter(f as any)} className={`px-10 py-3.5 rounded-xl text-xs font-black transition-all ${userFilter === f ? 'bg-brand-gold text-brand-main shadow-md' : 'text-brand-muted hover:text-white'}`}>
                        {f === 'all' ? 'الكل' : f === 'pro' ? 'PRO' : 'FREE'}
                     </button>
                   ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-[2.5rem] border border-white/5">
                <table className="w-full text-right">
                  <thead className="bg-brand-main/50 text-brand-muted text-[11px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-6">الطالب</th>
                      <th className="px-8 py-6">التواصل</th>
                      <th className="px-8 py-6">الجهاز / الموقع</th>
                      <th className="px-8 py-6">الحالة</th>
                      <th className="px-8 py-6 text-left">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-gold/30 to-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-black text-xl shadow-lg">{u.name?.charAt(0) || 'S'}</div>
                            <div>
                                <div className="font-black text-white text-base mb-1 flex items-center gap-2">
                                  {u.name}
                                  {u.role === 'admin' && <ShieldAlert size={14} className="text-red-500" />}
                                </div>
                                <div className="text-[10px] text-brand-muted font-mono opacity-50 tracking-tighter">{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-white text-xs font-black flex items-center gap-3"><Smartphone size={14} className="text-brand-muted" /> {u.phone}</div>
                          <div className="text-[10px] text-brand-muted mt-2 flex items-center gap-3 font-mono opacity-70"><Globe size={14} className="text-brand-muted" /> {u.email}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3 text-brand-muted text-xs font-bold">
                            <Monitor size={16} /> {u.lastDevice || 'غير معروف'}
                          </div>
                          <div className="text-[10px] mt-2 text-brand-gold/60 flex items-center gap-3 font-bold">
                            <Clock size={14} /> {u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG') : 'قديماً جداً'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-white/5 text-brand-muted border-white/10'}`}>
                              {u.subscriptionTier === 'pro' ? 'PREMIUM MEMBER' : 'FREE STUDENT'}
                            </span>
                            {u.role === 'admin' && (
                              <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/20 self-start flex items-center gap-1">
                                <ShieldAlert size={10} /> ADMIN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-left space-x-3 space-x-reverse opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => {setEditingUser(u); setIsUserModalOpen(true);}} className="p-3 bg-brand-gold text-brand-main rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"><Edit size={20}/></button>
                          <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"><Trash2 size={20}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- COURSES --- */}
        {activeTab === 'courses' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black text-white tracking-tighter">إدارة المحتوى</h2>
                <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-10 py-5 rounded-[1.5rem] flex items-center gap-3 shadow-glow hover:scale-105 transition-all">
                  <PlusCircle size={24} /> كورس جديد
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-brand-gold/30 transition-all shadow-2xl flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent"></div>
                    <div className="absolute top-6 right-6 bg-brand-main/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 text-[10px] font-black text-brand-gold uppercase tracking-widest">
                      {course.subject}
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-3">
                        <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit size={24}/></button>
                        <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash size={24}/></button>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <h4 className="text-white font-black text-2xl mb-6 leading-tight group-hover:text-brand-gold transition-colors">{course.title}</h4>
                    <div className="mt-auto flex items-center gap-6 text-brand-muted text-[11px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-3 bg-brand-main px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner"><Layers size={16} className="text-brand-gold" /> {course.lessons?.length || 0} فصل</span>
                        <span className="flex items-center gap-3 bg-brand-main px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner"><DollarSign size={16} className="text-brand-gold" /> {course.price} ج.م</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CODES --- */}
        {activeTab === 'codes' && (
          <div className="space-y-12 animate-fade-in">
            <div className="bg-brand-card p-14 rounded-[4rem] border border-brand-gold/20 shadow-2xl relative overflow-hidden group">
               <Ticket className="absolute -top-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-brand-gold" size={300} />
               <div className="relative z-10">
                 <h3 className="text-3xl font-black text-white mb-12 flex items-center gap-4 tracking-tight"><Ticket className="text-brand-gold" size={36} /> مولد أكواد التفعيل</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-end">
                    <div className="space-y-4">
                      <label className="text-[10px] text-brand-muted font-black block pr-2 uppercase tracking-[0.2em]">كمية الأكواد</label>
                      <input id="code-count" type="number" defaultValue={50} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-brand-gold outline-none text-2xl font-black shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] text-brand-muted font-black block pr-2 uppercase tracking-[0.2em]">المدة باليوم</label>
                      <input id="code-days" type="number" defaultValue={30} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5 text-white focus:border-brand-gold outline-none text-2xl font-black shadow-inner" />
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        onClick={() => {
                          const c = Number((document.getElementById('code-count') as HTMLInputElement).value);
                          const d = Number((document.getElementById('code-days') as HTMLInputElement).value);
                          generateCodes(c, d);
                        }}
                        className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-3xl shadow-glow hover:scale-[1.02] transition-all text-xl"
                      >إنشاء الأكواد المحددة الآن</button>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="bg-brand-card rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
               <div className="p-10 border-b border-white/5 bg-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
                  <div className="text-right w-full lg:w-auto">
                    <h4 className="text-white font-black text-2xl mb-2 tracking-tight">سجل أكواد النظام</h4>
                    <p className="text-brand-muted text-[11px] font-black uppercase tracking-widest">إجمالي الأكواد: {activationCodes.length}</p>
                  </div>
                  <div className="flex flex-wrap gap-5 items-center justify-center">
                      <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5">
                        {['all', 'unused', 'used'].map(f => (
                          <button key={f} onClick={() => setCodeFilter(f as any)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${codeFilter === f ? 'bg-brand-gold text-brand-main shadow-md' : 'text-brand-muted hover:text-white'}`}>
                              {f === 'all' ? 'الكل' : f === 'unused' ? 'متاح' : 'مستعمل'}
                          </button>
                        ))}
                      </div>
                      <button onClick={exportCodesToText} className="flex items-center gap-3 bg-brand-gold/10 text-brand-gold px-10 py-4.5 rounded-2xl font-black text-[11px] border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-main transition-all shadow-glow">
                        <Download size={18} /> تصدير للمطبعة (TXT)
                      </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                    <thead className="bg-brand-main/50 text-brand-muted text-[11px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-10 py-6">الكود</th>
                        <th className="px-10 py-6">المدة</th>
                        <th className="px-10 py-6">الحالة</th>
                        <th className="px-10 py-6">الإنشاء</th>
                        <th className="px-10 py-6 text-left">تحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCodes.map(code => (
                        <tr key={code.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-10 py-6 font-mono font-black text-brand-gold text-2xl tracking-[0.2em]">{code.code}</td>
                          <td className="px-10 py-6 text-white text-xs font-black">{code.days} يوم</td>
                          <td className="px-10 py-6">
                            {code.isUsed ? (
                                <div className="inline-flex items-center gap-3 text-red-400 text-[10px] font-black uppercase bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                                    <XCircle size={14} /> مستعمل
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-3 text-green-400 text-[10px] font-black uppercase bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                    <CheckCircle size={14} /> متاح للبيع
                                </div>
                            )}
                          </td>
                          <td className="px-10 py-6 text-brand-muted text-[10px] font-mono opacity-60">{new Date(code.createdAt).toLocaleDateString('ar-EG')}</td>
                          <td className="px-10 py-6 text-left">
                            <button onClick={() => copyToClipboard(code.code)} className={`p-4 rounded-2xl transition-all shadow-md ${copiedCode === code.code ? 'bg-green-500 text-white' : 'bg-brand-main text-brand-muted hover:text-brand-gold border border-white/10'}`}>
                                {copiedCode === code.code ? <Check size={20}/> : <Copy size={20}/>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
                 {filteredCodes.length === 0 && <div className="p-32 text-center text-brand-muted font-bold italic opacity-40">لا توجد سجلات أكواد مطابقة</div>}
               </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODALS --- */}

      {/* Advanced Course Modal */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-xl" onClick={() => setIsCourseModalOpen(false)}></div>
          <div className="relative w-full max-w-5xl bg-brand-card border border-white/10 rounded-[4rem] shadow-2xl overflow-hidden animate-scale-up h-[92vh] flex flex-col">
            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-3xl font-black text-white tracking-tighter">محرر المحتوى الدراسي</h3>
               <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-3 rounded-2xl transition-all"><X size={32} /></button>
            </div>
            
            <div className="p-12 overflow-y-auto flex-1 space-y-16 no-scrollbar">
               {/* 1. Basic Information */}
               <section className="space-y-10">
                  <h4 className="text-brand-gold text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 border-b border-brand-gold/20 pb-4"><Layout size={18}/> البيانات الأساسية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black mr-2 uppercase tracking-widest">اسم الكورس بالكامل</label>
                        <input type="text" placeholder="مثلاً: مادة علم التشريح - الترم الأول" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5.5 text-white focus:border-brand-gold outline-none font-black text-xl shadow-inner" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black mr-2 uppercase tracking-widest">اسم المحاضر / الدكتور</label>
                        <input type="text" placeholder="مثلاً: د. أحمد كمال" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5.5 text-white focus:border-brand-gold outline-none font-black text-xl shadow-inner" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black mr-2 uppercase tracking-widest">سعر الاشتراك (ج.م)</label>
                        <input type="number" placeholder="0" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5.5 text-white focus:border-brand-gold outline-none font-black text-2xl shadow-inner" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black mr-2 uppercase tracking-widest">المادة الدراسية</label>
                        <input type="text" placeholder="مثلاً: Anatomy" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5.5 text-white focus:border-brand-gold outline-none font-black text-xl shadow-inner" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] text-brand-muted font-black mr-2 uppercase tracking-widest">رابط صورة الغلاف</label>
                        <input type="text" placeholder="https://..." value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5.5 text-white focus:border-brand-gold outline-none font-mono text-sm shadow-inner" />
                    </div>
                  </div>
               </section>

               {/* 2. Lessons Builder */}
               <section className="space-y-12">
                  <div className="flex justify-between items-center border-b border-brand-gold/20 pb-4">
                    <h4 className="text-brand-gold text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4"><Layers size={18}/> المحاضرات والفصول</h4>
                    <button onClick={addLesson} className="bg-brand-gold text-brand-main px-10 py-4.5 rounded-2xl text-[11px] font-black shadow-glow hover:scale-105 transition-all flex items-center gap-3"><Plus size={20} /> إضافة محاضرة جديدة</button>
                  </div>
                  
                  <div className="space-y-12">
                    {editingCourse.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="bg-brand-main p-12 rounded-[3.5rem] border border-white/5 space-y-12 group relative overflow-hidden transition-all hover:border-brand-gold/20 shadow-xl">
                        <div className="absolute top-0 right-0 w-3 h-full bg-brand-gold opacity-10"></div>
                        <div className="flex justify-between items-center gap-10">
                          <div className="flex-1 flex items-center gap-10">
                            <span className="w-16 h-16 rounded-3xl bg-brand-gold text-brand-main flex items-center justify-center font-black text-2xl shadow-xl shrink-0 transition-transform group-hover:scale-110">{lIdx + 1}</span>
                            <div className="flex-1 space-y-3">
                                <label className="text-[9px] text-brand-muted font-black uppercase tracking-[0.3em]">عنوان المحاضرة / الفصل</label>
                                <input type="text" value={lesson.title} onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    newLessons[lIdx].title = e.target.value;
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                }} className="bg-transparent border-b border-white/10 text-white font-black outline-none text-4xl flex-1 focus:border-brand-gold pb-4 w-full transition-all" />
                            </div>
                          </div>
                          <button onClick={() => {
                            if(window.confirm('حذف هذه المحاضرة نهائياً؟')) {
                                const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                                setEditingCourse({...editingCourse, lessons: newLessons});
                            }
                          }} className="p-5 text-red-400 bg-red-400/5 hover:bg-red-400/20 rounded-3xl transition-all shadow-inner"><Trash2 size={32}/></button>
                        </div>

                        {/* Contents Builder */}
                        <div className="pr-24 space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-0.5 bg-brand-gold/10 flex-1"></div>
                                <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.5em]">محتويات الفصل</span>
                                <div className="h-0.5 bg-brand-gold/10 flex-1"></div>
                            </div>
                            
                            <div className="grid gap-6">
                                {lesson.contents?.map((content, cIdx) => (
                                    <div key={content.id} className="flex flex-col md:flex-row gap-8 items-center bg-brand-card/50 p-8 rounded-[2.5rem] border border-white/5 hover:border-brand-gold/30 transition-all shadow-2xl relative">
                                        <div className="flex items-center gap-5 bg-brand-main px-6 py-3 rounded-2xl border border-white/5 shrink-0 shadow-inner">
                                            {content.type === 'video' ? <Video size={20} className="text-brand-gold"/> : <FileDown size={20} className="text-brand-gold"/>}
                                            <span className="text-[10px] font-black uppercase text-white tracking-widest">{content.type}</span>
                                        </div>
                                        <div className="flex-1 w-full space-y-3">
                                            <input type="text" placeholder="عنوان المحتوى (مثلاً: الفيديو الأول)" value={content.title} onChange={(e) => {
                                                const newLessons = [...(editingCourse.lessons || [])];
                                                newLessons[lIdx].contents[cIdx].title = e.target.value;
                                                setEditingCourse({...editingCourse, lessons: newLessons});
                                            }} className="bg-brand-main/40 border border-white/5 rounded-xl px-6 py-4 text-xs text-white w-full outline-none focus:border-brand-gold font-black transition-all" />
                                        </div>
                                        <div className="flex-[2] w-full space-y-3">
                                            <input type="text" placeholder="رابط المحتوى (YouTube URL or PDF URL)" value={content.url} onChange={(e) => {
                                                const newLessons = [...(editingCourse.lessons || [])];
                                                newLessons[lIdx].contents[cIdx].url = e.target.value;
                                                setEditingCourse({...editingCourse, lessons: newLessons});
                                            }} className="bg-brand-main/40 border border-white/5 rounded-xl px-6 py-4 text-xs text-white w-full outline-none focus:border-brand-gold font-mono transition-all" />
                                        </div>
                                        <button onClick={() => {
                                            const newLessons = [...(editingCourse.lessons || [])];
                                            newLessons[lIdx].contents = newLessons[lIdx].contents.filter((_, i) => i !== cIdx);
                                            setEditingCourse({...editingCourse, lessons: newLessons});
                                        }} className="text-brand-muted hover:text-red-400 p-4 bg-brand-main rounded-2xl hover:bg-red-400/10 transition-all"><X size={20}/></button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-6 pt-10">
                                <button onClick={() => addContentToLesson(lIdx, 'video')} className="bg-brand-gold/10 text-brand-gold px-10 py-5 rounded-[1.5rem] text-[11px] font-black hover:bg-brand-gold hover:text-brand-main transition-all flex items-center gap-4 border border-brand-gold/20 shadow-glow"><Video size={20}/> إضافة فيديو شرح</button>
                                <button onClick={() => addContentToLesson(lIdx, 'pdf')} className="bg-brand-gold/10 text-brand-gold px-10 py-5 rounded-[1.5rem] text-[11px] font-black hover:bg-brand-gold hover:text-brand-main transition-all flex items-center gap-4 border border-brand-gold/20 shadow-glow"><FileDown size={20}/> إضافة ملف PDF</button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>

            <div className="p-12 border-t border-white/5 bg-white/5 backdrop-blur-3xl">
              <button onClick={handleSaveCourse} className="w-full bg-brand-gold text-brand-main font-black py-7 rounded-[2.5rem] shadow-glow hover:scale-[1.01] transition-all text-2xl tracking-tighter">حفظ تعديلات المنهج الدراسي النهائية</button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced User Status Modal */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-xl" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-brand-card border border-white/10 rounded-[4rem] shadow-2xl p-14 animate-scale-up">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-glow"><UserCog size={36} /></div>
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">إدارة حساب الطالب</h3>
                    <p className="text-brand-muted text-sm font-bold">تحديث الرتبة وتاريخ انتهاء الصلاحية</p>
                </div>
            </div>
            
            <div className="space-y-10">
                <div className="space-y-4">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] block pr-2">اسم الطالب بالكامل</label>
                    <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-brand-gold font-black text-2xl shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] block pr-2">نوع العضوية</label>
                        <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/10">
                            <button onClick={() => toggleUserTier('free')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all ${editingUser.subscriptionTier === 'free' ? 'bg-white/10 text-white border border-white/10' : 'text-brand-muted hover:text-white'}`}>FREE</button>
                            <button onClick={() => toggleUserTier('pro')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all ${editingUser.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>PRO / PREMIUM</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] block pr-2">رتبة الصلاحية</label>
                        <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/10">
                            <button onClick={() => toggleUserRole('student')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${(!editingUser.role || editingUser.role === 'student') ? 'bg-white/10 text-white border border-white/10' : 'text-brand-muted hover:text-white'}`}>
                              <UserIcon size={14} /> طالب
                            </button>
                            <button onClick={() => toggleUserRole('admin')} className={`flex-1 py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${editingUser.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'text-brand-muted hover:text-white'}`}>
                              <ShieldAlert size={14} /> مدير (Admin)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                      <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] block pr-2">آخر جهاز مستخدم</label>
                      <div className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3 text-brand-gold">
                          <Monitor size={18} />
                          <span className="text-sm font-black">{editingUser.lastDevice || 'غير معروف'}</span>
                      </div>
                  </div>
                </div>

                {editingUser.subscriptionTier === 'pro' && (
                  <div className="space-y-4 animate-scale-up">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] block pr-2">تاريخ انتهاء الاشتراك</label>
                    <div className="relative">
                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                        <input 
                            type="datetime-local" 
                            value={editingUser.subscriptionExpiry ? new Date(editingUser.subscriptionExpiry).toISOString().slice(0, 16) : ''} 
                            onChange={e => setEditingUser({...editingUser, subscriptionExpiry: new Date(e.target.value).toISOString()})}
                            className="w-full bg-brand-main border border-white/10 rounded-2xl px-16 py-5 text-white focus:border-brand-gold outline-none font-black text-xl shadow-inner" 
                        />
                    </div>
                  </div>
                )}

                <div className="pt-10 flex gap-8">
                    <button onClick={handleUpdateUser} className="flex-[2] bg-brand-gold text-brand-main font-black py-6 rounded-3xl shadow-glow hover:scale-[1.02] transition-all text-xl">تحديث كافة البيانات</button>
                    <button onClick={() => setIsUserModalOpen(false)} className="flex-1 bg-white/5 text-brand-muted font-black py-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all text-xl">إلغاء</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Notification */}
      {notification && (
        <div className={`fixed bottom-12 left-12 z-[250] px-12 py-7 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-fade-in-up border backdrop-blur-3xl ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          <div className="flex items-center gap-6 font-black text-xl tracking-tight">
            {notification.type === 'success' ? <CheckCircle size={32} className="text-green-500" /> : <AlertCircle size={32} className="text-red-500" />}
            {notification.text}
          </div>
        </div>
      )}
    </div>
  );
};
