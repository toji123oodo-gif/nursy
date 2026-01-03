
import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'بودكاست التمريض: علم التشريح',
    instructor: 'Dr. Ahmed Khaled',
    subject: 'Anatomy',
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop',
    // Added default price
    price: 0,
    lessons: [
        { 
            id: 'l1', 
            title: 'المحاضرة 1: الجهاز الهيكلي الصوتي', 
            isLocked: false,
            contents: [
                { id: 'c1-1', type: 'audio', title: 'شرح صوتي للجهاز الهيكلي', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '45:00' },
                { id: 'c1-2', type: 'pdf', title: 'مذكرة التشريح (الجزء 1)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileSize: '3.2 MB' }
            ],
            quiz: {
              id: 'q1',
              title: 'اختبار الجهاز الهيكلي',
              questions: [
                { id: 'qn1', text: 'كم عدد عظام الجسم في الشخص البالغ؟', options: ['206', '210', '190', '250'], correctOptionIndex: 0 }
              ]
            }
        },
        { 
            id: 'l2', 
            title: 'المحاضرة 2: الهيكل المحوري والطرفي', 
            isLocked: false,
            contents: [
                { id: 'c2-1', type: 'audio', title: 'شرح تفصيلي صوتي', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '55:30' },
                { id: 'c2-2', type: 'pdf', title: 'ملخص الهيكل المحوري', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileSize: '1.5 MB' }
            ]
        }
    ]
  },
  {
    id: 'c2',
    title: 'شروحات صوتية: فسيولوجيا الخلية',
    instructor: 'Dr. Sarah Nabil',
    subject: 'Physiology',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    // Added default price
    price: 0,
    lessons: [
        { 
            id: 'l1', 
            title: 'مقدمة في وظائف الخلية', 
            isLocked: false, 
            contents: [
                { id: 'p1-1', type: 'audio', title: 'Podcast: Cell Functions', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '40:00' },
                { id: 'p1-2', type: 'pdf', title: 'مذكرة فسيولوجيا الخلية', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileSize: '4.1 MB' }
            ]
        }
    ]
  }
];
