
import React from 'react';
import { History, CheckCircle2, CreditCard, Tag } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'activation' | 'recharge';
  amount?: number;
  date: string;
  code?: string;
  status: 'completed' | 'pending';
}

interface Props {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-brand-card rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
        <History className="text-brand-gold" /> سجل العمليات الأخيرة
      </h3>
      
      <div className="space-y-4">
        {transactions.length > 0 ? transactions.map((t) => (
          <div key={t.id} className="bg-brand-main/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-brand-gold/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 text-brand-gold rounded-2xl flex items-center justify-center">
                {t.type === 'activation' ? <Tag size={20} /> : <CreditCard size={20} />}
              </div>
              <div>
                <p className="text-white font-black text-sm">
                  {t.type === 'activation' ? 'تفعيل كود اشتراك' : 'شحن رصيد محفظة'}
                </p>
                <p className="text-[10px] text-brand-muted font-bold mt-1">{new Date(t.date).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
            
            <div className="text-left">
              <p className="text-white font-black text-lg">{t.amount ? `+${t.amount} ج.م` : 'تفعيل باقة'}</p>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">مكتملة</span>
                <CheckCircle2 size={12} className="text-green-500" />
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <History size={48} className="mx-auto text-brand-muted/20 mb-4" />
            <p className="text-brand-muted font-bold">لا توجد عمليات سابقة حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
};
