
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
import { collection, addDoc } from 'firebase/firestore';
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
            await addDoc(collection(db, "admin_notifications"), {
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
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>

      {/* Hero Header */}
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
          
          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 bg-brand-card/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
                {[
                    { id: 'all', label: 'الكل', icon: HelpCircle },
                    { id: 'account', label: 'الحساب', icon: UserCircle },
                    { id: 'payment', label: 'الاشتراكات', icon: CreditCard },
                    { id: 'content', label: 'المحتوى', icon: BookOpen }
                ].map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all border ${
                            activeCategory === cat.id 
                            ? 'bg-brand-gold text-brand-main border-brand-gold shadow-glow scale-[1.02]' 
                            : 'text-brand-muted border-transparent hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <cat.icon size={18} />
                        <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-brand-card border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 group hover:border-brand-gold/30 hover:shadow-2xl">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-right text-white font-bold transition-colors relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/[0.02] transition-colors"></div>
                    <span className="text-lg md:text-xl leading-relaxed relative z-10">{faq.question}</span>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative z-10 ${openIndex === idx ? 'bg-brand-gold text-brand-main' : 'bg-white/5 text-brand-muted group-hover:text-brand-gold'}`}>
                        {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>
                  <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                      <div className="p-6 md:p-8 pt-0 text-brand-muted text-lg leading-relaxed border-t border-white/5 bg-brand-main/20">
                          {faq.answer}
                      </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366]/10 border border-[#25D366]/30 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group hover:bg-[#25D366]/20 transition-all shadow-xl"
                >
                    <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <MessageCircle size={32} fill="white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white mb-2">واتساب مباشر</h4>
                        <p className="text-xs text-brand-muted font-medium">أسرع وسيلة للحصول على رد فوري</p>
                    </div>
                    <span className="text-[#25D366] font-black flex items-center gap-2 text-sm uppercase tracking-widest">ارسل رسالة الآن <ArrowRight size={14} className="rotate-180" /></span>
                </a>

                <div className="bg-brand-gold/10 border border-brand-gold/30 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group shadow-xl">
                    <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-main shadow-lg group-hover:scale-110 transition-transform">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white mb-2">أمان بياناتك</h4>
                        <p className="text-xs text-brand-muted font-medium">نضمن خصوصية تامة لجميع استفساراتك</p>
                    </div>
                    <span className="text-brand-gold font-black flex items-center gap-2 text-sm uppercase tracking-widest">نظام مشفر بالكامل</span>
                </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="sticky top-28 bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
                
                {isSent ? (
                    <div className="text-center py-20 animate-scale-up relative z-10">
                        <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-glow ring-2 ring-green-500/20">
                            <CheckCircle className="text-green-500" size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4">وصلت رسالتك!</h3>
                        <p className="text-brand-muted mb-10 text-lg">شكراً لتواصلك مع نيرسي. سيقوم أحد مستشارينا بالرد عليك عبر البريد الإلكتروني في غضون ساعات قليلة.</p>
                        <button 
                            onClick={() => setIsSent(false)}
                            className="bg-brand-gold text-brand-main font-black px-10 py-4 rounded-2xl hover:bg-brand-goldHover shadow-glow transition-all"
                        >
                            إرسال رسالة أخرى
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-inner">
                                <Mail size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white">تواصل معنا</h2>
                                <p className="text-brand-muted text-sm font-medium">لا تتردد في طرح أي سؤال</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mr-1">الاسم بالكامل</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner"
                                    placeholder="أدخل اسمك هنا..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mr-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner"
                                    placeholder="example@mail.com"
                                />
                            </div>
                            
                            {/* Support Category Dropdown */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mr-1">نوع الاستفسار</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full appearance-none bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none transition-all shadow-inner cursor-pointer"
                                    >
                                        {supportCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-brand-card text-white">
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mr-1">موضوع الرسالة</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-brand-main/50 border border-white/10 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold outline-none resize-none transition-all shadow-inner"
                                    placeholder="اكتب استفسارك بالتفصيل..."
                                ></textarea>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl hover:bg-brand-goldHover transition-all flex items-center justify-center gap-4 shadow-glow hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] active:scale-95 disabled:opacity-50 group/btn"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-brand-main border-t-transparent rounded-full animate-spin"></div>
                                        <span>جاري الإرسال...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-xl">إرسال الرسالة</span>
                                        <Send size={24} strokeWidth={3} className="group-hover:translate-x-[-4px] transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-2 gap-8 text-center md:text-right">
                            <div>
                                <p className="text-[10px] text-brand-muted uppercase tracking-widest font-black mb-2 opacity-50">البريد الرسمي</p>
                                <p className="text-white font-mono font-bold text-sm">support@nursy.com</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-brand-muted uppercase tracking-widest font-black mb-2 opacity-50">الاستجابة</p>
                                <p className="text-white font-bold text-sm">خلال 4 ساعات</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
