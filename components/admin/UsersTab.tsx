
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../firebase';
import { 
  Search, Filter, Trash2, Shield, Zap, Mail, Smartphone, 
  MoreHorizontal, Edit3, X, Save, Ban, CheckCircle, 
  GraduationCap, Wallet, FileText, Calendar, Lock
} from 'lucide-react';

interface Props {
  users: User[];
  searchTerm: string;
}

export const UsersTab: React.FC<Props> = ({ users, searchTerm }) => {
  const [filter, setFilter] = useState<'all' | 'pro' | 'free' | 'blocked'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Filter Logic
  const filtered = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (u.phone || '').includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'blocked') return matchesSearch && u.isBlocked;
    return matchesSearch && u.subscriptionTier === filter;
  });

  const handleDelete = async (uid: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await db.collection("users").doc(uid).delete();
        setIsEditorOpen(false);
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className="space-y-6">
       {/* Modern Filter Toolbar */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-[#333] shadow-sm transition-colors">
         <div className="flex gap-2 bg-gray-100 dark:bg-[#252525] p-1 rounded-lg self-start">
           {[
             { id: 'all', label: 'الكل' },
             { id: 'pro', label: 'Pro Members' },
             { id: 'free', label: 'Free Tier' },
             { id: 'blocked', label: 'محظور' }
           ].map(f => (
             <button 
                key={f.id} 
                onClick={() => setFilter(f.id as any)} 
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all shadow-sm ${
                  filter === f.id 
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#333] shadow-none'
                }`}
             >
               {f.label}
             </button>
           ))}
         </div>
         <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
            {filtered.length} طالب نشط
         </div>
       </div>

       {/* Enhanced Data Table */}
       <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/80 dark:bg-[#252525] border-b border-gray-200 dark:border-[#333] backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الطالب</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">الأكاديمية</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الاشتراك</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">آخر ظهور</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">تحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                {filtered.map((u) => (
                  <tr key={u.id} className={`group transition-all hover:bg-blue-50/30 dark:hover:bg-blue-900/10 ${u.isBlocked ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white dark:border-[#333] ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700'}`}>
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {u.name}
                            {u.role === 'admin' && <Shield size={12} className="text-blue-600 dark:text-blue-400" />}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </p>
                          {u.phone && <p className="text-xs text-gray-400 font-mono mt-0.5">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{u.university || 'غير محدد'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{u.faculty} - {u.academicYear}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            u.subscriptionTier === 'pro' 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800' 
                            : 'bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#444]'
                        }`}>
                          {u.subscriptionTier === 'pro' ? <Zap size={10} fill="currentColor" /> : null}
                          {u.subscriptionTier}
                        </span>
                        {u.isBlocked && (
                          <span className="text-[10px] text-red-600 font-bold flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 rounded-full">
                            <Ban size={10} /> محظور
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <p>{u.lastSeen ? new Date(u.lastSeen).toLocaleDateString('ar-EG') : '-'}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{u.lastDevice || 'Unknown Device'}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-left">
                       <button 
                        onClick={() => { setSelectedUser(u); setIsEditorOpen(true); }}
                        className="px-4 py-2 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#444] text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all text-xs font-bold flex items-center gap-2 ml-auto"
                       >
                         <Edit3 size={14} /> تعديل شامل
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </div>

       {/* SUPER USER EDITOR MODAL */}
       {isEditorOpen && selectedUser && (
         <UserEditorModal 
           user={selectedUser} 
           onClose={() => setIsEditorOpen(false)} 
           onDelete={() => handleDelete(selectedUser.id)}
         />
       )}
    </div>
  );
};

// ----------------------------------------------------------------------
// INTERNAL COMPONENT: User Editor Modal
// ----------------------------------------------------------------------

const UserEditorModal: React.FC<{ user: User, onClose: () => void, onDelete: () => void }> = ({ user, onClose, onDelete }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'subscription' | 'stats' | 'danger'>('profile');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.collection("users").doc(user.id).update(formData);
      onClose();
    } catch (e) {
      alert("Failed to update user: " + e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-[#333]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#333] flex justify-between items-center bg-gray-50/50 dark:bg-[#252525]">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                 {formData.name.charAt(0)}
              </div>
              <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">{formData.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formData.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* Sidebar Tabs */}
           <div className="w-64 bg-gray-50 dark:bg-[#1A1A1A] border-l border-gray-200 dark:border-[#333] p-4 space-y-1 overflow-y-auto hidden md:block">
              {[
                { id: 'profile', label: 'البيانات الشخصية', icon: MoreHorizontal },
                { id: 'academic', label: 'البيانات الأكاديمية', icon: GraduationCap },
                { id: 'subscription', label: 'الاشتراك والحالة', icon: Wallet },
                { id: 'stats', label: 'التقدم والـ XP', icon: Zap },
                { id: 'danger', label: 'منطقة الخطر', icon: Lock },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white dark:bg-[#2C2C2C] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-[#444]' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
              
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                 <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2">ملاحظات الإدارة</h4>
                 <textarea 
                   className="w-full text-xs bg-white dark:bg-[#2C2C2C] border border-blue-200 dark:border-blue-800 rounded p-2 h-24 resize-none focus:outline-none focus:border-blue-400 text-gray-900 dark:text-white placeholder:text-gray-400"
                   placeholder="اكتب ملاحظات خاصة عن الطالب..."
                   value={formData.adminNotes || ''}
                   onChange={e => handleChange('adminNotes', e.target.value)}
                 ></textarea>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#1E1E1E]">
              
              {/* TAB: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-[#333] pb-2 mb-6">البيانات الأساسية</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الاسم بالكامل</label>
                         <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="cf-input" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                         <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="cf-input" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                         <input type="text" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="cf-input" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع الصلاحية</label>
                         <select 
                            value={formData.role || 'student'} 
                            onChange={e => handleChange('role', e.target.value)}
                            className="cf-input"
                         >
                            <option value="student">طالب (Student)</option>
                            <option value="admin">مسؤول (Admin)</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {/* TAB: ACADEMIC */}
              {activeTab === 'academic' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-[#333] pb-2 mb-6">البيانات الدراسية</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الجامعة / المعهد</label>
                         <input type="text" value={formData.university || ''} onChange={e => handleChange('university', e.target.value)} placeholder="مثال: جامعة القاهرة" className="cf-input" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الكلية</label>
                         <input type="text" value={formData.faculty || ''} onChange={e => handleChange('faculty', e.target.value)} placeholder="مثال: كلية التمريض" className="cf-input" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الفرقة الدراسية</label>
                         <select 
                            value={formData.academicYear || ''} 
                            onChange={e => handleChange('academicYear', e.target.value)}
                            className="cf-input"
                         >
                            <option value="">اختر الفرقة...</option>
                            <option value="First Year">الفرقة الأولى</option>
                            <option value="Second Year">الفرقة الثانية</option>
                            <option value="Third Year">الفرقة الثالثة</option>
                            <option value="Fourth Year">الفرقة الرابعة</option>
                            <option value="Internship">امتياز</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {/* TAB: SUBSCRIPTION */}
              {activeTab === 'subscription' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-[#333] pb-2 mb-6">التحكم في الاشتراك</h3>
                   
                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between mb-6">
                      <div>
                         <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">الحالة الحالية</p>
                         <h2 className="text-3xl font-black text-blue-900 dark:text-blue-300 uppercase">{formData.subscriptionTier}</h2>
                      </div>
                      <div className="p-4 bg-white dark:bg-[#252525] rounded-full shadow-md text-blue-600 dark:text-blue-400">
                         {formData.subscriptionTier === 'pro' ? <Zap size={32} fill="currentColor" /> : <Lock size={32} />}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع الاشتراك</label>
                         <select 
                            value={formData.subscriptionTier} 
                            onChange={e => handleChange('subscriptionTier', e.target.value)}
                            className="cf-input"
                         >
                            <option value="free">مجاني (Free)</option>
                            <option value="pro">مدفوع (PRO)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ انتهاء الصلاحية</label>
                         <input 
                           type="date" 
                           value={formData.subscriptionExpiry || ''} 
                           onChange={e => handleChange('subscriptionExpiry', e.target.value)} 
                           className="cf-input" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">رصيد المحفظة (ج.م)</label>
                         <input 
                           type="number" 
                           value={formData.walletBalance || 0} 
                           onChange={e => handleChange('walletBalance', Number(e.target.value))} 
                           className="cf-input font-mono" 
                         />
                      </div>
                   </div>
                </div>
              )}

              {/* TAB: STATS */}
              {activeTab === 'stats' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-[#333] pb-2 mb-6">إحصائيات التقدم (Gamification)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                         <label className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase">نقاط الخبرة (XP)</label>
                         <input 
                           type="number" 
                           value={formData.xp || 0} 
                           onChange={e => handleChange('xp', Number(e.target.value))}
                           className="w-full mt-2 bg-white dark:bg-[#252525] border border-yellow-200 dark:border-yellow-900 rounded px-2 py-1 text-lg font-bold text-gray-900 dark:text-white"
                         />
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                         <label className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">المستوى (Level)</label>
                         <input 
                           type="number" 
                           value={formData.level || 1} 
                           onChange={e => handleChange('level', Number(e.target.value))}
                           className="w-full mt-2 bg-white dark:bg-[#252525] border border-green-200 dark:border-green-900 rounded px-2 py-1 text-lg font-bold text-gray-900 dark:text-white"
                         />
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl">
                         <label className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Streak (أيام)</label>
                         <input 
                           type="number" 
                           value={formData.streak || 0} 
                           onChange={e => handleChange('streak', Number(e.target.value))}
                           className="w-full mt-2 bg-white dark:bg-[#252525] border border-orange-200 dark:border-orange-900 rounded px-2 py-1 text-lg font-bold text-gray-900 dark:text-white"
                         />
                      </div>
                   </div>
                </div>
              )}

              {/* TAB: DANGER */}
              {activeTab === 'danger' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-lg font-bold text-red-600 border-b border-red-100 dark:border-red-900/30 pb-2 mb-6">منطقة الخطر</h3>
                   
                   <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 space-y-6">
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">حظر الطالب مؤقتاً</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">سيمنع الطالب من تسجيل الدخول للمنصة.</p>
                         </div>
                         <button 
                           onClick={() => handleChange('isBlocked', !formData.isBlocked)}
                           className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                              formData.isBlocked 
                              ? 'bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#444]' 
                              : 'bg-red-600 text-white hover:bg-red-700'
                           }`}
                         >
                           {formData.isBlocked ? 'إلغاء الحظر' : 'حظر الحساب'}
                         </button>
                      </div>
                      
                      <div className="w-full h-px bg-red-200 dark:bg-red-900/30"></div>

                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400">حذف الحساب نهائياً</h4>
                            <p className="text-sm text-red-500 dark:text-red-300/80">هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات.</p>
                         </div>
                         <button 
                           onClick={onDelete}
                           className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 bg-white dark:bg-[#1E1E1E] rounded-lg font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                         >
                           <Trash2 size={16} /> حذف نهائي
                         </button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-[#333] bg-gray-50 dark:bg-[#252525] flex justify-end gap-3">
           <button onClick={onClose} className="px-6 py-2.5 bg-white dark:bg-[#333] border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#404040] transition-colors">
              إلغاء
           </button>
           <button 
             onClick={handleSave} 
             disabled={isSaving}
             className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
           >
              {isSaving ? 'جاري الحفظ...' : <>حفظ التغييرات <Save size={18}/></>}
           </button>
        </div>
      </div>
    </div>
  );
};
