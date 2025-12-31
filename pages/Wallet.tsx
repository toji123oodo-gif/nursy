
import React, { useMemo, useState } from 'react';
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
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

type PaymentMethod = 'vodafone' | 'instapay';

export const Wallet: React.FC = () => {
  const { user } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('vodafone');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  // Constants for payment numbers
  const VODAFONE_NUMBER = "01093077151";
  const INSTAPAY_NUMBER = "01010582073";

  // Generate a random Order ID
  const orderId = useMemo(() => `#ORD-${Math.floor(1000 + Math.random() * 9000)}`, []);
  const todayDate = new Date().toLocaleDateString('en-GB');
  const amount = 50;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waNumber = "201093077151";
  const waMessage = `مرحباً، لقد قمت بتحويل مبلغ ${amount} جنيه للاشتراك الشهري عبر (${selectedMethod === 'vodafone' ? 'فودافون كاش' : 'انستا باي'}). مرفق صورة الإيصال للطلب ${orderId}. البريد الإلكتروني: ${user?.email}`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const handleSendClick = async () => {
    setShowSuccessMessage(true);
    if (db && user) {
        try {
            await addDoc(collection(db, "admin_notifications"), {
                type: 'payment',
                message: `قام ${user.name} بطلب تفعيل اشتراك (${orderId}) عبر واتساب.`,
                userName: user.name,
                timestamp: new Date().toISOString(),
                read: false
            });
        } catch (e) {
            console.error("Failed to notify admin about payment request", e);
        }
    }
    setTimeout(() => setShowSuccessMessage(false), 10000);
  };

  if (user?.subscriptionTier === 'pro') {
    const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString('ar-EG') : 'غير محدد';
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-brand-card rounded-3xl shadow-2xl shadow-green-900/20 p-10 max-w-md w-full text-center border border-green-500/20 animate-scale-up">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">الاشتراك مفعل</h2>
          <p className="text-brand-muted mb-4 text-lg">أنت تستمتع بصلاحية كاملة لمدة 30 يوم.</p>
          <div className="bg-brand-main/50 p-4 rounded-xl border border-white/5 mb-8">
            <p className="text-sm text-brand-muted mb-1">تاريخ انتهاء الاشتراك</p>
            <p className="text-xl font-bold text-brand-gold font-mono">{expiryDate}</p>
          </div>
          <Link to="/dashboard" className="block w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-all shadow-glow">
            تصفح الكورسات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center">
      
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-green-900/95 border border-green-500 text-green-100 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in-up backdrop-blur-md">
          <div className="bg-green-500/20 p-2 rounded-full shrink-0">
            <Clock size={24} className="text-green-400" />
          </div>
          <div>
            <p className="font-bold text-lg">تم إرسال الإيصال</p>
            <p className="text-sm opacity-90">جاري مراجعة طلبك، سيتم تفعيل الـ 30 يوم قريباً.</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">تفعيل الاشتراك</h1>
        <p className="text-brand-muted max-w-xl mx-auto text-lg leading-relaxed">
          اختر وسيلة الدفع المناسبة لك لتفعيل باقة الـ <span className="text-brand-gold font-bold">50 ج.م</span> الشاملة.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Methods and Payment */}
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Method Tabs */}
          <div className="flex bg-brand-card p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setSelectedMethod('vodafone')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${selectedMethod === 'vodafone' ? 'bg-red-600 text-white shadow-lg' : 'text-brand-muted hover:text-white'}`}
            >
              <Smartphone size={20} />
              فودافون كاش
            </button>
            <button 
              onClick={() => setSelectedMethod('instapay')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${selectedMethod === 'instapay' ? 'bg-[#502e7a] text-white shadow-lg' : 'text-brand-muted hover:text-white'}`}
            >
              <Zap size={20} />
              انستا باي
            </button>
          </div>

          {/* Payment Card Detail */}
          <div className="bg-brand-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none transition-colors ${selectedMethod === 'vodafone' ? 'bg-red-500' : 'bg-purple-500'}`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white text-xl font-black mb-1">
                    {selectedMethod === 'vodafone' ? 'التحويل عبر فودافون كاش' : 'التحويل عبر انستا باي'}
                  </h3>
                  <p className="text-brand-muted text-sm">حول المبلغ للرقم الموضح أدناه</p>
                </div>
                <div className={`p-4 rounded-2xl ${selectedMethod === 'vodafone' ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-400'}`}>
                  {selectedMethod === 'vodafone' ? <Smartphone size={32} /> : <Zap size={32} />}
                </div>
              </div>

              <div className="bg-brand-main border border-white/10 rounded-2xl p-6 mb-8 group-hover:border-brand-gold/30 transition-colors">
                <label className="block text-xs text-brand-muted mb-2 font-bold uppercase tracking-widest">رقم المستلم</label>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl md:text-3xl font-mono font-black text-white tracking-wider">
                    {selectedMethod === 'vodafone' ? VODAFONE_NUMBER : INSTAPAY_NUMBER}
                  </span>
                  <button 
                    onClick={() => handleCopy(selectedMethod === 'vodafone' ? VODAFONE_NUMBER : INSTAPAY_NUMBER)}
                    className="p-3 bg-white/5 rounded-xl hover:bg-brand-gold hover:text-brand-main transition-all relative"
                  >
                    {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    {copied && <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-main text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap">تم النسخ!</span>}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold mt-1">
                    <Info size={16} />
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    قم بتحويل مبلغ <span className="text-white font-bold">50 جنيهاً</span> فقط. تأكد من الاحتفاظ بصورة واضحة للإيصال أو رسالة التأكيد.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-brand-gold bg-brand-gold/10 px-4 py-3 rounded-xl border border-brand-gold/20 animate-pulse">
                  <Camera size={20} />
                  <span className="text-sm font-bold">هام: التقط صورة للفاتورة التالية بعد الدفع</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSendClick}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-[#25D366]/40 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            <MessageCircle size={24} fill="white" className="text-[#25D366]" />
            <span className="text-xl">تفعيل الاشتراك عبر واتساب</span>
          </a>
        </div>

        {/* Right Side: Visual Invoice */}
        <div className="animate-fade-in-up delay-200">
           <div className="relative group">
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-brand-gold p-4 rounded-2xl shadow-2xl z-20 animate-bounce-slow">
                 <ShieldCheck size={32} className="text-brand-main" />
              </div>

              {/* Invoice Card */}
              <div className="bg-brand-card ring-1 ring-brand-gold/50 border-t-8 border-t-brand-gold rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent"></div>
                
                {/* Invoice Header */}
                <div className="border-b border-dashed border-white/10 pb-8 mb-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-brand-main rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <CalendarCheck className="text-brand-gold" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">فاتورة اشتراك</h2>
                    <p className="text-brand-gold font-bold text-sm mt-1 uppercase tracking-widest">Nursy Premium Access</p>
                </div>

                {/* Invoice Body */}
                <div className="space-y-5 text-sm md:text-base relative z-10">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">اسم الطالب</span>
                        <span className="text-white font-bold">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">البريد الإلكتروني</span>
                        <span className="text-white font-mono text-sm opacity-80">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">رقم العملية (ID)</span>
                        <span className="text-brand-gold font-mono font-bold tracking-tighter">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">وسيلة الدفع</span>
                        <span className="text-white font-bold flex items-center gap-2">
                           {selectedMethod === 'vodafone' ? 'فودافون كاش' : 'انستا باي'}
                           <CheckCircle size={16} className="text-green-500" />
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">تاريخ الطلب</span>
                        <span className="text-white font-mono">{todayDate}</span>
                    </div>
                </div>

                {/* Total Footer */}
                <div className="mt-10 pt-8 border-t border-dashed border-white/10 flex justify-between items-end relative z-10">
                    <div>
                        <span className="block text-xs text-brand-muted mb-1 font-bold uppercase">الإجمالي المطلوب</span>
                        <span className="text-5xl font-black text-white">{amount} <span className="text-lg text-brand-gold">ج.م</span></span>
                    </div>
                    <div className="opacity-30">
                        <div className="w-20 h-20 border-4 border-white border-double rounded-full flex items-center justify-center rotate-12">
                            <span className="text-[10px] font-black text-white text-center leading-tight transform -rotate-12">NURSY<br/>OFFICIAL<br/>STAMP</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Extra Info Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <div className="bg-brand-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-xs text-brand-muted flex items-center gap-2">
                      <Clock size={14} className="text-brand-gold" />
                      صلاحية لمدة 30 يوم
                  </div>
                  <div className="bg-brand-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-xs text-brand-muted flex items-center gap-2">
                      <ShieldCheck size={14} className="text-brand-gold" />
                      وصول كامل لجميع المواد
                  </div>
              </div>
           </div>
        </div>

      </div>

      {/* Footer Support */}
      <div className="mt-16 text-center animate-fade-in opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-sm text-brand-muted">تواجه مشكلة في الدفع؟</p>
          <Link to="/help" className="text-brand-gold text-sm font-bold hover:underline flex items-center justify-center gap-1 mt-1">
              تواصل مع الدعم الفني <ChevronLeft size={16} />
          </Link>
      </div>

    </div>
  );
};
