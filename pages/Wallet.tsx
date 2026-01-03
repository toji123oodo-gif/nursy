
import React, { useMemo, useState, useEffect } from 'react';
/* Import Link from react-router-dom */
import { Link } from 'react-router-dom';
import { 
  Camera, MessageCircle, CheckCircle, Clock, CalendarCheck, Copy, 
  Smartphone, Zap, ShieldCheck, ChevronLeft, Info, CreditCard, 
  QrCode, ArrowRightCircle, Shield, Loader2, AlertCircle, HelpCircle, 
  Trophy, Activity, Key, Sparkles, Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';

export const Wallet: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'vodafone' | 'instapay' | 'code'>('vodafone');
  const [activationCode, setActivationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const VODAFONE_NUMBER = "01093077151";
  
  const isTrialActive = useMemo(() => {
    if (user?.subscriptionTier === 'pro' && user?.subscriptionExpiry) {
      const now = new Date();
      const expiry = new Date(user.subscriptionExpiry);
      // If the account was created recently (within last 30 days) and tier is pro
      return now < expiry;
    }
    return false;
  }, [user]);

  const daysLeft = useMemo(() => {
    if (user?.subscriptionExpiry) {
      const now = new Date();
      const expiry = new Date(user.subscriptionExpiry);
      const diff = expiry.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [user]);

  const handleActivateByCode = async () => {
    if (!activationCode || !db || !user) return;
    setIsProcessing(true);
    setError('');
    try {
      const query = await db.collection("activation_codes")
        .where("code", "==", activationCode.toUpperCase())
        .where("isUsed", "==", false)
        .limit(1)
        .get();

      if (query.empty) {
        setError('كود التفعيل غير صحيح أو مستخدم مسبقاً');
        setIsProcessing(false);
        return;
      }

      const codeDoc = query.docs[0];
      const codeData = codeDoc.data();
      
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (codeData.days || 30));

      // 1. Mark code as used
      await db.collection("activation_codes").doc(codeDoc.id).update({
        isUsed: true,
        usedBy: user.id,
        usedAt: new Date().toISOString()
      });

      // 2. Upgrade User
      await updateUserData({
        subscriptionTier: 'pro',
        subscriptionExpiry: expiry.toISOString()
      });

      setSuccess(true);
    } catch (e) {
      setError('حدث خطأ أثناء التفعيل، يرجى المحاولة لاحقاً');
    } finally {
      setIsProcessing(false);
    }
  };

  // Modified View for Trial Users
  if (isTrialActive) {
    return (
      <div className="min-h-screen py-16 px-4 md:px-10 flex flex-col items-center justify-center">
        <div className="bg-brand-card rounded-[4rem] p-12 max-w-2xl w-full text-center border border-brand-gold/20 shadow-glow relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full"></div>
            
            <div className="w-24 h-24 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Gift size={48} className="animate-bounce-slow" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">أنت في فترة التجربة!</h2>
            <p className="text-brand-muted mb-8 text-lg font-medium leading-relaxed">
               لقد منحناك <span className="text-brand-gold font-black">30 يوم PRO مجاناً</span> كهدية ترحيبية. <br/>
               استمتع بمشاهدة جميع الكورسات وتحميل الملازم.
            </p>

            <div className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 mb-10 flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center">
                   <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">الأيام المتبقية</p>
                   <p className="text-4xl font-black text-brand-gold">{daysLeft} يوم</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/10"></div>
                <div className="text-center">
                   <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">حالة الاشتراك</p>
                   <p className="text-lg font-black text-green-500 flex items-center gap-2"><Sparkles size={16}/> Trial PRO Active</p>
                </div>
            </div>

            <div className="space-y-4">
              <Link to="/dashboard" className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition-all text-xl">
                ابدأ المذاكرة الآن <ChevronLeft size={20}/>
              </Link>
              <button onClick={() => setSelectedMethod('vodafone')} className="w-full bg-white/5 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm border border-white/5">
                تجديد الاشتراك مبكراً؟
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 md:px-10 flex flex-col items-center">
      <div className="text-center mb-16 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">فعّل حسابك الآن</h1>
        <p className="text-brand-muted text-xl">اختر وسيلة الدفع المناسبة لك وابدأ رحلة التفوق.</p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Method Switcher */}
        <div className="flex bg-brand-card p-2 rounded-[2.5rem] border border-white/5">
          <button onClick={() => setSelectedMethod('vodafone')} className={`flex-1 py-5 rounded-[2rem] font-black transition-all ${selectedMethod === 'vodafone' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>فودافون كاش</button>
          <button onClick={() => setSelectedMethod('code')} className={`flex-1 py-5 rounded-[2rem] font-black transition-all ${selectedMethod === 'code' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>كود تفعيل</button>
        </div>

        {selectedMethod === 'code' ? (
          <div className="bg-brand-card p-10 md:p-14 rounded-[4rem] border border-brand-gold/20 shadow-2xl animate-fade-in">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-brand-gold/10 rounded-3xl flex items-center justify-center text-brand-gold mx-auto mb-6">
                   <Key size={40} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">تفعيل كود مركز نيرسي</h3>
                <p className="text-brand-muted">أدخل الكود المكون من 12 رقماً لتفعيل اشتراكك فوراً</p>
             </div>
             
             {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mb-6 font-bold">{error}</div>}
             {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center mb-6 font-bold">تم التفعيل بنجاح! جاري توجيهك...</div>}

             <div className="space-y-6">
               <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX" 
                value={activationCode}
                onChange={e => setActivationCode(e.target.value.toUpperCase())}
                className="w-full bg-brand-main border-2 border-white/10 rounded-[2rem] px-8 py-6 text-white text-3xl font-mono text-center tracking-widest focus:border-brand-gold outline-none transition-all"
               />
               <button 
                onClick={handleActivateByCode}
                disabled={isProcessing || !activationCode}
                className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-[2rem] shadow-glow text-xl hover:scale-[1.02] transition-all disabled:opacity-50"
               >
                 {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'تحقق وتفعيل الآن'}
               </button>
             </div>
          </div>
        ) : (
          <div className="bg-brand-card p-10 rounded-[4rem] border border-white/10 animate-fade-in text-center">
             <h3 className="text-3xl font-black text-white mb-6">فودافون كاش</h3>
             <div className="bg-brand-main p-8 rounded-3xl mb-8 flex flex-col items-center">
                <span className="text-brand-muted text-xs font-bold mb-4">رقم التحويل</span>
                <span className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter mb-6">{VODAFONE_NUMBER}</span>
                <button 
                  onClick={() => {navigator.clipboard.writeText(VODAFONE_NUMBER);}}
                  className="bg-brand-gold/10 text-brand-gold px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                ><Copy size={16}/> نسخ الرقم</button>
             </div>
             <p className="text-brand-muted mb-8">بعد التحويل، أرسل الإيصال عبر واتساب لتفعيل الحساب يدوياً خلال دقائق.</p>
             <a href={`https://wa.me/201093077151`} target="_blank" className="w-full bg-[#25D366] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 text-xl shadow-glow">
                <MessageCircle fill="white" /> أرسل الإيصال للتفعيل
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
