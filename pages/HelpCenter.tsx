
import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Loader2,
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
  AlertCircle,
  Search,
  MessageSquare,
  HeadphonesIcon
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
    answer: 'يمكنك التفعيل عبر صفحة "المحفظة". قم بتحويل مبلغ الاشتراك عبر فودافون كاش أو انستا باي، ثم التقط صورة للإيصال وأرسلها عبر زر الواتساب الموجود في نفس الصفحة. يتم التفعيل عادة خلال 15-30 دقيقة.'
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
    category: 'payment',
    question: 'هل يوجد فترة تجريبية مجانية؟',
    answer: 'نعم! كل طالب جديد يحصل تلقائياً على 30 يوماً من اشتراك PRO مجاناً فور إنشاء الحساب لتجربة جودة الشرح والمنصة.'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', category: 'general' });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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

  const whatsappNumber = "201093077151";

  return (
    <div className="min-h-screen bg-brand-main relative overflow-hidden pb-32">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2"></div>

      {/* Hero Header */}
      <section className="relative pt-20 pb-16 px-6 text-center">
        <div className="container mx-auto">
            <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/30 mb-8 animate-fade-in-up">
                <HeadphonesIcon size={16} className="text-brand-gold" />
                <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">دعم فني متخصص 24/7</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter animate-fade-in-up">
                بتحتاج <span className="text-brand-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">مساعدة؟</span> <br/>
                نحن هنا لأجلك.
            </h1>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed animate-fade-in-up">
                كل الأسئلة اللي بتدور في بالك جاوبنا عليها هنا، وإذا لسه محتاجنا كلمنا فوراً.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* FAQ Section */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in-up">
            
            {/* Search and Filters */}
            <div className="space-y-6">
                <div className="relative group">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="ابحث في الأسئلة الشائعة..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-card/50 border border-white/5 rounded-[2rem] pr-16 pl-8 py-6 text-white text-lg font-bold outline-none focus:border-brand-gold/50 transition-all shadow-inner backdrop-blur-md"
                    />
                </div>

                <div className="flex flex-wrap gap-3 bg-brand-card/30 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                    {[
                        { id: 'all', label: 'الكل' },
                        { id: 'account', label: 'الحساب' },
                        { id: 'payment', label: 'الاشتراكات' },
                        { id: 'content', label: 'المحتوى' }
                    ].map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveCategory(cat.id)} 
                            className={`flex-1 flex items-center justify-center px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.id ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                <div key={idx} className="group premium-card rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500">
                  <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-8 text-right transition-colors">
                    <span className={`text-lg md:text-xl font-black transition-colors ${openIndex === idx ? 'text-brand-gold' : 'text-white'}`}>{faq.question}</span>
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${openIndex === idx ? 'bg-brand-gold text-brand-main shadow-glow rotate-180' : 'bg-white/5 text-brand-muted'}`}>
                        <ChevronDown size={24} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-8 pt-0 text-brand-muted text-lg leading-relaxed font-medium border-t border-white/5 bg-white/[0.02]">
                        {faq.answer}
                      </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-brand-card/20 rounded-[3rem] border border-white/5 border-dashed">
                    <Search size={48} className="mx-auto text-brand-muted/20 mb-4" />
                    <p className="text-brand-muted font-bold text-lg">لم نجد نتائج مطابقة لبحثك</p>
                    <button onClick={() => {setSearchQuery(''); setActiveCategory('all');}} className="text-brand-gold font-black mt-4 hover:underline">عرض كل الأسئلة</button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form Sidebar */}
          <div className="lg:col-span-5 animate-fade-in-up">
            <div className="sticky top-28 space-y-8">
                <div className="bg-brand-card border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/5 blur-[60px] rounded-full"></div>
                    
                    {isSent ? (
                        <div className="text-center py-20 animate-scale-up">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-green">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">وصلت رسالتك!</h3>
                            <p className="text-brand-muted mb-10 text-lg font-medium">فريق نيرسي هيتواصل معاك في أسرع وقت.</p>
                            <button onClick={() => setIsSent(false)} className="bg-brand-gold text-brand-main font-black px-12 py-5 rounded-2xl shadow-glow hover:scale-105 transition-all">إرسال رسالة أخرى</button>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">لسه عندك سؤال؟</h2>
                            <p className="text-brand-muted text-sm mb-10 font-medium">املأ البيانات وهنتصل بيك فوراً للمساعدة.</p>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">الاسم بالكامل</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-brand-main/50 border border-white/5 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all shadow-inner" placeholder="أدخل اسمك..." />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">البريد الإلكتروني</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-brand-main/50 border border-white/5 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all shadow-inner" placeholder="example@mail.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">نوع الاستفسار</label>
                                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full appearance-none bg-brand-main/50 border border-white/5 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold/50 outline-none transition-all shadow-inner cursor-pointer">
                                        {supportCategories.map((cat) => (<option key={cat.id} value={cat.id} className="bg-brand-card text-white">{cat.label}</option>))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-brand-muted font-black uppercase tracking-widest px-2">رسالتك</label>
                                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-brand-main/50 border border-white/5 rounded-2xl px-6 py-4.5 text-white text-sm focus:border-brand-gold/50 outline-none resize-none transition-all shadow-inner" placeholder="اكتب تفاصيل طلبك هنا..."></textarea>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-main font-black py-6 rounded-2xl flex items-center justify-center gap-4 shadow-glow hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all text-xl">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={24}/> إرسال الطلب</>}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-green-500/20 transition-all cursor-pointer" onClick={() => window.open(`https://wa.me/201093077151`)}>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-glow-green group-hover:scale-110 transition-transform">
                            <MessageSquare size={28} />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg">واتساب نيرسي</h4>
                            <p className="text-green-500/80 text-xs font-bold">تواصل مباشر وسريع</p>
                        </div>
                    </div>
                    <ChevronLeft className="text-green-500 group-hover:-translate-x-2 transition-transform" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
