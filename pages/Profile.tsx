
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Phone, Save, Mail, Smartphone, UserCheck, Loader2, CheckCircle
} from 'lucide-react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsGrid } from '../components/profile/StatsGrid';

export const Profile: React.FC = () => {
  const { user, logout, updateUserData, courses } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, phone: user.phone });
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setIsSaving(true);
    try { 
      await updateUserData(formData); 
      setIsEditing(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } 
    catch (error) { console.error("Update failed", error); } 
    finally { setIsSaving(false); }
  };

  const completedCount = user.completedLessons?.length || 0;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-brand-main pb-32 pt-12">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-brand-main px-8 py-4 rounded-2xl font-black text-sm ns-shadow--glow-green flex items-center gap-3 animate-fade-in-up">
            <CheckCircle size={20} /> تم التحديث بنجاح!
          </div>
        )}

        <ProfileHeader 
          user={user} 
          isEditing={isEditing} 
          onEditToggle={() => setIsEditing(!isEditing)} 
          onLogout={logout} 
        />

        {isEditing ? (
          <div className="ns-card p-10 md:p-14 shadow-2xl ns-animate--fade-in-up">
            <h3 className="text-2xl font-black text-white flex items-center gap-4 mb-10">
              <UserCheck className="text-brand-gold" /> تعديل بيانات الحساب
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] px-2">اسمك الثلاثي</label>
                <div className="relative">
                  <UserIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl pr-14 pl-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-brand-muted font-black uppercase tracking-[0.2em] px-2">رقم الواتساب</label>
                <div className="relative">
                  <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-main border-2 border-brand-gold/30 rounded-2xl pr-14 pl-6 py-5 text-white font-black outline-none focus:border-brand-gold transition-all" />
                </div>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="w-full ns-surface--gold-gradient text-brand-main font-black py-6 rounded-2xl ns-shadow--glow text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={24}/> حفظ التغييرات</>}
            </button>
          </div>
        ) : (
          <StatsGrid progress={progressPercentage} />
        )}

        {!isEditing && (
          <div className="ns-card p-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-6">
                <div className="bg-white/5 p-4 rounded-2xl text-brand-gold"><Mail size={32} /></div>
                <div>
                   <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest">البريد الإلكتروني</p>
                   <p className="text-white font-black text-xl">{user.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="bg-white/5 p-4 rounded-2xl text-brand-gold"><Smartphone size={32} /></div>
                <div>
                   <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest">رقم الهاتف</p>
                   <p className="text-white font-black text-xl">{user.phone || 'غير مسجل'}</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
