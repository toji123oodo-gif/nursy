import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Calendar, Shield, Edit2, LogOut, CheckCircle, Save, X, Clock } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, updateUserData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return;
    
    setIsSaving(true);
    try {
        await updateUserData(formData);
        setIsEditing(false);
    } catch (error) {
        console.error("Failed to update profile", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
        name: user.name,
        phone: user.phone
    });
    setIsEditing(false);
  };

  const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString('ar-EG') : null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
        <header className="mb-10 text-center md:text-right">
            <h1 className="text-3xl font-black text-white mb-2">الملف الشخصي</h1>
            <p className="text-brand-muted">إدارة بيانات حسابك واشتراكاتك</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Card */}
            <div className="md:col-span-1">
                <div className="bg-brand-card border border-white/5 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-gold/20 to-transparent"></div>
                    
                    <div className="relative z-10 flex-1">
                        <div className="w-24 h-24 rounded-full bg-brand-main border-4 border-brand-card mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-brand-gold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        
                        {isEditing ? (
                            <div className="mb-2">
                                <label className="text-xs text-brand-muted mb-1 block">تعديل الاسم</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-brand-main border border-brand-gold rounded-lg px-3 py-2 text-white text-center font-bold focus:outline-none"
                                />
                            </div>
                        ) : (
                            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                        )}

                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-2 ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main' : 'bg-gray-700 text-gray-300'}`}>
                            {user.subscriptionTier === 'pro' ? (
                                <><Shield size={12} fill="currentColor" /> باقة المشتركين</>
                            ) : (
                                <span>باقة مجانية</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <button onClick={logout} className="flex items-center justify-center gap-2 w-full text-red-400 hover:bg-red-500/10 py-2 rounded-lg transition-colors font-bold text-sm">
                            <LogOut size={16} />
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Card */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Personal Info */}
                <div className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <User size={20} className="text-brand-gold" />
                            البيانات الشخصية
                        </h3>
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-brand-muted hover:text-white transition-colors flex items-center gap-1 text-sm bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10"
                            >
                                <Edit2 size={14} />
                                <span>تعديل</span>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCancel}
                                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm bg-red-500/10 px-3 py-1.5 rounded-lg"
                                    disabled={isSaving}
                                >
                                    <X size={14} />
                                    <span>إلغاء</span>
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1 text-sm bg-green-500/10 px-3 py-1.5 rounded-lg"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div> : <Save size={14} />}
                                    <span>حفظ</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-brand-main rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-muted ml-4 shrink-0">
                                <Phone size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-brand-muted">رقم الهاتف</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-transparent border-b border-brand-gold text-white font-mono text-sm focus:outline-none py-1"
                                    />
                                ) : (
                                    <p className="text-white font-mono text-sm">{user.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-brand-main rounded-xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-muted ml-4 shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-brand-muted">تاريخ الانضمام</p>
                                <p className="text-white font-mono text-sm">{new Date().toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Status */}
                {user.subscriptionTier === 'pro' && (
                     <div className="bg-gradient-to-r from-green-900/40 to-brand-card border border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                             <CheckCircle className="text-green-500" size={24} />
                         </div>
                         <div>
                             <h4 className="text-white font-bold text-lg">اشتراكك فعال</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <Clock size={14} className="text-brand-gold" />
                                <p className="text-brand-muted text-sm">
                                    ينتهي في: <span className="text-white font-mono font-bold">{expiryDate}</span>
                                </p>
                             </div>
                             <p className="text-brand-muted/70 text-xs mt-1">لديك صلاحية الوصول الكاملة للمنصة.</p>
                         </div>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
};