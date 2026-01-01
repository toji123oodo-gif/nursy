
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Mail, 
  HelpCircle, 
  CheckCircle, 
  MessageCircle, 
  Smartphone, 
  ShieldCheck, 
  BookOpen, 
  CreditCard, 
  UserCircle,
  Sparkles,
  ArrowRight,
  Settings,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';

interface FAQItem {
  question: string;
  answer: string;
  category: 'account' | 'payment' | 'content' | 'general';
}

const faqs: FAQItem[] = [
  {
    category: 'payment',
    question: 'كيف يمكنني تفعيل اشتراك PRO؟',
    answer: 'يمكنك التفعيل عبر صفحة "المحفظة". قم بتحويل مبلغ 50 جنيهاً عبر فودافون كاش أو انستا باي، ثم التقط صورة للإيصال وأرسلها عبر زر الواتساب الموجود في نفس الصفحة. يتم التفعيل عادة خلال 15-30 دقيقة.'
  },
  {
    category: 'content',
    question: 'هل يمكنني تحميل الفيديوهات لمشاهدتها بدون إنترنت؟',
    answer: 'للحفاظ على حقوق الملكية الفكرية، الفيديوهات متاحة للمشاهدة مباشرة عبر المنصة فقط. ومع ذلك، يمكنك تحميل جميع المذكرات والملفات المرفقة بصيغة PDF للمذاكرة في أي وقت.'
  },
  {
    category: 'account',
    question: 'نسيت كلمة المرور، كيف يمكنني استعادتها؟',
    answer: 'في صفحة تسجيل الدخول، انقر على "نسيت كلمة المرور" وسيصلك رابط إعادة التعيين على بريدك الإلكتروني. إذا كنت سجلت برقم الهاتف، تواصل مع الدعم الفني مباشرة لتصفير كلمة المرور.'
  },
  {
    category: 'content',
    question: 'هل المحتوى يغطي مناهج جميع كليات التمريض؟',
    answer: 'نعم، المحتوى مصمم ليغطي المناهج الموحدة لكليات التمريض والمعاهد الفنية للتمريض في جمهورية مصر العربية، مع التركيز على النقاط الهامة في الامتحانات.'
  },
  {
    category: 'general',
    question: 'كيف أحصل على شهادة إتمام الكورس؟',
    answer: 'بمجرد مشاهدة جميع محاضرات الكورس بنسبة 100%، سيظهر لك زر "استخراج الشهادة" في صفحة الكورس. الشهادة تصدر باسمك وتكون موثقة بكود QR للتأكد من صحتها.'
  }
];

const supportCategories = [
  { id: 'general', label: 'استفسار عام', icon: HelpCircle },
  { id: 'payment', label: 'مشاكل الدفع والاشتراك', icon: CreditCard },
  { id: 'technical', label: 'مشكلة تقنية في الموقع', icon: Settings },
  { id: 'content', label: 'استفسار عن المحتوى الدراسي', icon: BookOpen }
];

export const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', category: 'general' });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (db) {
        try {
            const categoryLabel = supportCategories.find(c => c.id === formData.category)?.label || 'غير محدد';
            await db.collection("admin_notifications").add({
                type: 'support',
                category: formData.category,
                message: `[${categoryLabel}] رسالة من ${formData.name}: ${formData.message}`,
                userName: formData.name,
                userEmail: formData.email,
                timestamp: new Date().toISOString(),
                read: false
            });
            setIsSent(true);
            setFormData({ name: '', email: '', message: '', category: 'general' });
        } catch (e) {
            console.error("Support submission error", e);
        } finally {
            setIsSubmitting(false);
        }
    }
    setTimeout(() => setIsSent(false), 5000);
  };

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  const whatsappNumber = "201093077151";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً Nursy، أحتاج للمساعدة بخصوص...')}`;

  return (
    <div className="min-h-screen bg-brand-main relative overflow-hidden">
        {/* Help Center UI logic remains the same */}
      <section className="relative pt-20 pb-16 px-6 text-center">
        <div className="container mx-auto">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/30 mb-8 animate-fade-in-up">
                <Sparkles size={16} className="text-brand-gold" />
                <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">دعم فني متخصص</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                كيف يمكننا <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-yellow-200">مساعدتك اليوم؟</span>
            </h1>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                ابحث في الأسئلة الشائعة أو تواصل مباشرة مع فريق الدعم الفني لنيرسي.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-wrap gap-3 bg-brand-card/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
                {['all', 'account', 'payment', 'content'].map(catId => (
                    <button key={catId} onClick={() => setActiveCategory(catId)} className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all border ${activeCategory === catId ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-[1.02]' : 'text-brand-muted border-transparent hover:bg-white/5 hover:text-white'}`}>
                        {catId === 'all' ? 'الكل' : catId === 'account' ? 'الحساب' : catId === 'payment' ? 'الاشتراكات' : 'المحتوى'}
                    </button>
                ))}
            </div>
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 group hover:border-brand-gold/30 hover:shadow-2xl">
                  <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 md:p-8 text-right text-white font-bold transition-colors relative overflow-hidden">
                    <span className="text-lg md:text-xl leading-relaxed relative z-10">{faq.question}</span>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative z-10 ${openIndex === idx ? 'bg-brand-gold text-brand-main' : 'bg-white/5 text-brand-muted group-hover:text-brand-gold'}`}>
                        {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-6 md:p-8 pt-0 text-brand-muted text-lg leading-relaxed border-t border-white/5 bg-brand-main/20">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="sticky top-28 bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                {isSent ? (
                    <div className="text-center py-20 animate-scale-up relative z-10">
                        <CheckCircle className="text-green-500 mx-auto mb-8" size={48} />
                        <h3 className="text-3xl font-black text-white mb-4">وصلت رسالتك!</h3>
                        <p className="text-brand-muted mb-10 text-lg">شكراً لتواصلك مع نيرسي.</p>
                        <button onClick={() => setIsSent(false)} className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-2xl hover:bg-brand-goldHover shadow-glow transition-all">إرسال رسالة أخرى</button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-10">تواصل معنا</h2>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner" placeholder="أدخل اسمك هنا..." />
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner" placeholder="example@mail.com" />
                            <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full appearance-none bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner cursor-pointer">
                                {supportCategories.map((cat) => (<option key={cat.id} value={cat.id} className="bg-brand-card text-white">{cat.label}</option>))}
                            </select>
                            <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none resize-none transition-all shadow-inner" placeholder="اكتب استفسارك بالتفصيل..."></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 shadow-glow active:scale-95 disabled:opacity-50 group/btn">
                                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
