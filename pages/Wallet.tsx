
import React from 'react';
import { Crown, CheckCircle2, Shield, Star, Zap, Infinity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Wallet: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#E5E5E5] dark:border-[#333] pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Shield size={24} className="text-[#F38020]" /> حالة العضوية
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تفاصيل المنحة الدراسية والمميزات المتاحة.</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
            <Crown size={14} fill="currentColor" /> اشتراك النخبة (نشط)
        </div>
      </div>

      {/* Hero Card */}
      <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#000] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-gray-800">
         {/* Abstract Shapes */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-[#F38020] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-6 text-center md:text-right">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                        منحة تعليمية <br/> <span className="text-[#F38020]">شاملة 100%</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                        استمتع بوصول غير محدود لجميع الكورسات، أدوات الذكاء الاصطناعي، والشهادات المعتمدة مجاناً بالكامل.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                        <Infinity size={16} className="text-blue-400" /> وصول مدى الحياة
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                        <Zap size={16} className="text-yellow-400" /> ميزات AI مفتوحة
                    </div>
                </div>
            </div>

            <div className="w-48 h-48 md:w-64 md:h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F38020] to-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                    alt="Premium Badge" 
                    className="relative w-full h-full object-contain drop-shadow-2xl"
                />
            </div>
         </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { title: "كورسات غير محدودة", desc: "فتح جميع المحاضرات وملفات الـ PDF دون قيود.", icon: CheckCircle2, color: "text-green-500" },
            { title: "تحليل فيديو بالذكاء الاصطناعي", desc: "استخدام أداة تحليل الإجراءات الطبية بلا حدود.", icon: Zap, color: "text-blue-500" },
            { title: "شهادات موثقة", desc: "إصدار شهادات فورية عند إتمام المسارات التعليمية.", icon: Shield, color: "text-purple-500" },
            { title: "بنك الأسئلة", desc: "وصول كامل لأرشيف الامتحانات والمراجعات.", icon: Star, color: "text-yellow-500" },
            { title: "دعم فني متميز", desc: "أولوية الرد من فريق الدعم الفني.", icon: Crown, color: "text-orange-500" },
            { title: "مجتمع الطلاب", desc: "الانضمام لجميع قنوات النقاش والمجموعات.", icon: CheckCircle2, color: "text-green-500" },
         ].map((feature, idx) => (
             <div key={idx} className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-gray-100 dark:border-[#333] hover:shadow-lg transition-shadow">
                 <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center mb-4 ${feature.color}`}>
                     <feature.icon size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
             </div>
         ))}
      </div>
    </div>
  );
};
