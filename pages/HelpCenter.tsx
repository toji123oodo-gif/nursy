
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Mail, HelpCircle, CheckCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const faqs = [
  {
    question: 'كيف يمكنني ترقية حسابي للباقة الكاملة؟',
    answer: 'يمكنك ترقية حسابك عن طريق الذهاب لصفحة "رصيد الحساب" واتباع تعليمات الدفع وإرسال صورة الإيصال. سيتم تفعيل الحساب فور التأكد من صحة البيانات.'
  },
  {
    question: 'هل يمكنني مشاهدة الدروس بدون إنترنت؟',
    answer: 'حالياً الدروس متاحة للمشاهدة أونلاين فقط لضمان حماية المحتوى وحقوق الملكية الفكرية، ولكن يمكنك تحميل المرفقات والملازم بصيغة PDF.'
  },
  {
    question: 'نسيت كلمة المرور، ماذا أفعل؟',
    answer: 'يرجى التواصل مع الدعم الفني عبر النموذج الموجود في هذه الصفحة أو مراسلتنا مباشرة على البريد الإلكتروني support@nursy.com لاستعادة بيانات الدخول.'
  },
  {
    question: 'هل الشهادات معتمدة؟',
    answer: 'الشهادات الممنوحة هي شهادات إتمام دورة تهدف لرفع الكفاءة المهنية ومقبولة في العديد من المستشفيات الخاصة كإثبات للتدريب المستمر.'
  },
  {
    question: 'كيف أتواصل مع المحاضر؟',
    answer: 'يمكنك ترك أسئلتك في قسم التعليقات تحت كل درس (للمشتركين فقط)، وسيقوم فريق المساعدين أو المحاضر بالرد عليك.'
  }
];

export const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (db) {
        try {
            await addDoc(collection(db, "admin_notifications"), {
                type: 'support',
                message: `وصلتك رسالة دعم جديدة من ${formData.name}: ${formData.message.substring(0, 50)}...`,
                userName: formData.name,
                timestamp: new Date().toISOString(),
                read: false
            });
            setIsSent(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (e) {
            console.error("Failed to send support notification", e);
        }
    }
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <header className="mb-10 text-center md:text-right">
        <h1 className="text-3xl font-black text-white mb-2">مركز المساعدة</h1>
        <p className="text-brand-muted">الأسئلة الشائعة والتواصل مع الدعم الفني</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQs Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-brand-gold" />
            الأسئلة الشائعة
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-brand-card border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-gold/20">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-right text-white font-bold hover:bg-white/5 transition-colors"
                >
                  <span className="leading-relaxed">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp size={18} className="text-brand-gold shrink-0" /> : <ChevronDown size={18} className="text-brand-muted shrink-0" />}
                </button>
                <div 
                    className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-4 pt-0 text-brand-muted text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Mail className="text-brand-gold" />
            تواصل معنا
          </h2>
          <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

            {isSent ? (
              <div className="text-center py-16 animate-scale-up">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-glow">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-brand-muted mb-6">شكراً لتواصلك معنا. سيتم الرد عليك في أقرب وقت ممكن.</p>
                <button 
                    onClick={() => setIsSent(false)}
                    className="text-brand-gold font-bold hover:text-white transition-colors text-sm"
                >
                    إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none transition-all placeholder:text-white/20"
                    placeholder="الاسم بالكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none transition-all placeholder:text-white/20"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">الرسالة</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-brand-main border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-gold outline-none resize-none transition-all placeholder:text-white/20"
                    placeholder="اكتب استفسارك أو المشكلة التي تواجهك هنا..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-gold text-brand-main font-bold py-3.5 rounded-xl hover:bg-brand-goldHover transition-all flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-hover transform hover:-translate-y-0.5"
                >
                  <Send size={18} />
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
