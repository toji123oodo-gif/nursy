
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Shield, Bell, Key, 
  GraduationCap, Save, CheckCircle2
} from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export const Profile: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ 
      name: user?.name || '', 
      phone: user?.phone || '',
      university: user?.university || '',
      faculty: user?.faculty || '',
      academicYear: user?.academicYear || ''
  });

  if (!user) return null;

  const handleSave = async () => {
     setIsSaving(true);
     await updateUserData(formData);
     setIsSaving(false);
     setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <ProfileHeader 
        user={{...user, ...formData}} 
        isEditing={isEditing} 
        onEditToggle={() => setIsEditing(!isEditing)} 
        onLogout={() => { /* Logout handled in layout usually, but passed here */ }}
      />

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Settings Sidebar */}
         <div className="w-full lg:w-72 space-y-2">
            {[
               { id: 'general', label: 'البيانات الشخصية', icon: UserIcon },
               { id: 'academic', label: 'الهوية الأكاديمية', icon: GraduationCap },
               { id: 'security', label: 'الأمان والخصوصية', icon: Key },
               { id: 'notifications', label: 'الإشعارات', icon: Bell },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                     activeTab === tab.id 
                     ? 'bg-white dark:bg-[#1E1E1E] text-[#F38020] shadow-md shadow-orange-500/5 border border-orange-100 dark:border-[#333] translate-x-2' 
                     : 'text-gray-500 hover:bg-white dark:hover:bg-[#1E1E1E] hover:text-gray-900 dark:hover:text-white'
                  }`}
               >
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-[#F38020]' : 'text-gray-400'} /> 
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="flex-1">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-[#333] shadow-sm p-8 min-h-[400px]">
                
                {activeTab === 'general' && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">البيانات الشخصية</h2>
                          <p className="text-sm text-gray-500 mt-1">قم بتحديث بياناتك لتظهر في شهادات التخرج.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-700 dark:text-gray-300">الاسم بالكامل (كما يظهر في الشهادة)</label>
                           <input 
                              type="text" 
                              disabled={!isEditing}
                              value={formData.name} 
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                                  isEditing 
                                  ? 'bg-white dark:bg-[#101010] border-gray-300 focus:border-[#F38020] focus:ring-2 focus:ring-orange-100' 
                                  : 'bg-gray-50 dark:bg-[#252525] border-transparent text-gray-500'
                              }`} 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                           <input 
                              type="text" 
                              disabled={!isEditing}
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                                  isEditing 
                                  ? 'bg-white dark:bg-[#101010] border-gray-300 focus:border-[#F38020] focus:ring-2 focus:ring-orange-100' 
                                  : 'bg-gray-50 dark:bg-[#252525] border-transparent text-gray-500'
                              }`} 
                           />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-xs font-bold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                           <div className="w-full rounded-xl border border-gray-100 bg-gray-50 dark:bg-[#252525] dark:border-[#333] px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
                              {user.email}
                              <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold">
                                  <Shield size={12} /> موثق
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>
                )}

                {activeTab === 'academic' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                       <div>
                           <h2 className="text-xl font-bold text-gray-900 dark:text-white">الهوية الأكاديمية</h2>
                           <p className="text-sm text-gray-500 mt-1">ساعدنا في تخصيص المحتوى المناسب لدراستك.</p>
                       </div>
 
                       <div className="grid grid-cols-1 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">الجامعة / المعهد</label>
                            <input 
                               type="text" 
                               disabled={!isEditing}
                               value={formData.university} 
                               onChange={e => setFormData({...formData, university: e.target.value})}
                               placeholder="مثال: جامعة القاهرة"
                               className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                                   isEditing 
                                   ? 'bg-white dark:bg-[#101010] border-gray-300 focus:border-[#F38020] focus:ring-2 focus:ring-orange-100' 
                                   : 'bg-gray-50 dark:bg-[#252525] border-transparent text-gray-500'
                               }`} 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">الكلية</label>
                            <input 
                               type="text" 
                               disabled={!isEditing}
                               value={formData.faculty} 
                               onChange={e => setFormData({...formData, faculty: e.target.value})}
                               placeholder="مثال: كلية التمريض"
                               className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                                   isEditing 
                                   ? 'bg-white dark:bg-[#101010] border-gray-300 focus:border-[#F38020] focus:ring-2 focus:ring-orange-100' 
                                   : 'bg-gray-50 dark:bg-[#252525] border-transparent text-gray-500'
                               }`} 
                            />
                         </div>
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-700 dark:text-gray-300">السنة الدراسية</label>
                             <select 
                                disabled={!isEditing}
                                value={formData.academicYear}
                                onChange={e => setFormData({...formData, academicYear: e.target.value})}
                                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
                                    isEditing 
                                    ? 'bg-white dark:bg-[#101010] border-gray-300 focus:border-[#F38020] focus:ring-2 focus:ring-orange-100' 
                                    : 'bg-gray-50 dark:bg-[#252525] border-transparent text-gray-500 appearance-none'
                                }`}
                             >
                                 <option value="">اختر السنة الدراسية...</option>
                                 <option value="First Year">الفرقة الأولى</option>
                                 <option value="Second Year">الفرقة الثانية</option>
                                 <option value="Third Year">الفرقة الثالثة</option>
                                 <option value="Fourth Year">الفرقة الرابعة</option>
                                 <option value="Internship">سنة الامتياز</option>
                             </select>
                         </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'security' && (
                    <div className="text-center py-12">
                        <Key size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">كلمة المرور والأمان</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                            يتم إدارة كلمات المرور عبر بروتوكولات Firebase الآمنة. لتغيير كلمة المرور، يرجى تسجيل الخروج واستخدام خيار "نسيت كلمة المرور".
                        </p>
                    </div>
                 )}

                {/* Footer Actions */}
                {isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#333] flex justify-end">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="bg-[#F38020] hover:bg-[#d66e16] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all disabled:opacity-70"
                        >
                            {isSaving ? 'جاري الحفظ...' : <>حفظ التغييرات <Save size={18} /></>}
                        </button>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
