
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Camera, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  CalendarCheck, 
  Copy, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  ChevronLeft,
  Info,
  CreditCard,
  QrCode,
  ArrowRightCircle,
  Shield,
  Loader2,
  AlertCircle,
  HelpCircle,
  Trophy,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

type PaymentMethod = 'vodafone' | 'instapay';

export const Wallet: React.FC = () => {
  const { user } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('vodafone');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const VODAFONE_NUMBER = "01093077151";
  const INSTAPAY_NUMBER = "01010582073";

  useEffect(() => {
    if (user?.id) {
      const submitted = localStorage.getItem(`nursy_payment_sent_${user.id}`);
      if (submitted === 'true') {
        setIsSubmitted(true);
      }
    }
  }, [user?.id]);

  const orderId = useMemo(() => `#NRS-${Math.floor(100000 + Math.random() * 900000)}`, []);
  const amount = 50;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waNumber = "201093077151";
  const waMessage = `مرحباً Nursy، لقد قمت بتحويل ${amount} ج.م للاشتراك في باقة PRO.\n\nكود الطلب: ${orderId}\nالبريد: ${user?.email}\nالوسيلة: ${selectedMethod === 'vodafone' ? 'فودافون كاش' : 'انستا باي'}\n\nمرفق صورة الإيصال للتحقق.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
  const whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent('مرحباً Nursy، أحتاج للمساعدة بخصوص...')}`;

  const handleSendClick = async () => {
    if (isSubmitted) return;
    
    setShowSuccessMessage(true);
    setIsSubmitted(true);
    
    if (user?.id) {
        localStorage.setItem(`nursy_payment_sent_${user.id}`, 'true');
    }

    if (user && db) {
        try {
            await db.collection("admin_notifications").add({
                type: 'payment',
                message: `قام ${user.name} بطلب تفعيل اشتراك (${orderId}) عبر واتساب.`,
                userName: user.name,
                timestamp: new Date().toISOString(),
                read: false
            });
        } catch (e) {
            console.error("Failed to notify admin", e);
        }
    }
    setTimeout(() => setShowSuccessMessage(false), 8000);
  };

  if (user?.subscriptionTier === 'pro') {
    const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'غير محدد';
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-brand-card rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 max-w-lg w-full text-center border border-green-500/20 animate-scale-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <div className="w-28 h-28 bg-green-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-glow-hover ring-2 ring-green-500/30 animate-bounce-slow">
              <Trophy className="text-green-500" size={56} />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">أنت الآن عضو PRO!</h2>
            <p className="text-brand-muted mb-10 text-lg">استمتع بالوصول غير المحدود لجميع ميزات Nursy التعليمية.</p>
            
            <div className="bg-brand-main/60 backdrop-blur-3xl p-8 rounded-3xl border border-white/5 mb-10 shadow-inner group">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-brand-muted font-black uppercase tracking-[0.3em]">حالة الحساب</span>
                    <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-green-500/30">
                        <Activity size={10} className="animate-pulse" /> مفعّل الآن
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-brand-muted font-bold mb-1">تاريخ انتهاء الاشتراك</p>
                    <p className="text-2xl font-black text-brand-gold">{expiryDate}</p>
                </div>
            </div>
            
            <Link to="/dashboard" className="flex items-center justify-center gap-4 w-full bg-brand-gold text-brand-main font-black py-6 rounded-2xl hover:bg-brand-goldHover transition-all shadow-glow hover:scale-[1.02] transform">
              <span className="text-xl">ابدأ رحلة التميز</span>
              <ArrowRightCircle size={24} className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 md:px-10 flex flex-col items-center relative overflow-hidden">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

      {/* Modern Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-[95%] max-w-xl bg-brand-card/90 backdrop-blur-3xl border-2 border-green-500/40 p-6 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-6 animate-fade-in-up">
          <div className="w-16 h-16 bg-green-500/20 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-green-500/20 shadow-glow">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <div className="text-right">
            <p className="font-black text-2xl text-white mb-1">تم إرسال طلبك بنجاح!</p>
            <p className="text-sm text-brand-muted font-medium">راجع الواتساب الخاص بك، سيصلك رد التفعيل خلال دقائق معدودة.</p>
          </div>
        </div>
      )}

      {/* Simplified Page Header */}
      <div className="text-center mb-16 animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2.5 rounded-full border border-brand-gold/30 mb-8 shadow-glow">
            <Shield size={16} className="text-brand-gold" />
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">بوابة دفع آمنة ومعتمدة</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
            فعّل اشتراكك <br/> <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-yellow-300 to-white">في ثواني معدودة</span>
        </h1>
        <p className="text-brand-muted max-w-3xl mx-auto text-xl md:text-2xl font-light leading-relaxed">
          انضم لأكثر من 5000 طالب تمريض متميز واستمتع بكافة مميزات <span className="text-white font-black underline decoration-brand-gold/30">Nursy PRO</span> مقابل 50 ج.م فقط.
        </p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
        
        {/* Step-by-Step Payment Interface (7 Cols) */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
          
          {/* Visual Step Guide */}
          <div className="bg-brand-card/30 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center justify-between mb-2">
             {[
               { icon: Smartphone, label: "حوّل", color: "gold" },
               { icon: Camera, label: "صوّر", color: "blue-400" },
               { icon: MessageCircle, label: "فعّل", color: "green-400" }
             ].map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${i === 0 ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow' : 'bg-brand-main border-white/10 text-brand-muted'}`}>
                        <step.icon size={22} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${i === 0 ? 'text-brand-gold' : 'text-brand-muted'}`}>{step.label}</span>
                    {i < 2 && <div className="absolute top-6 left-[-20%] w-[40%] h-px bg-white/10 hidden md:block"></div>}
                </div>
             ))}
          </div>

          {/* Enhanced Method Switcher */}
          <div className="relative flex bg-brand-main/60 p-2 rounded-[2.5rem] border border-white/5 shadow-inner">
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-8px)] rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                selectedMethod === 'vodafone' ? 'right-2 bg-[#e60000] shadow-[0_10px_30px_rgba(230,0,0,0.3)]' : 'right-[calc(50%+6px)] bg-[#502e7a] shadow-[0_10px_30px_rgba(80,46,122,0.3)]'
              }`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]"></div>
            </div>
            
            <button 
              onClick={() => !isSubmitted && setSelectedMethod('vodafone')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] font-black text-xl transition-all duration-500 ${selectedMethod === 'vodafone' ? 'text-white' : 'text-brand-muted'}`}
            >
              <Smartphone size={24} className={selectedMethod === 'vodafone' ? 'animate-bounce-slow' : ''} />
              فودافون كاش
            </button>
            <button 
              onClick={() => !isSubmitted && setSelectedMethod('instapay')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] font-black text-xl transition-all duration-500 ${selectedMethod === 'instapay' ? 'text-white' : 'text-brand-muted'}`}
            >
              <Zap size={24} className={selectedMethod === 'instapay' ? 'animate-pulse' : ''} />
              انستا باي
            </button>
          </div>

          {/* Interactive Payment Details Card */}
          <div className="bg-brand-card/80 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 md:p-14 relative overflow-hidden group shadow-2xl">
            {/* Ambient Background Light */}
            <div className={`absolute -top-32 -right-32 w-80 h-80 blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 ${selectedMethod === 'vodafone' ? 'bg-red-500' : 'bg-purple-500'}`}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12 gap-8 text-center md:text-right">
                <div>
                  <h3 className="text-white text-4xl font-black mb-3 flex items-center gap-4 justify-center md:justify-start">
                    {selectedMethod === 'vodafone' ? 'فودافون كاش' : 'انستا باي'}
                    <div className="bg-brand-gold/10 p-2 rounded-xl"><Info size={20} className="text-brand-gold" /></div>
                  </h3>
                  <p className="text-brand-muted text-xl font-medium">حوّل قيمة الاشتراك للرقم الموضح</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] shadow-2xl transform group-hover:rotate-12 transition-transform duration-700 ${selectedMethod === 'vodafone' ? 'bg-red-600/10 text-red-500' : 'bg-purple-600/10 text-purple-400'}`}>
                  {selectedMethod === 'vodafone' ? <QrCode size={64} /> : <CreditCard size={64} />}
                </div>
              </div>

              {/* Central Number Display */}
              <div className="bg-brand-main/40 border border-white/5 rounded-[3rem] p-12 mb-12 group-hover:border-brand-gold/40 transition-all shadow-inner relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
                <label className="block text-[10px] text-brand-muted mb-6 font-black uppercase tracking-[0.4em] opacity-40">رقم المحفظة / العنوان الرقمي</label>
                
                <div className="flex flex-col items-center gap-10">
                  <span className="text-5xl md:text-7xl font-mono font-black text-white tracking-[0.15em] drop-shadow-glow selection:bg-brand-gold selection:text-brand-main">
                    {selectedMethod === 'vodafone' ? VODAFONE_NUMBER : INSTAPAY_NUMBER}
                  </span>
                  <button 
                    onClick={() => handleCopy(selectedMethod === 'vodafone' ? VODAFONE_NUMBER : INSTAPAY_NUMBER)}
                    className="flex items-center gap-4 bg-brand-gold text-brand-main font-black px-12 py-5 rounded-[1.8rem] hover:bg-brand-goldHover transition-all relative overflow-hidden group/copy shadow-glow"
                  >
                    {copied ? (
                        <>
                            <CheckCircle size={24} strokeWidth={3} />
                            <span className="text-xl">تم النسخ!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={24} strokeWidth={3} />
                            <span className="text-xl">نسخ الرقم</span>
                        </>
                    )}
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/copy:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                  <div className="p-3.5 bg-brand-gold/20 rounded-2xl text-brand-gold shrink-0">
                    <CreditCard size={24} />
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed font-medium">
                    يرجى تحويل <span className="text-white font-black underline decoration-brand-gold/30">50 جنيهاً</span> فقط لضمان سرعة التفعيل التلقائي للنظام.
                  </p>
                </div>
                
                <div className="flex items-center gap-5 bg-brand-gold/5 px-6 py-6 rounded-[2rem] border border-brand-gold/20">
                  <div className="w-14 h-14 bg-brand-gold rounded-2xl text-brand-main flex items-center justify-center shadow-glow shrink-0 animate-pulse">
                     <Camera size={28} />
                  </div>
                  <span className="text-xs font-black leading-tight text-white/90">لا تنسَ التقاط لقطة شاشة (Screenshot) لعملية التحويل</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Action Button */}
          <div className="relative group">
            {isSubmitted ? (
               <div className="relative w-full bg-brand-card/50 backdrop-blur-md border border-white/10 text-brand-muted font-black py-8 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-5">
                  <Loader2 size={36} className="text-brand-gold animate-spin" />
                  <div className="text-right">
                      <span className="block text-2xl leading-none mb-1">طلبك قيد المراجعة</span>
                      <span className="text-[10px] font-bold opacity-60 tracking-widest uppercase">سيصلك إشعار التفعيل فوراً</span>
                  </div>
               </div>
            ) : (
              <>
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#25D366] via-green-400 to-[#25D366] rounded-[2.8rem] blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
                <a 
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSendClick}
                    className="relative w-full bg-[#25D366] hover:bg-[#1faa54] text-white font-black py-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center gap-6 transform hover:-translate-y-2 active:scale-95 group/btn"
                >
                    <div className="bg-white/20 p-3 rounded-full shadow-inner group-hover/btn:scale-110 transition-transform">
                        <MessageCircle size={36} fill="white" className="text-[#25D366]" />
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl leading-none mb-1">أرسل الإيصال وفعّل الآن</span>
                        <span className="text-[10px] font-bold opacity-80 tracking-[0.3em] uppercase">خدمة عملاء Nursy (24/7)</span>
                    </div>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Premium Digital Invoice Column (5 Cols) */}
        <div className="lg:col-span-5 animate-fade-in-up delay-200 lg:sticky lg:top-28">
           <div className="relative">
              {/* Security Shield Overlay */}
              <div className="absolute -top-12 -left-6 bg-brand-main border-2 border-brand-gold p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20 animate-float">
                 <ShieldCheck size={56} className="text-brand-gold" />
              </div>

              {/* Professional Receipt Design */}
              <div className="bg-brand-card ring-1 ring-white/10 border-t-[16px] border-t-brand-gold rounded-[3.5rem] p-10 md:p-14 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-60"></div>
                
                {/* Security Background Micro-text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                    <p className="text-[12rem] font-black rotate-[35deg] whitespace-nowrap tracking-tighter">NURSY PRO</p>
                </div>

                {/* Receipt Header */}
                <div className="border-b-4 border-dashed border-white/5 pb-10 mb-10 text-center relative z-10">
                    <div className="w-24 h-24 bg-brand-main border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700 ring-4 ring-white/5">
                        <CalendarCheck className="text-brand-gold" size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-3">تفاصيل الطلب</h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></div>
                        <p className="text-brand-gold font-black text-[11px] uppercase tracking-[0.5em]">Digital Receipt v2.0</p>
                    </div>
                </div>

                {/* Receipt Details List */}
                <div className="space-y-7 text-base relative z-10">
                    <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                        <span className="text-brand-muted font-bold text-xs uppercase tracking-[0.2em]">اسم الطالب</span>
                        <span className="text-white font-black text-lg">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                        <span className="text-brand-muted text-sm font-medium">البريد الإلكتروني</span>
                        <span className="text-white font-mono text-xs opacity-60 truncate max-w-[180px]">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                        <span className="text-brand-muted text-sm font-medium">كود الطلب</span>
                        <div className="flex items-center gap-2">
                             <span className="text-brand-gold font-mono font-black tracking-tighter text-xl">{orderId}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-4">
                        <span className="text-brand-muted text-sm font-medium">نوع الاشتراك</span>
                        <span className="text-white font-black flex items-center gap-2.5">
                           Premium PRO
                           <Shield size={16} className="text-brand-gold" />
                        </span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                        <span className="text-brand-muted text-sm font-medium">الوسيلة المختارة</span>
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${selectedMethod === 'vodafone' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'}`}>
                           {selectedMethod === 'vodafone' ? 'Vodafone Cash' : 'InstaPay'}
                        </div>
                    </div>
                    {isSubmitted && (
                       <div className="flex justify-between items-center bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/10">
                          <span className="text-brand-gold text-xs font-black uppercase">حالة المراجعة</span>
                          <span className="text-white font-black text-sm flex items-center gap-3">
                             جاري التأكد <Loader2 size={16} className="animate-spin text-brand-gold" />
                          </span>
                       </div>
                    )}
                </div>

                {/* Total Payment Footer */}
                <div className="mt-14 pt-10 border-t-4 border-dashed border-white/5 relative z-10">
                    <div className="flex items-end justify-between">
                        <div className="space-y-2">
                            <span className="block text-[11px] text-brand-muted font-black uppercase tracking-[0.4em] opacity-40">المبلغ الإجمالي</span>
                            <div className="flex items-end gap-3">
                                <span className="text-8xl font-black text-white leading-none tracking-tighter">{amount}</span>
                                <span className="text-2xl text-brand-gold font-black mb-1.5">ج.م</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 opacity-50 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110">
                            <div className="w-28 h-28 border-[8px] border-white/10 border-double rounded-full flex flex-col items-center justify-center -rotate-12 transform group-hover:rotate-0 transition-transform">
                                <span className="text-[12px] font-black text-white text-center leading-none mb-1">PRO</span>
                                <span className="text-[9px] font-bold text-brand-gold">SECURED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jagged Edge Simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-4 flex gap-1 px-2 opacity-5">
                    {Array.from({length: 20}).map((_, i) => (
                        <div key={i} className="flex-1 bg-white h-4 rounded-t-full"></div>
                    ))}
                </div>
              </div>

              {/* Modern Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-5">
                  <div className="bg-brand-card/50 backdrop-blur-2xl px-6 py-4 rounded-[1.5rem] border border-white/5 text-xs text-brand-muted flex items-center gap-3 shadow-2xl">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
                      <span className="font-black">متوسط التفعيل: 15 دقيقة</span>
                  </div>
                  <div className="bg-brand-card/50 backdrop-blur-2xl px-6 py-4 rounded-[1.5rem] border border-white/5 text-xs text-brand-muted flex items-center gap-3 shadow-2xl">
                      <ShieldCheck size={18} className="text-brand-gold" />
                      <span className="font-black">نظام حماية ضد الاحتيال</span>
                  </div>
              </div>
           </div>
        </div>

      </div>

      {/* Modern Footer Help */}
      <footer className="mt-28 text-center animate-fade-in relative z-10 w-full max-w-3xl px-6">
          <div className="bg-brand-card/60 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mx-auto mb-6">
                  <HelpCircle size={32} />
              </div>
              <p className="text-2xl text-white font-black mb-4">واجهت مشكلة في الدفع؟</p>
              <p className="text-brand-muted font-medium mb-8 leading-relaxed">فريق نيرسي جاهز لمساعدتك في أي وقت. تواصل معنا مباشرة وسنقوم بحل المشكلة فوراً.</p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Link to="/help" className="inline-flex items-center justify-center gap-4 text-brand-gold text-xl font-black bg-brand-gold/10 px-10 py-5 rounded-2xl hover:bg-brand-gold hover:text-brand-main transition-all group">
                      مركز المساعدة
                      <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-4 text-[#25D366] text-xl font-black bg-[#25D366]/10 px-10 py-5 rounded-2xl hover:bg-[#25D366] hover:text-white transition-all group">
                      دعم واتساب
                      <MessageCircle size={24} fill="currentColor" />
                  </a>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-right">
                  <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-brand-muted uppercase tracking-[0.4em] font-black mb-1 opacity-40">دعم العمليات</p>
                      <p className="text-white font-mono font-bold text-lg">billing@nursy.com</p>
                  </div>
                  <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-brand-muted uppercase tracking-[0.4em] font-black mb-1 opacity-40">ساعات التفعيل</p>
                      <p className="text-white font-black text-lg">متاح 24 ساعة / 7 أيام</p>
                  </div>
              </div>
          </div>
      </footer>

      <style>{`
        .drop-shadow-glow {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.3));
        }
      `}</style>
    </div>
  );
};
