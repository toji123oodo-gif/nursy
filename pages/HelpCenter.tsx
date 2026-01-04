
import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, Search, MessageSquare, CreditCard, 
  BookOpen, Settings, Send, FileText, ExternalLink,
  AlertCircle, CheckCircle2
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#333] pb-6">
         <h1 className="text-xl font-bold text-main">Help & Documentation</h1>
         <p className="text-xs text-muted mt-1">Search our knowledge base or contact support for assistance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Knowledge Base */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search for answers (e.g., payment, login, content)..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="cf-input pl-10 h-10 text-sm"
               />
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { id: 'all', label: 'All Topics', icon: FileText },
                 { id: 'payment', label: 'Billing', icon: CreditCard },
                 { id: 'account', label: 'Account', icon: Settings },
                 { id: 'content', label: 'Courses', icon: BookOpen },
               ].map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={`p-4 border rounded-[4px] flex flex-col items-center justify-center gap-2 transition-all ${
                     activeCategory === cat.id 
                     ? 'bg-blue-50 dark:bg-[#2B3A4F] border-blue-200 dark:border-blue-800 text-[#0051C3] dark:text-[#68b5fb]' 
                     : 'bg-white dark:bg-[#1E1E1E] border-[#E5E5E5] dark:border-[#333] text-muted hover:border-[#F38020]'
                   }`}
                 >
                    <cat.icon size={20} />
                    <span className="text-xs font-medium">{cat.label}</span>
                 </button>
               ))}
            </div>

            {/* FAQs List */}
            <div className="cf-card">
               <div className="cf-header">
                  <h3 className="text-sm font-bold text-main">Frequently Asked Questions</h3>
               </div>
               <div className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                  {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1E1E1E]">
                       <button 
                         onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                       >
                          <span className="text-sm font-medium text-main">{faq.question}</span>
                          <ChevronDown size={14} className={`text-muted transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
                       </button>
                       {openIndex === idx && (
                          <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-dashed border-[#E5E5E5] dark:border-[#333] pt-3 bg-[#FAFAFA] dark:bg-[#151515]">
                             {faq.answer}
                          </div>
                       )}
                    </div>
                  )) : (
                    <div className="p-8 text-center text-muted text-sm">
                       No results found matching your query.
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Column: Contact / Ticket */}
         <div className="space-y-6">
            <div className="cf-card p-6">
               <h3 className="text-sm font-bold text-main mb-4 flex items-center gap-2">
                  <MessageSquare size={16} /> Open a Support Ticket
               </h3>
               
               {ticketSent ? (
                  <div className="text-center py-8">
                     <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                     <h4 className="text-sm font-bold text-main">Ticket Created</h4>
                     <p className="text-xs text-muted mt-1">Reference ID: #TK-{Math.floor(Math.random()*10000)}</p>
                     <button onClick={() => setTicketSent(false)} className="mt-4 text-xs text-[#0051C3] dark:text-[#68b5fb] hover:underline">
                        Send another
                     </button>
                  </div>
               ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-main">Subject</label>
                        <select 
                           required 
                           value={ticket.subject}
                           onChange={e => setTicket({...ticket, subject: e.target.value})}
                           className="cf-input"
                        >
                           <option value="" disabled>Select a topic...</option>
                           <option value="billing">Billing & Payment</option>
                           <option value="technical">Technical Issue</option>
                           <option value="content">Course Content</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-main">Message</label>
                        <textarea 
                           required
                           rows={4}
                           value={ticket.message}
                           onChange={e => setTicket({...ticket, message: e.target.value})}
                           className="cf-input resize-none"
                           placeholder="Describe your issue in detail..."
                        ></textarea>
                     </div>
                     <button type="submit" disabled={isSubmitting} className="w-full btn-primary">
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                     </button>
                  </form>
               )}
            </div>

            <div className="bg-blue-50 dark:bg-[#2B3A4F] border border-blue-100 dark:border-blue-900 rounded-[4px] p-4">
               <h4 className="text-xs font-bold text-[#0051C3] dark:text-[#68b5fb] mb-1">Live Chat Support</h4>
               <p className="text-[10px] text-blue-800 dark:text-blue-300 mb-3">
                  Available daily from 9:00 AM to 5:00 PM CLT.
               </p>
               <a 
                 href={`https://wa.me/201093077151`} 
                 target="_blank" 
                 className="flex items-center gap-1 text-xs font-medium text-[#0051C3] dark:text-[#68b5fb] hover:underline"
               >
                 Open WhatsApp <ExternalLink size={10} />
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};
