import React, { useMemo, useState } from 'react';
import { Camera, MessageCircle, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const Wallet: React.FC = () => {
  const { user } = useApp();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Generate a random Order ID once per session/render
  const orderId = useMemo(() => `#ORD-${Math.floor(1000 + Math.random() * 9000)}`, []);
  const todayDate = new Date().toLocaleDateString('en-GB');
  const amount = 250;
  
  // WhatsApp Link Construction
  const waNumber = "201093077151";
  const waMessage = `Hello, I have made a payment of ${amount} EGP. Here is my receipt screenshot for Order ${orderId}. My Email is: ${user?.email}`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const handleSendClick = () => {
    setShowSuccessMessage(true);
    // Hide message after 10 seconds
    setTimeout(() => setShowSuccessMessage(false), 10000);
  };

  if (user?.subscriptionTier === 'pro') {
      return (
          <div className="min-h-[80vh] flex items-center justify-center p-4">
              <div className="bg-brand-card rounded-3xl shadow-2xl shadow-green-900/20 p-10 max-w-md w-full text-center border border-green-500/20">
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
                      <CheckCircle className="text-green-500" size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">الحساب مفعل!</h2>
                  <p className="text-brand-muted mb-8 text-lg">أنت تمتلك صلاحية الدخول الكاملة للمنصة.</p>
                  <Link to="/dashboard" className="block w-full bg-brand-gold text-brand-main font-bold py-4 rounded-xl hover:bg-brand-goldHover transition-colors shadow-glow">
                      الذهاب للكورسات
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center relative">
        
        {/* Success Toast */}
        {showSuccessMessage && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-green-900/95 border border-green-500 text-green-100 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in-up backdrop-blur-md">
                <div className="bg-green-500/20 p-2 rounded-full shrink-0">
                    <Clock size={24} className="text-green-400" />
                </div>
                <div>
                    <p className="font-bold text-lg">تم إرسال الإيصال</p>
                    <p className="text-sm opacity-90">جاري مراجعة طلبك، سيتم تفعيل الحساب قريباً.</p>
                </div>
                <button onClick={() => setShowSuccessMessage(false)} className="mr-auto text-green-300 hover:text-white">
                    <CheckCircle size={20} />
                </button>
            </div>
        )}
        
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-4">تأكيد الاشتراك والدفع</h1>
            <p className="text-brand-muted max-w-xl mx-auto text-lg">خطوة واحدة تفصلك عن التميز. قم بتحويل المبلغ وأرسل الإيصال.</p>
        </div>

        {/* Invoice Card Component */}
        <div className="w-full max-w-md bg-brand-main relative group perspective-1000 mb-8">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-yellow-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-brand-card ring-1 ring-brand-gold border-t-4 border-t-brand-gold rounded-lg p-8 shadow-2xl">
                {/* Header */}
                <div className="border-b border-dashed border-white/10 pb-6 mb-6 text-center">
                    <h2 className="text-2xl font-black text-brand-gold tracking-wide uppercase">Nursy Payment Receipt</h2>
                    <p className="text-white/50 text-sm mt-1">فاتورة دفع إلكتروني</p>
                </div>

                {/* Details */}
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">Student Name</span>
                        <span className="text-white font-bold">{user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">Email</span>
                        <span className="text-white font-mono text-xs">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">Course / Plan</span>
                        <span className="text-white font-bold">Nursy Premium (Full Access)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-muted">Date</span>
                        <span className="text-white font-mono">{todayDate}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-brand-muted">Order Ref</span>
                        <span className="text-brand-gold font-mono font-bold tracking-widest">{orderId}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-8 pt-6 border-t border-dashed border-white/10 flex justify-between items-end">
                    <div>
                        <span className="block text-xs text-brand-muted mb-1">Total Amount</span>
                        <span className="text-3xl font-black text-white">{amount} <span className="text-sm text-brand-gold">EGP</span></span>
                    </div>
                    <div className="opacity-50 grayscale">
                        <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center rotate-12">
                            <span className="text-[10px] font-bold text-white text-center leading-none transform -rotate-12">PAID<br/>PENDING</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Instructions */}
        <div className="flex items-center gap-2 text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full mb-8 border border-brand-gold/20 animate-pulse">
            <Camera size={18} />
            <span className="text-sm font-bold">خذ "سكرين شوت" لهذه الفاتورة الآن</span>
        </div>

        {/* WhatsApp Button */}
        <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSendClick}
            className="w-full max-w-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#25D366]/40 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 cursor-pointer"
        >
            <MessageCircle size={24} fill="white" className="text-[#25D366]" />
            <span className="text-lg">إرسال الفاتورة الآن</span>
        </a>
        
        <p className="text-brand-muted text-xs mt-4 text-center max-w-xs">
            سيتم تفعيل حسابك فور استلام إيصال التحويل وصورة الفاتورة عبر واتساب.
        </p>

        <div className="mt-12 flex items-center gap-2 text-brand-muted/50 text-xs">
            <ShieldCheck size={12} />
            <span>Secure SSL Payment Verification</span>
        </div>

    </div>
  );
};