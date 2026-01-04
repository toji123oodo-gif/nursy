
import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, Search, MessageSquare, CreditCard, 
  BookOpen, Settings, Send, FileText, ExternalLink,
  AlertCircle, CheckCircle2, Phone, Mail, HelpCircle
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
    question: 'How do I activate my PRO subscription?',
    answer: 'Navigate to the Wallet page. You can activate via Vodafone Cash or InstaPay by transferring the amount and uploading the receipt. Activation typically takes 15-30 minutes.'
  },
  {
    category: 'content',
    question: 'Can I download videos for offline viewing?',
    answer: 'To protect intellectual property, videos are stream-only. However, all PDF notes and supplementary materials are available for direct download.'
  },
  {
    category: 'account',
    question: 'I forgot my password. How can I reset it?',
    answer: 'On the login page, click "Forgot Password". A reset link will be sent to your email. If you registered with a phone number, please contact support.'
  },
  {
    category: 'content',
    question: 'Is the curriculum accredited?',
    answer: 'Yes, our content aligns with the standard Egyptian Nursing Faculties curriculum and technical institutes.'
  }
];

export const HelpCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Support Ticket State
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    if(db) {
        try {
            await db.collection("admin_notifications").add({
                type: 'support_ticket',
                message: ticket.message,
                subject: ticket.subject,
                timestamp: new Date().toISOString(),
                read: false
            });
        } catch(e) {}
    }
    setTimeout(() => {
        setIsSubmitting(false);
        setTicketSent(true);
        setTicket({ subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4">
      {/* Hero Section */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-2xl p-8 shadow-sm text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl opacity-50 pointer-events-none -ml-16 -mb-16"></div>
         
         <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How can we help you?</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
               Search our knowledge base for answers to common questions or connect directly with our support team.
            </p>
            
            <div className="relative max-w-xl mx-auto">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search for topics (e.g., payment, login, content)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-[#333] rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all shadow-sm"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: FAQ & Topics */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Categories */}
            <div>
               <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 px-1">Browse Topics</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'all', label: 'All Topics', icon: FileText },
                    { id: 'payment', label: 'Billing', icon: CreditCard },
                    { id: 'account', label: 'Account', icon: Settings },
                    { id: 'content', label: 'Courses', icon: BookOpen },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-1 ${
                        activeCategory === cat.id 
                        ? 'bg-blue-50 dark:bg-[#2B3A4F] border-blue-200 dark:border-blue-800 text-[#0051C3] dark:text-[#68b5fb] shadow-md' 
                        : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] text-gray-500 dark:text-gray-400 hover:border-brand-blue/50'
                      }`}
                    >
                       <cat.icon size={22} strokeWidth={1.5} />
                       <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm">
               <div className="px-6 py-4 border-b border-gray-100 dark:border-[#333] bg-gray-50 dark:bg-[#252525]">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <HelpCircle size={18} className="text-brand-blue" /> Frequently Asked Questions
                  </h3>
               </div>
               <div className="divide-y divide-gray-100 dark:divide-[#333]">
                  {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="group">
                       <button 
                         onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                         className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                       >
                          <span className={`text-sm font-semibold transition-colors ${openIndex === idx ? 'text-brand-blue' : 'text-gray-700 dark:text-gray-200'}`}>
                             {faq.question}
                          </span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-brand-blue' : ''}`} />
                       </button>
                       {openIndex === idx && (
                          <div className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-[#202020] animate-in fade-in slide-in-from-top-1">
                             {faq.answer}
                          </div>
                       )}
                    </div>
                  )) : (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                       <Search size={32} className="mb-2 opacity-20" />
                       <p className="text-sm">No results found matching your query.</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Column: Contact Cards */}
         <div className="space-y-6">
            
            {/* Contact Info Cards */}
            <div className="space-y-3">
               <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 px-1">Direct Support</h3>
               
               {/* WhatsApp */}
               <a 
                 href="https://wa.me/201093077151" 
                 target="_blank"
                 className="flex items-center gap-4 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-all group"
               >
                  <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                     <Phone size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-900 dark:text-white text-sm">WhatsApp Support</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">+20 109 307 7151</p>
                  </div>
                  <ExternalLink size={16} className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />
               </a>

               {/* Email */}
               <a 
                 href="mailto:toji123oodo@gmail.com" 
                 className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-all group"
               >
                  <div className="w-12 h-12 bg-[#F38020] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                     <Mail size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-900 dark:text-white text-sm">Email Us</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">toji123oodo@gmail.com</p>
                  </div>
                  <ExternalLink size={16} className="text-[#F38020] opacity-0 group-hover:opacity-100 transition-opacity" />
               </a>
            </div>

            {/* Ticket Form */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden">
               <div className="p-4 bg-gray-900 dark:bg-black text-white">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                     <MessageSquare size={16} /> Open a Ticket
                  </h3>
               </div>
               
               <div className="p-6">
                  {ticketSent ? (
                     <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                           <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ticket Created!</h4>
                        <p className="text-xs text-gray-500 mt-2">We'll respond to your email shortly.</p>
                        <button onClick={() => setTicketSent(false)} className="mt-6 text-xs text-[#F38020] font-bold hover:underline">
                           Send another message
                        </button>
                     </div>
                  ) : (
                     <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Subject</label>
                           <select 
                              required 
                              value={ticket.subject}
                              onChange={e => setTicket({...ticket, subject: e.target.value})}
                              className="cf-input bg-gray-50 dark:bg-[#252525]"
                           >
                              <option value="" disabled>Select a topic...</option>
                              <option value="billing">Billing & Payment</option>
                              <option value="technical">Technical Issue</option>
                              <option value="content">Course Content</option>
                              <option value="other">Other Inquiry</option>
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Message</label>
                           <textarea 
                              required
                              rows={4}
                              value={ticket.message}
                              onChange={e => setTicket({...ticket, message: e.target.value})}
                              className="cf-input resize-none bg-gray-50 dark:bg-[#252525]"
                              placeholder="Describe your issue in detail..."
                           ></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-2.5 shadow-md">
                           {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                     </form>
                  )}
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};
