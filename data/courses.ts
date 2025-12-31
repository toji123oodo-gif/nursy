
import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Anatomy - علم التشريح',
    instructor: 'Dr. Ahmed Khaled',
    price: 300,
    originalPrice: 600,
    subject: 'Anatomy',
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop',
    lessons: [
        { 
            id: 'l1', 
            title: 'Introduction to Skeleton', 
            isLocked: false,
            contents: [
                { id: 'c1-1', type: 'video', title: 'مقدمة في الجهاز الهيكلي', url: 'https://www.youtube.com/embed/f-FF7Qid3_4', duration: '45:00' },
                { id: 'c1-2', type: 'pdf', title: 'ملخص المحاضرة (PDF)', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileSize: '2.5 MB' },
                { id: 'c1-3', type: 'audio', title: 'تسجيل صوتي للمراجعة', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '15:00' },
                { id: 'c1-4', type: 'image', title: 'صورة توضيحية للهيكل', url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800' }
            ]
        },
        { 
            id: 'l2', 
            title: 'Axial Skeleton', 
            isLocked: false,
            contents: [
                { id: 'c2-1', type: 'video', title: 'شرح الهيكل المحوري بالتفصيل', url: 'https://www.youtube.com/embed/9X560_0tC4E', duration: '55:30' },
                { id: 'c2-2', type: 'document', title: 'مذكرة شرح (Word)', url: 'https://filesamples.com/samples/document/doc/sample2.doc', fileSize: '1.1 MB' }
            ]
        },
        { 
            id: 'l3', 
            title: 'Appendicular Skeleton', 
            isLocked: true,
            contents: [
                 { id: 'c3-1', type: 'video', title: 'شرح الهيكل الطرفي', url: 'https://www.youtube.com/embed/yvS6W3D0B9w', duration: '60:00' }
            ]
        },
        { 
            id: 'l4', 
            title: 'Joints & Movements', 
            isLocked: true, 
            contents: []
        },
        { 
            id: 'l5', 
            title: 'Bone Tissue Histology', 
            isLocked: true, 
            contents: []
        },
    ]
  },
  {
    id: 'c2',
    title: 'Physiology - علم وظائف الأعضاء',
    instructor: 'Dr. Sarah Nabil',
    price: 280,
    originalPrice: 450,
    subject: 'Physiology',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    lessons: [
        { 
            id: 'l1', 
            title: 'Cell Physiology', 
            isLocked: false, 
            contents: [
                { id: 'p1-1', type: 'video', title: 'فسيولوجيا الخلية والغشاء', url: 'https://www.youtube.com/embed/8IlzKri08kk', duration: '40:00' }
            ]
        },
        { id: 'l2', title: 'Nervous System', isLocked: true, contents: [] },
        { id: 'l3', title: 'Cardiovascular System', isLocked: true, contents: [] }
    ]
  },
  {
    id: 'c3',
    title: 'Microbiology - ميكروبيولوجي',
    instructor: 'Dr. Mohamed Ezzat',
    price: 250,
    originalPrice: 400,
    subject: 'Microbiology',
    image: 'https://images.unsplash.com/photo-1583911179663-edf711e04132?q=80&w=800&auto=format&fit=crop',
    lessons: [
        { 
          id: 'l1', 
          title: 'Bacteria Structure', 
          isLocked: false, 
          contents: [
            { id: 'm1-1', type: 'video', title: 'هيكل الخلية البكتيرية', url: 'https://www.youtube.com/embed/h-S9VfX2X3U', duration: '35:00' }
          ] 
        },
        { id: 'l2', title: 'Viruses', isLocked: true, contents: [] }
    ]
  },
  {
    id: 'c4',
    title: 'Adult Nursing - تمريض البالغين',
    instructor: 'Dr. Mona Sayed',
    price: 350,
    originalPrice: 700,
    subject: 'Adult Nursing',
    image: 'https://images.unsplash.com/photo-1579684385180-75416b0c2688?q=80&w=800&auto=format&fit=crop',
    lessons: [
         { 
           id: 'l1', 
           title: 'Patient Admission', 
           isLocked: false, 
           contents: [
              { id: 'an1-1', type: 'video', title: 'إجراءات دخول المريض', url: 'https://www.youtube.com/embed/fA5_T37Uq_Y', duration: '42:00' }
           ] 
         },
         { id: 'l2', title: 'Vital Signs', isLocked: true, contents: [] }
    ]
  },
  {
    id: 'c5',
    title: 'Health Assessment - التقييم الصحي',
    instructor: 'Dr. Hoda Ali',
    price: 200,
    originalPrice: 300,
    subject: 'Health',
    image: 'https://images.unsplash.com/photo-1505751172569-80037f7f6c48?q=80&w=800&auto=format&fit=crop',
    lessons: [
        { 
          id: 'l1', 
          title: 'Health History', 
          isLocked: false, 
          contents: [
            { id: 'ha1-1', type: 'video', title: 'أخذ التاريخ الصحي للمريض', url: 'https://www.youtube.com/embed/k9kS_65t9m8', duration: '30:00' }
          ] 
        },
        { id: 'l2', title: 'Physical Exam', isLocked: true, contents: [] }
    ]
  }
];
