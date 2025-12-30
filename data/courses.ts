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
        { id: 'l1', title: 'Introduction to Skeleton', duration: '45:00', isLocked: false },
        { id: 'l2', title: 'Axial Skeleton', duration: '55:30', isLocked: false },
        { id: 'l3', title: 'Appendicular Skeleton', duration: '60:00', isLocked: true },
        { id: 'l4', title: 'Joints & Movements', duration: '50:15', isLocked: true },
        { id: 'l5', title: 'Bone Tissue Histology', duration: '48:00', isLocked: true },
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
        { id: 'l1', title: 'Cell Physiology', duration: '40:00', isLocked: false },
        { id: 'l2', title: 'Nervous System', duration: '50:00', isLocked: true },
        { id: 'l3', title: 'Cardiovascular System', duration: '65:00', isLocked: true }
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
        { id: 'l1', title: 'Bacteria Structure', duration: '35:00', isLocked: false },
        { id: 'l2', title: 'Viruses', duration: '45:00', isLocked: true }
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
         { id: 'l1', title: 'Patient Admission', duration: '30:00', isLocked: false },
         { id: 'l2', title: 'Vital Signs', duration: '55:00', isLocked: true }
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
        { id: 'l1', title: 'Health History', duration: '40:00', isLocked: false },
        { id: 'l2', title: 'Physical Exam', duration: '60:00', isLocked: true }
    ]
  }
];