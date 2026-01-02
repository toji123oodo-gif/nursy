
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, Course, Lesson, ContentItem, ActivationCode, Quiz, Question } from '../types';
import { 
  Search, CheckCircle, XCircle, ShieldAlert, Users, 
  Trash2, Edit, BookOpen, 
  DollarSign, UserCheck, PlusCircle, Trash,
  Layers, Video, FileDown, Copy, Check,
  AlertCircle, Download, Clock, ArrowUpRight, Activity,
  MessageCircle, Globe, Ticket, Calendar, 
  HelpCircle, Sparkles, User as UserIcon, Layout, Plus, X, Brain, Save, 
  ChevronRight, BarChart3, GraduationCap, Laptop, History, Award
} from 'lucide-react';
import { db } from '../firebase';

export const Admin: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'codes' | 'exams'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  
  const [codeCount, setCodeCount] = useState(10);
  const [codeDays, setCodeDays] = useState(30);

  // Statistics Calculation
  const stats = useMemo(() => {
    const activePro = allUsers.filter(u => u.subscriptionTier === 'pro').length;
    const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
    const totalQuizzes = courses.reduce((acc, c) => acc + c.lessons.filter(l => l.quiz).length, 0);
    return {
      totalStudents: allUsers.length,
      activePro,
      totalIncome: activePro * 50,
      totalCourses: courses.length,
      totalLessons,
      totalQuizzes
    };
  }, [allUsers, courses]);

  // Firestore Data Sync
  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").orderBy("lastSeen", "desc").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(100).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    const unsubActivity = db.collection("admin_notifications").orderBy("timestamp", "desc").limit(10).onSnapshot(s => {
      setRecentActivities(s.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => { unsubUsers(); unsubCodes(); unsubActivity(); };
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف الطالب نهائياً؟')) return;
    try { await db.collection("users").doc(id).delete(); showNotification('success', 'تم حذف حساب الطالب'); }
    catch (e) { showNotification('error', 'فشل حذف الطالب'); }
  };

  const toggleUserTier = async (u: User) => {
    const newTier = u.subscriptionTier === 'pro' ? 'free' : 'pro';
    try {
      await db.collection("users").doc(u.id).update({ subscriptionTier: newTier });
      showNotification('success', `تم التحديث لـ ${newTier}`);
    } catch (e) { showNotification('error', 'فشل التحديث'); }
  };

  const generateCodes = async () => {
    if (!db) return;
    try {
      const batch = db.batch();
      for (let i = 0; i < codeCount; i++) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const ref = db.collection("activation_codes").doc();
        batch.set(ref, { id: ref.id, code, isUsed: false, days: codeDays, createdAt: new Date().toISOString() });
      }
      await batch.commit();
      showNotification('success', 'تم توليد الأكواد بنجاح');
    } catch (e) { showNotification('error', 'فشل توليد الأكواد'); }
  };

  const handleSaveCourse = async () => {
    if (!editingCourse?.title) return;
    try {
      if (editingCourse.id) { await updateCourse(editingCourse as Course); } 
      else { await addCourse({ ...editingCourse, id: 'c' + Date.now(), lessons: editingCourse.lessons || [] } as Course); }
      setIsCourseModalOpen(false);
      showNotification('success', 'تم حفظ التغييرات');
    } catch (e) { showNotification('error', 'فشل الحفظ'); }
  };

  // UI Components
  const SidebarItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === id ? 'bg-brand-gold text-brand-main shadow-glow scale-[1.02]' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="text-sm">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="mr-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-main flex">
      {/* 1. Side Navigation (The Sidebar) */}
      <aside className="w-72 bg-brand-card/30 border-l border-white/5 p-6 flex flex-col hidden lg:flex">
        <div className="mb-12 px-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Nursy <span className="text-brand-gold">Admin</span>
          </h2>
          <p className="text-[10px] text-brand-muted font-bold tracking-[0.2em] mt-1">MANAGEMENT SYSTEM</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="overview" label="نظرة عامة" icon={Layout} />
          <SidebarItem id="users" label="إدارة الطلاب" icon={Users} />
          <SidebarItem id="courses" label="إدارة المحتوى" icon={BookOpen} />
          <SidebarItem id="exams" label="الاختبارات والنتائج" icon={Brain} />
          <SidebarItem id="codes" label="أكواد التفعيل" icon={Ticket} />
        </nav>

        <div className="mt-auto p-4 bg-brand-main/50 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold"><ShieldAlert size={20}/></div>
            <div>
              <p className="text-[10px] text-brand-muted font-black uppercase">وضع الحماية</p>
              <p className="text-xs text-white font-bold">نشط بالكامل</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto max-h-screen no-scrollbar">
        
        {/* Top bar for mobile and search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                    {activeTab === 'overview' && 'لوحة المعلومات'}
                    {activeTab === 'users' && 'قاعدة بيانات الطلاب'}
                    {activeTab === 'courses' && 'بناء المناهج'}
                    {activeTab === 'exams' && 'نتائج الاختبارات'}
                    {activeTab === 'codes' && 'إدارة الاشتراكات'}
                </h1>
                <p className="text-brand-muted text-sm font-bold mt-1">تاريخ اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative group hidden sm:block">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث سريع..." 
                    className="bg-brand-card border border-white/5 rounded-2xl pr-12 pl-6 py-3 text-white outline-none focus:border-brand-gold/50 transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="p-3 bg-brand-card rounded-2xl text-brand-muted hover:text-white border border-white/5"><Calendar size={20}/></button>
            </div>
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي الطلاب', val: stats.totalStudents, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                { label: 'المشتركون النشطون', val: stats.activePro, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: 'الاختبارات المنشورة', val: stats.totalQuizzes, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'الأرباح المقدرة', val: stats.totalIncome, icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
              ].map((s, i) => (
                <div key={i} className="bg-brand-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl group hover:border-brand-gold/20 transition-all">
                  <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <s.icon size={28} />
                  </div>
                  <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <h3 className="text-4xl font-black text-white tracking-tighter">{s.val}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
               {/* Recent Activities Section */}
               <div className="xl:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3"><Activity className="text-brand-gold" /> آخر النشاطات</h3>
                  </div>
                  <div className="space-y-6">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-brand-main/50 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                        <div className="w-12 h-12 bg-brand-gold/5 text-brand-gold rounded-2xl flex items-center justify-center border border-brand-gold/10 shrink-0"><Activity size={20} /></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-bold leading-relaxed">{act.message}</p>
                          <p className="text-[10px] text-brand-muted font-bold mt-1 uppercase tracking-widest">{new Date(act.timestamp).toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Quick Tools */}
               <div className="space-y-8">
                  <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
                    <h3 className="text-xl font-black text-white mb-8 relative z-10">اختصارات سريعة</h3>
                    <div className="space-y-4 relative z-10">
                       <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="w-full bg-brand-gold text-brand-main font-black p-5 rounded-2xl flex items-center justify-between shadow-glow hover:scale-[1.03] transition-all">
                          <span>إضافة كورس</span> <PlusCircle size={22} />
                       </button>
                       <button onClick={() => setActiveTab('exams')} className="w-full bg-white/5 text-white font-black p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/10 transition-all">
                          <span>نتائج الطلاب</span> <BarChart3 size={22} />
                       </button>
                    </div>
                  </div>

                  <div className="bg-brand-card rounded-[3rem] border border-white/5 p-8 text-center">
                    <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={32}/></div>
                    <h4 className="text-white font-black mb-2">نسخة النظام v2.5</h4>
                    <p className="text-brand-muted text-xs font-bold leading-relaxed">تم تحسين واجهة المستخدم وتطوير نظام الاختبارات الجديد.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* USERS CONTENT (Improved) */}
        {activeTab === 'users' && (
          <div className="bg-brand-card rounded-[3rem] border border-white/5 p-8 md:p-10 space-y-10 animate-fade-in shadow-2xl">
             <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="relative w-full lg:w-1/2 group">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                  <input type="text" placeholder="ابحث عن طالب بالاسم أو الهاتف..." className="w-full bg-brand-main border border-white/10 rounded-2xl px-14 py-5 text-white outline-none focus:border-brand-gold transition-all shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5">
                    {['all', 'pro', 'free'].map(f => (
                      <button key={f} onClick={() => setUserFilter(f as any)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${userFilter === f ? 'bg-brand-gold text-brand-main shadow-lg' : 'text-brand-muted hover:text-white'}`}>
                        {f === 'all' ? 'الكل' : f.toUpperCase()}
                      </button>
                    ))}
                </div>
             </div>
             
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-right text-white">
                  <thead className="text-brand-muted text-[11px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="p-6">الطالب</th>
                      <th className="p-6">الجهاز</th>
                      <th className="p-6">آخر ظهور</th>
                      <th className="p-6">الاشتراك</th>
                      <th className="p-6 text-left">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allUsers.filter(u => u.name.includes(searchTerm) && (userFilter === 'all' || u.subscriptionTier === userFilter)).map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-all group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black shadow-inner">
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-white">{u.name}</p>
                                    <p className="text-[10px] text-brand-muted font-mono">{u.phone}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                                <Laptop size={14} /> {u.lastDevice || 'Desktop'}
                            </div>
                        </td>
                        <td className="p-6 text-xs text-brand-muted font-mono">
                            {u.lastSeen ? new Date(u.lastSeen).toLocaleDateString('ar-EG') : 'غير متوفر'}
                        </td>
                        <td className="p-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}`}>
                                {u.subscriptionTier}
                            </span>
                        </td>
                        <td className="p-6 text-left">
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => toggleUserTier(u)} className="p-3 bg-white/5 text-brand-gold rounded-xl hover:bg-brand-gold/20 transition-all" title="تغيير الاشتراك"><Sparkles size={18}/></button>
                                <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* COURSES CONTENT (Improved) */}
        {activeTab === 'courses' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">إدارة المحاضرات</h2>
                  <p className="text-brand-muted text-sm font-bold mt-1">يمكنك تعديل الدروس وإضافة الملفات لكل كورس</p>
                </div>
                <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-glow hover:scale-105 transition-all">
                  <PlusCircle size={24} /> كورس جديد
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-brand-gold/40 transition-all shadow-2xl flex flex-col h-full">
                  <div className="h-60 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit size={22}/></button>
                            <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash size={22}/></button>
                        </div>
                        <span className="bg-brand-main/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-brand-gold border border-white/10 uppercase tracking-widest">{course.subject}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-white font-black text-2xl mb-6 leading-tight group-hover:text-brand-gold transition-colors">{course.title}</h4>
                    <div className="mt-auto grid grid-cols-2 gap-4 text-brand-muted text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-3 bg-brand-main/50 px-5 py-3 rounded-2xl border border-white/5">
                            <Layers size={14} className="text-brand-gold" /> {course.lessons?.length || 0} درس
                        </div>
                        <div className="flex items-center gap-3 bg-brand-main/50 px-5 py-3 rounded-2xl border border-white/5">
                            <DollarSign size={14} className="text-brand-gold" /> {course.price} ج.م
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXAMS CONTENT (The New Feature) */}
        {activeTab === 'exams' && (
          <div className="space-y-10 animate-fade-in">
             <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                   <div>
                      <h3 className="text-2xl font-black text-white flex items-center gap-4"><Brain size={32} className="text-brand-gold" /> متابعة أداء الطلاب</h3>
                      <p className="text-brand-muted text-sm font-bold mt-1">تتبع درجات الطلاب في كافة الاختبارات المفعلة</p>
                   </div>
                   <div className="flex items-center gap-4 bg-brand-main p-2 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 px-6 py-2 text-xs font-black text-white border-l border-white/5">
                        <Award size={16} className="text-brand-gold" /> متوسط الدرجات: 84%
                      </div>
                      <div className="flex items-center gap-2 px-6 py-2 text-xs font-black text-white">
                        <CheckCircle size={16} className="text-green-500" /> اختبارات مجتازة: 1,240
                      </div>
                   </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-right text-white">
                      <thead className="text-brand-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                        <tr>
                          <th className="p-6">الطالب</th>
                          <th className="p-6">الكورس / المحاضرة</th>
                          <th className="p-6">آخر درجة</th>
                          <th className="p-6">الحالة</th>
                          <th className="p-6 text-left">التوقيت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {allUsers.filter(u => u.quizGrades && Object.keys(u.quizGrades).length > 0).map(u => (
                          Object.entries(u.quizGrades!).map(([lessonId, score]) => (
                            <tr key={`${u.id}-${lessonId}`} className="hover:bg-white/5 transition-all">
                              <td className="p-6 font-bold">{u.name}</td>
                              <td className="p-6 text-brand-muted text-xs font-bold">
                                {courses.find(c => c.lessons.some(l => l.id === lessonId))?.title || 'محاضرة عامة'}
                              </td>
                              <td className="p-6 font-black text-lg text-brand-gold">{score}%</td>
                              <td className="p-6">
                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${score >= 50 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {score >= 50 ? 'ناجح' : 'راسب'}
                                </span>
                              </td>
                              <td className="p-6 text-left text-brand-muted text-[10px] font-mono">
                                {u.lastSeen ? new Date(u.lastSeen).toLocaleTimeString('ar-EG') : 'غير معروف'}
                              </td>
                            </tr>
                          ))
                        ))}
                        {allUsers.every(u => !u.quizGrades || Object.keys(u.quizGrades).length === 0) && (
                          <tr>
                            <td colSpan={5} className="p-20 text-center text-brand-muted italic">لا توجد بيانات اختبارات حتى الآن</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {/* CODES CONTENT (Improved) */}
        {activeTab === 'codes' && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 bg-brand-card rounded-[3rem] border border-white/5 p-10 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4"><Ticket size={28} className="text-brand-gold" /> توليد أكواد اشتراك</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                     <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] px-2">عدد الأكواد المطلوب إنشاؤها</label>
                        <div className="relative">
                          <PlusCircle size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted" />
                          <input type="number" value={codeCount} onChange={e => setCodeCount(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl px-14 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em] px-2">مدة التفعيل (بالأيام)</label>
                        <div className="relative">
                          <Clock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted" />
                          <input type="number" value={codeDays} onChange={e => setCodeDays(Number(e.target.value))} className="w-full bg-brand-main border border-white/10 rounded-2xl px-14 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                        </div>
                     </div>
                  </div>
                  <button onClick={generateCodes} className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[1.8rem] shadow-glow hover:scale-[1.02] transition-all text-lg tracking-tighter">
                    توليد الأكواد فوراً
                  </button>
               </div>

               <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10 flex flex-col justify-center text-center">
                  <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Ticket size={40}/></div>
                  <h4 className="text-white text-xl font-black mb-4">أكواد غير مستخدمة</h4>
                  <div className="text-6xl font-black text-brand-gold mb-4 tracking-tighter">
                    {activationCodes.filter(c => !c.isUsed).length}
                  </div>
                  <p className="text-brand-muted text-sm font-bold">إجمالي الأكواد المتاحة للبيع حالياً</p>
               </div>
            </div>

            <div className="bg-brand-card rounded-[3rem] border border-white/5 p-10">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-white">أحدث الأكواد المنشأة</h3>
                  <button className="text-brand-gold text-xs font-black uppercase tracking-widest hover:underline">تحميل الكل (Excel)</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activationCodes.slice(0, 20).map(c => (
                    <div key={c.id} className={`p-6 rounded-[1.8rem] border flex items-center justify-between group transition-all ${c.isUsed ? 'bg-red-500/5 border-red-500/10 opacity-40' : 'bg-brand-main border-white/5 hover:border-brand-gold/30 hover:-translate-y-1'}`}>
                      <div>
                        <p className={`font-mono font-black text-xl tracking-wider ${c.isUsed ? 'text-red-400' : 'text-white'}`}>{c.code}</p>
                        <p className="text-[9px] text-brand-muted font-bold mt-1 uppercase tracking-widest">{c.days} يوم - {new Date(c.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                      {!c.isUsed && (
                        <button onClick={() => {navigator.clipboard.writeText(c.code); showNotification('success', 'تم نسخ الكود');}} className="p-3 bg-white/5 text-brand-muted hover:text-brand-gold rounded-xl transition-all opacity-0 group-hover:opacity-100"><Copy size={16}/></button>
                      )}
                      {c.isUsed && <CheckCircle size={18} className="text-red-400" />}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Global Modal for Course / Quiz Builder */}
        {isCourseModalOpen && editingCourse && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-main/95 backdrop-blur-xl" onClick={() => setIsCourseModalOpen(false)}></div>
            <div className="relative w-full max-w-6xl bg-brand-card border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-up h-[92vh] flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-main shadow-glow"><Edit size={28}/></div>
                    <div>
                        <h3 className="text-3xl font-black text-white">محرر المنهج الدراسي</h3>
                        <p className="text-xs text-brand-muted font-bold mt-1 tracking-widest uppercase">إدارة المحتوى والاختبارات التفاعلية</p>
                    </div>
                 </div>
                 <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-4 rounded-2xl transition-all hover:bg-red-500/10 hover:text-red-500"><X size={32} /></button>
              </div>
              
              <div className="p-10 overflow-y-auto flex-1 space-y-12 no-scrollbar scroll-smooth">
                 {/* 1. Basic Info Section */}
                 <section className="bg-brand-main/30 p-10 rounded-[2.5rem] border border-white/5 space-y-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-6 bg-brand-gold rounded-full"></div>
                        <h4 className="text-xl font-black text-white">البيانات الأساسية للكورس</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">اسم الكورس بالكامل</label>
                            <input type="text" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">التخصص / القسم</label>
                            <input type="text" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">سعر الكورس (ج.م)</label>
                            <input type="number" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                        </div>
                    </div>
                 </section>

                 {/* 2. Lessons & Quizzes Builder Section */}
                 <section className="space-y-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <h4 className="text-2xl font-black text-white flex items-center gap-4"><Layers size={24} className="text-brand-gold"/> هيكلة المحاضرات والاختبارات</h4>
                      <button onClick={() => {
                        const newLesson: Lesson = { id: 'l' + Date.now(), title: 'محاضرة جديدة', isLocked: true, contents: [] };
                        setEditingCourse(prev => ({ ...prev, lessons: [...(prev?.lessons || []), newLesson] }));
                      }} className="bg-brand-gold text-brand-main px-10 py-4 rounded-2xl text-sm font-black shadow-glow flex items-center gap-3 hover:scale-105 transition-all">
                        <Plus size={20} /> إضافة محاضرة
                      </button>
                    </div>
                    
                    <div className="space-y-10">
                      {editingCourse.lessons?.map((lesson, lIdx) => (
                        <div key={lesson.id} className="bg-brand-main/50 p-8 md:p-12 rounded-[3.5rem] border border-white/5 space-y-10 group transition-all hover:border-brand-gold/20 shadow-2xl relative">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1 w-full">
                                <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-2 block">عنوان المحاضرة</label>
                                <input type="text" value={lesson.title} onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    newLessons[lIdx].title = e.target.value;
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                }} className="bg-transparent text-white font-black text-3xl outline-none focus:border-brand-gold border-b-2 border-white/5 pb-4 w-full transition-all focus:border-brand-gold" />
                            </div>
                            <button onClick={() => {
                              const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                              setEditingCourse({...editingCourse, lessons: newLessons});
                            }} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={24}/></button>
                          </div>

                          {/* Content Types Management */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-brand-card/50 p-8 rounded-[2rem] border border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-white font-black text-sm flex items-center gap-3"><Video size={18} className="text-brand-gold" /> فيديو المحاضرة (YouTube)</h5>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="https://youtube.com/embed/..." 
                                  value={lesson.contents?.find(c => c.type === 'video')?.url || ''} 
                                  onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    const videoIdx = newLessons[lIdx].contents.findIndex(c => c.type === 'video');
                                    if (videoIdx >= 0) {
                                      newLessons[lIdx].contents[videoIdx].url = e.target.value;
                                    } else {
                                      newLessons[lIdx].contents.push({ id: 'v' + Date.now(), type: 'video', title: 'فيديو المحاضرة', url: e.target.value });
                                    }
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }}
                                  className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-brand-gold transition-all"
                                />
                             </div>
                             <div className="bg-brand-card/50 p-8 rounded-[2rem] border border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-white font-black text-sm flex items-center gap-3"><FileDown size={18} className="text-brand-gold" /> المذكرات والملفات (PDF)</h5>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="رابط ملف الـ PDF..." 
                                  value={lesson.contents?.find(c => c.type === 'pdf')?.url || ''} 
                                  onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    const pdfIdx = newLessons[lIdx].contents.findIndex(c => c.type === 'pdf');
                                    if (pdfIdx >= 0) {
                                      newLessons[lIdx].contents[pdfIdx].url = e.target.value;
                                    } else {
                                      newLessons[lIdx].contents.push({ id: 'pdf' + Date.now(), type: 'pdf', title: 'ملف الشرح', url: e.target.value });
                                    }
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }}
                                  className="w-full bg-brand-main border border-white/10 rounded-xl p-4 text-xs text-white outline-none focus:border-brand-gold transition-all"
                                />
                             </div>
                          </div>

                          {/* Quiz Builder Sub-Section */}
                          <div className="bg-brand-card p-10 rounded-[2.5rem] border border-brand-gold/10 space-y-8 relative overflow-hidden group/quiz">
                              <div className="absolute top-0 left-0 w-2 h-full bg-brand-gold opacity-30"></div>
                              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h5 className="text-white font-black text-xl flex items-center gap-4"><Brain size={24} className="text-brand-gold" /> بنك أسئلة المحاضرة</h5>
                                    <p className="text-xs text-brand-muted font-bold mt-1">أضف الأسئلة لتظهر للطالب فور انتهاء المحاضرة</p>
                                </div>
                                {!lesson.quiz ? (
                                  <button onClick={() => {
                                    const newQuiz: Quiz = { id: 'q' + Date.now(), title: 'اختبار المحاضرة', questions: [] };
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    newLessons[lIdx].quiz = newQuiz;
                                    setEditingCourse({ ...editingCourse, lessons: newLessons });
                                  }} className="bg-brand-gold/10 text-brand-gold px-8 py-3 rounded-xl text-[11px] font-black border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-main transition-all">تفعيل الاختبار</button>
                                ) : (
                                  <button onClick={() => {
                                    const newQuestion: Question = { id: 'qn' + Date.now(), text: 'أدخل السؤال هنا؟', options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'], correctOptionIndex: 0 };
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    newLessons[lIdx].quiz!.questions.push(newQuestion);
                                    setEditingCourse({ ...editingCourse, lessons: newLessons });
                                  }} className="bg-brand-gold text-brand-main px-8 py-3 rounded-xl text-[11px] font-black shadow-glow flex items-center gap-2 hover:scale-105 transition-all"><Plus size={16} /> إضافة سؤال</button>
                                )}
                              </div>
                              
                              {lesson.quiz && (
                                <div className="space-y-8 animate-fade-in">
                                  {lesson.quiz.questions.map((q, qIdx) => (
                                    <div key={q.id} className="bg-brand-main/40 p-8 rounded-[2rem] border border-white/5 space-y-6 relative group/question">
                                      <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center font-black shrink-0">{qIdx + 1}</div>
                                        <textarea 
                                          value={q.text} 
                                          onChange={(e) => {
                                            const newLessons = [...(editingCourse.lessons || [])];
                                            newLessons[lIdx].quiz!.questions[qIdx].text = e.target.value;
                                            setEditingCourse({ ...editingCourse, lessons: newLessons });
                                          }}
                                          className="flex-1 bg-transparent text-white font-black text-lg outline-none border-b border-white/5 focus:border-brand-gold pb-2 no-scrollbar resize-none"
                                          placeholder="نص السؤال..."
                                          rows={1}
                                        />
                                        <button onClick={() => {
                                          const newLessons = [...(editingCourse.lessons || [])];
                                          newLessons[lIdx].quiz!.questions = newLessons[lIdx].quiz!.questions.filter((_, i) => i !== qIdx);
                                          setEditingCourse({ ...editingCourse, lessons: newLessons });
                                        }} className="text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"><X size={20}/></button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {q.options.map((opt, oIdx) => (
                                          <div key={oIdx} className="flex items-center gap-4 group/opt">
                                            <button 
                                                onClick={() => {
                                                  const newLessons = [...(editingCourse.lessons || [])];
                                                  newLessons[lIdx].quiz!.questions[qIdx].correctOptionIndex = oIdx;
                                                  setEditingCourse({ ...editingCourse, lessons: newLessons });
                                                }}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${q.correctOptionIndex === oIdx ? 'bg-brand-gold border-brand-gold text-brand-main' : 'border-white/10 group-hover/opt:border-brand-gold/50'}`}
                                            >
                                                {q.correctOptionIndex === oIdx && <Check size={14} strokeWidth={4} />}
                                            </button>
                                            <input 
                                              type="text" 
                                              value={opt} 
                                              onChange={(e) => {
                                                const newLessons = [...(editingCourse.lessons || [])];
                                                newLessons[lIdx].quiz!.questions[qIdx].options[oIdx] = e.target.value;
                                                setEditingCourse({ ...editingCourse, lessons: newLessons });
                                              }} 
                                              className={`flex-1 bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none transition-all ${q.correctOptionIndex === oIdx ? 'border-brand-gold/30 bg-brand-gold/5' : 'focus:border-brand-gold/20'}`} 
                                              placeholder={`الخيار رقم ${oIdx + 1}`} 
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                  {lesson.quiz.questions.length === 0 && <p className="text-center text-brand-muted py-10 italic text-sm">ابدأ بإضافة أسئلة لهذا الاختبار...</p>}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                 </section>
              </div>

              {/* Footer Save Area */}
              <div className="p-8 md:p-12 border-t border-white/5 bg-brand-main/50 backdrop-blur-3xl flex justify-between items-center">
                <div className="hidden md:flex items-center gap-4 text-brand-muted text-[10px] font-black uppercase tracking-[0.3em]">
                    <CheckCircle className="text-green-500" size={20} /> يتم الحفظ تلقائياً في السحابة
                </div>
                <button onClick={handleSaveCourse} className="w-full md:w-auto bg-brand-gold text-brand-main font-black px-20 py-6 rounded-[2rem] shadow-glow text-xl flex items-center justify-center gap-4 hover:scale-105 transition-all">
                  <Save size={24} /> حفظ كافة التعديلات
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modern Notification Toasts */}
      {notification && (
        <div className={`fixed bottom-10 left-10 z-[600] px-10 py-6 rounded-[2rem] animate-fade-in-up border backdrop-blur-3xl shadow-2xl flex items-center gap-5 font-black text-lg ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          {notification.type === 'success' ? <CheckCircle size={28} className="animate-bounce" /> : <AlertCircle size={28} />}
          {notification.text}
        </div>
      )}
    </div>
  );
};
