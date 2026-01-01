
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
  MessageCircle
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
      totalIncome: activePro * 50,
      totalCourses: courses.length,
      totalLessons
    };
  }, [allUsers, courses]);

  // Real-time Data Listeners
  useEffect(() => {
    if (!db) return;
    const unsubUsers = db.collection("users").orderBy("lastSeen", "desc").onSnapshot(s => {
      setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}) as User));
    });
    const unsubCodes = db.collection("activation_codes").orderBy("createdAt", "desc").limit(200).onSnapshot(s => {
      setActivationCodes(s.docs.map(d => ({id: d.id, ...d.data()}) as ActivationCode));
    });
    // Fetch notifications as activities
    const unsubActivity = db.collection("admin_notifications").orderBy("timestamp", "desc").limit(5).onSnapshot(s => {
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
        showNotification('success', 'تم تحديث بيانات الطالب');
    } catch (e) {
        showNotification('error', 'فشل التحديث');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟')) return;
    try {
        await db.collection("users").doc(id).delete();
        showNotification('success', 'تم حذف الطالب');
    } catch (e) {
        showNotification('error', 'فشل الحذف');
    }
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
      showNotification('error', 'فشل العملية');
    }
  };

  const exportCodesToText = () => {
    const unused = activationCodes.filter(c => !c.isUsed).map(c => `${c.code} (${c.days} يوم)`).join('\n');
    const blob = new Blob([unused], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `أكواد_تفعيل_نيرسي_${new Date().toLocaleDateString()}.txt`;
    a.click();
    showNotification('success', 'تم تصدير الأكواد بنجاح');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --- Advanced Course Editor Logic ---
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
      showNotification('error', 'خطأ في الحفظ');
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
        title: type === 'video' ? 'رابط فيديو' : 'رابط ملف PDF', 
        url: '' 
    };
    const newLessons = [...(editingCourse?.lessons || [])];
    newLessons[lessonIdx].contents = [...(newLessons[lessonIdx].contents || []), newContent];
    setEditingCourse(prev => ({ ...prev, lessons: newLessons }));
  };

  // Filtering Logic
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm);
    const matchesFilter = userFilter === 'all' || u.subscriptionTier === userFilter;
    return matchesSearch && matchesFilter;
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-right">
            <h1 className="text-4xl font-black text-white mb-2">لوحة التحكم</h1>
            <p className="text-brand-muted">إدارة كل ميزات نيرسي من مكان واحد</p>
          </div>
          <div className="flex bg-brand-card p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
            {[
              {id: 'overview', label: 'الرئيسية', icon: Layout},
              {id: 'users', label: 'الطلاب', icon: Users},
              {id: 'courses', label: 'المحتوى', icon: BookOpen},
              {id: 'codes', label: 'الأكواد', icon: Key}
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TABS CONTENT --- */}

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي الطلاب', val: stats.totalStudents, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                { label: 'مشتركين PRO', val: stats.activePro, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: 'المحتوى (فصل)', val: stats.totalLessons, icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'الدخل (ج.م)', val: stats.totalIncome, icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
              ].map((s, i) => (
                <div key={i} className="bg-brand-card p-8 rounded-[2rem] border border-white/5 group hover:border-brand-gold/30 transition-all">
                  <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <s.icon size={24} />
                  </div>
                  <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <h3 className="text-3xl font-black text-white">{s.val}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Activity Feed */}
               <div className="lg:col-span-2 bg-brand-card rounded-[2.5rem] border border-white/5 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white flex items-center gap-2"><Activity className="text-brand-gold" /> آخر النشاطات</h3>
                    <span className="text-[10px] bg-brand-main px-3 py-1 rounded-full text-brand-muted">مباشر</span>
                  </div>
                  <div className="space-y-6">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-brand-main rounded-2xl border border-white/5">
                        <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center shrink-0">
                          {act.type === 'support' ? <MessageCircle size={18} /> : <Zap size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-bold">{act.message}</p>
                          <p className="text-brand-muted text-[10px] mt-1">{new Date(act.timestamp).toLocaleString('ar-EG')}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-brand-muted" />
                      </div>
                    ))}
                    {recentActivities.length === 0 && <p className="text-center text-brand-muted py-10">لا يوجد نشاط مسجل حالياً</p>}
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="bg-brand-card rounded-[2.5rem] border border-white/5 p-8">
                  <h3 className="text-xl font-black text-white mb-8">إجراءات سريعة</h3>
                  <div className="space-y-4">
                     <button onClick={() => setActiveTab('courses')} className="w-full bg-brand-gold text-brand-main font-black p-4 rounded-xl flex items-center justify-between shadow-glow hover:scale-[1.02] transition-all">
                        <span>إضافة كورس جديد</span>
                        <PlusCircle size={20} />
                     </button>
                     <button onClick={() => setActiveTab('codes')} className="w-full bg-white/5 text-white font-bold p-4 rounded-xl flex items-center justify-between border border-white/10 hover:bg-white/10 transition-all">
                        <span>توليد 50 كود</span>
                        <Ticket size={20} />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-card rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                <div className="relative w-full md:w-96">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                  <input type="text" placeholder="ابحث بالاسم أو الهاتف..." className="w-full bg-brand-main border border-white/10 rounded-2xl px-12 py-4 text-white outline-none focus:border-brand-gold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex bg-brand-main p-1.5 rounded-xl border border-white/5">
                   {['all', 'pro', 'free'].map(f => (
                     <button key={f} onClick={() => setUserFilter(f as any)} className={`px-6 py-2.5 rounded-lg text-xs font-black transition-all ${userFilter === f ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}>
                        {f === 'all' ? 'الكل' : f === 'pro' ? 'PRO' : 'FREE'}
                     </button>
                   ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-right">
                  <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                    <tr>
                      <th className="px-6 py-4">الطالب</th>
                      <th className="px-6 py-4">بيانات التواصل</th>
                      <th className="px-6 py-4">الجهاز / الموقع</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4 text-left">تحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold/20 to-yellow-500/20 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-black">{u.name.charAt(0)}</div>
                            <div>
                                <div className="font-bold text-white text-sm">{u.name}</div>
                                <div className="text-[10px] text-brand-muted font-mono">{u.id.substring(0,8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-xs font-bold">{u.phone}</div>
                          <div className="text-[10px] text-brand-muted mt-0.5">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-brand-muted text-[10px]">
                            <Smartphone size={12} /> {u.lastDevice || 'غير معروف'}
                          </div>
                          <div className="text-[9px] mt-1 opacity-60 flex items-center gap-2 text-brand-muted">
                            <Clock size={10} /> {u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG') : 'قديماً'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black border ${u.subscriptionTier === 'pro' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-brand-muted border-white/10'}`}>
                            {u.subscriptionTier === 'pro' ? 'PRO MEMBER' : 'FREE USER'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => {setEditingUser(u); setIsUserModalOpen(true);}} className="p-2 bg-brand-gold text-brand-main rounded-lg shadow-lg"><Edit size={16}/></button>
                          <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-500 text-white rounded-lg shadow-lg"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">مكتبة الكورسات</h2>
                <button onClick={() => {setEditingCourse({lessons: [], price: 0, subject: 'عام'}); setIsCourseModalOpen(true);}} className="bg-brand-gold text-brand-main font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-glow hover:scale-105 transition-all">
                  <PlusCircle size={20} /> كورس جديد
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} className="bg-brand-card rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-brand-gold/30 transition-all shadow-2xl">
                  <div className="h-56 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-brand-main/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 text-[10px] font-black text-brand-gold">
                      {course.subject}
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-2">
                        <button onClick={() => {setEditingCourse(course); setIsCourseModalOpen(true);}} className="p-4 bg-brand-gold text-brand-main rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit size={20}/></button>
                        <button onClick={() => deleteCourse(course.id)} className="p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash size={20}/></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-white font-black text-2xl mb-4 leading-tight">{course.title}</h4>
                    <div className="flex items-center gap-6 text-brand-muted text-xs font-bold">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Layers size={14} className="text-brand-gold" /> {course.lessons.length} فصل</span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><DollarSign size={14} className="text-brand-gold" /> {course.price} ج.م</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-brand-card p-10 rounded-[3rem] border border-brand-gold/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Ticket size={200} />
               </div>
               <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3 relative z-10"><Ticket className="text-brand-gold" /> مولد أكواد التفعيل</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end relative z-10">
                  <div className="space-y-3">
                    <label className="text-xs text-brand-muted font-black block pr-2">الكمية</label>
                    <input id="code-count" type="number" defaultValue={50} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:border-brand-gold outline-none text-xl font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-brand-muted font-black block pr-2">المدة (أيام)</label>
                    <input id="code-days" type="number" defaultValue={30} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:border-brand-gold outline-none text-xl font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      onClick={() => {
                        const c = Number((document.getElementById('code-count') as HTMLInputElement).value);
                        const d = Number((document.getElementById('code-days') as HTMLInputElement).value);
                        generateCodes(c, d);
                      }}
                      className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-[1.02] transition-all text-lg"
                    >إنشاء وتصدير الأكواد</button>
                  </div>
               </div>
            </div>
            
            <div className="bg-brand-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="text-white font-black text-xl mb-1">سجل الأكواد</h4>
                    <p className="text-brand-muted text-[10px]">إجمالي الأكواد المعروضة: {activationCodes.length}</p>
                  </div>
                  <div className="flex gap-4">
                      <div className="flex bg-brand-main p-1.5 rounded-xl border border-white/5">
                        {['all', 'unused', 'used'].map(f => (
                          <button key={f} onClick={() => setCodeFilter(f as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${codeFilter === f ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}>
                              {f === 'all' ? 'الكل' : f === 'unused' ? 'متاح' : 'مستعمل'}
                          </button>
                        ))}
                      </div>
                      <button onClick={exportCodesToText} className="flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-6 py-3 rounded-xl font-black text-[10px] border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-main transition-all">
                        <Download size={14} /> تصدير TXT
                      </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                    <thead className="bg-brand-main/50 text-brand-muted text-[10px] uppercase font-black">
                      <tr>
                        <th className="px-6 py-4">الكود</th>
                        <th className="px-6 py-4">الصلاحية</th>
                        <th className="px-6 py-4">الحالة</th>
                        <th className="px-6 py-4">تاريخ الإنشاء</th>
                        <th className="px-6 py-4 text-left">نسخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCodes.map(code => (
                        <tr key={code.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono font-black text-brand-gold text-xl tracking-widest">{code.code}</td>
                          <td className="px-6 py-4 text-white text-xs font-black">{code.days} يوم</td>
                          <td className="px-6 py-4">
                            {code.isUsed ? (
                                <div className="inline-flex items-center gap-2 text-red-400 text-[10px] font-black uppercase bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                                    <XCircle size={12} /> مستخدم
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-green-400 text-[10px] font-black uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    <CheckCircle size={12} /> متاح للبيع
                                </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-brand-muted text-[10px] font-mono">{new Date(code.createdAt).toLocaleDateString('ar-EG')}</td>
                          <td className="px-6 py-4 text-left">
                            <button onClick={() => copyToClipboard(code.code)} className={`p-3 rounded-xl transition-all ${copiedCode === code.code ? 'bg-green-500 text-white' : 'bg-white/5 text-brand-muted hover:text-white border border-white/5'}`}>
                                {copiedCode === code.code ? <Check size={18}/> : <Copy size={18}/>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODALS --- */}

      {/* Advanced Course Modal */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-md" onClick={() => setIsCourseModalOpen(false)}></div>
          <div className="relative w-full max-w-5xl bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
               <h3 className="text-2xl font-black text-white">{editingCourse.id ? 'تعديل بيانات الكورس' : 'إضافة كورس جديد'}</h3>
               <button onClick={() => setIsCourseModalOpen(false)} className="text-brand-muted hover:text-white bg-white/5 p-2 rounded-xl transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-12 no-scrollbar">
               {/* Basic Info Section */}
               <section className="space-y-6">
                  <h4 className="text-brand-gold text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b border-brand-gold/20 pb-2"><Layout size={14}/> البيانات الأساسية للكورس</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black mr-1 uppercase">اسم الكورس</label>
                        <input type="text" placeholder="مثلاً: مادة التشريح المستوى الأول" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-brand-gold outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black mr-1 uppercase">المحاضر / الدكتور</label>
                        <input type="text" placeholder="د. محمد .." value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-brand-gold outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black mr-1 uppercase">السعر (ج.م)</label>
                        <input type="number" placeholder="500" value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-brand-gold outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-brand-muted font-black mr-1 uppercase">المادة الدراسية</label>
                        <input type="text" placeholder="مثال: Anatomy" value={editingCourse.subject || ''} onChange={e => setEditingCourse({...editingCourse, subject: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-brand-gold outline-none font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] text-brand-muted font-black mr-1 uppercase">رابط صورة الغلاف</label>
                        <input type="text" placeholder="https://..." value={editingCourse.image || ''} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-brand-gold outline-none" />
                    </div>
                  </div>
               </section>

               {/* Lessons Section */}
               <section className="space-y-8">
                  <div className="flex justify-between items-center border-b border-brand-gold/20 pb-2">
                    <h4 className="text-brand-gold text-xs font-black uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> محاضرات وفصول الكورس</h4>
                    <button onClick={addLesson} className="bg-brand-gold text-brand-main px-6 py-3 rounded-xl text-xs font-black shadow-glow hover:scale-105 transition-all flex items-center gap-2"><Plus size={16} /> إضافة فصل جديد</button>
                  </div>
                  
                  <div className="space-y-8">
                    {editingCourse.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="bg-brand-main p-8 rounded-[2.5rem] border border-white/5 space-y-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-brand-gold opacity-20"></div>
                        <div className="flex justify-between items-center gap-6">
                          <div className="flex-1 flex items-center gap-6">
                            <span className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-main flex items-center justify-center font-black text-lg shadow-lg shrink-0">{lIdx + 1}</span>
                            <div className="flex-1 space-y-1">
                                <label className="text-[8px] text-brand-muted font-black uppercase">عنوان الفصل / المحاضرة</label>
                                <input type="text" value={lesson.title} onChange={(e) => {
                                    const newLessons = [...(editingCourse.lessons || [])];
                                    newLessons[lIdx].title = e.target.value;
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                }} className="bg-transparent border-b border-white/10 text-white font-black outline-none text-2xl flex-1 focus:border-brand-gold pb-2 w-full" />
                            </div>
                          </div>
                          <button onClick={() => {
                            const newLessons = (editingCourse.lessons || []).filter((_, i) => i !== lIdx);
                            setEditingCourse({...editingCourse, lessons: newLessons});
                          }} className="p-4 text-red-400 bg-red-400/5 hover:bg-red-400/20 rounded-2xl transition-all"><Trash2 size={24}/></button>
                        </div>

                        {/* Content inside Lesson */}
                        <div className="pr-16 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-0.5 bg-brand-gold/20 flex-1"></div>
                                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">محتويات الفصل</span>
                                <div className="h-0.5 bg-brand-gold/20 flex-1"></div>
                            </div>
                            
                            {lesson.contents?.map((content, cIdx) => (
                                <div key={content.id} className="flex flex-col md:flex-row gap-6 items-center bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-brand-gold/20 transition-all">
                                    <div className="flex items-center gap-4 bg-brand-main px-4 py-2 rounded-xl border border-white/5 shrink-0">
                                        {content.type === 'video' ? <Video size={18} className="text-brand-gold"/> : <FileDown size={18} className="text-brand-gold"/>}
                                        <span className="text-[10px] font-black uppercase text-white">{content.type}</span>
                                    </div>
                                    <div className="flex-1 w-full space-y-1">
                                        <input type="text" placeholder="اسم الملف أو الفيديو" value={content.title} onChange={(e) => {
                                            const newLessons = [...(editingCourse.lessons || [])];
                                            newLessons[lIdx].contents[cIdx].title = e.target.value;
                                            setEditingCourse({...editingCourse, lessons: newLessons});
                                        }} className="bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-brand-gold font-bold" />
                                    </div>
                                    <div className="flex-[2] w-full space-y-1">
                                        <input type="text" placeholder="رابط المحتوى (URL)" value={content.url} onChange={(e) => {
                                            const newLessons = [...(editingCourse.lessons || [])];
                                            newLessons[lIdx].contents[cIdx].url = e.target.value;
                                            setEditingCourse({...editingCourse, lessons: newLessons});
                                        }} className="bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-brand-gold font-mono" />
                                    </div>
                                    <button onClick={() => {
                                        const newLessons = [...(editingCourse.lessons || [])];
                                        newLessons[lIdx].contents = newLessons[lIdx].contents.filter((_, i) => i !== cIdx);
                                        setEditingCourse({...editingCourse, lessons: newLessons});
                                    }} className="text-brand-muted hover:text-red-400 p-2 bg-white/5 rounded-lg"><X size={18}/></button>
                                </div>
                            ))}
                            
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => addContentToLesson(lIdx, 'video')} className="bg-brand-gold/5 text-brand-gold px-6 py-3 rounded-xl text-[11px] font-black hover:bg-brand-gold hover:text-brand-main transition-all flex items-center gap-2 border border-brand-gold/20"><Video size={16}/> إضافة فيديو شرح</button>
                                <button onClick={() => addContentToLesson(lIdx, 'pdf')} className="bg-brand-gold/5 text-brand-gold px-6 py-3 rounded-xl text-[11px] font-black hover:bg-brand-gold hover:text-brand-main transition-all flex items-center gap-2 border border-brand-gold/20"><FileDown size={16}/> إضافة ملف PDF</button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>

            <div className="p-10 border-t border-white/5 bg-white/5">
              <button onClick={handleSaveCourse} className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow hover:scale-[1.01] transition-all text-xl">حفظ تعديلات الكورس النهائية</button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-md" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-brand-card border border-white/10 rounded-[3rem] shadow-2xl p-10 animate-scale-up">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3"><UserCog className="text-brand-gold" /> تعديل حالة الطالب</h3>
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest mr-1">اسم الطالب الكامل</label>
                    <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-brand-gold font-bold text-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest mr-1">نوع العضوية في نيرسي</label>
                    <select value={editingUser.subscriptionTier} onChange={e => setEditingUser({...editingUser, subscriptionTier: e.target.value as any})} className="w-full bg-brand-main border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-brand-gold font-bold text-lg appearance-none cursor-pointer">
                        <option value="free" className="bg-brand-card">FREE - طالب مجاني</option>
                        <option value="pro" className="bg-brand-card">PRO - طالب مشترك</option>
                    </select>
                </div>
                <div className="pt-6 flex gap-6">
                    <button onClick={handleUpdateUser} className="flex-[2] bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow hover:scale-105 transition-all">تحديث البيانات</button>
                    <button onClick={() => setIsUserModalOpen(false)} className="flex-1 bg-white/5 text-brand-muted font-bold py-5 rounded-2xl border border-white/5">إلغاء</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Notification */}
      {notification && (
        <div className={`fixed bottom-10 left-10 z-[250] px-8 py-5 rounded-2xl shadow-2xl animate-fade-in-up border ${notification.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-100' : 'bg-red-500/10 border-red-500 text-red-100'}`}>
          <div className="flex items-center gap-4 font-black">
            {notification.type === 'success' ? <CheckCircle size={24}/> : <AlertCircle size={24}/>}
            {notification.text}
          </div>
        </div>
      )}
    </div>
  );
};
