
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, CheckCircle, Star, ArrowLeft, Clock, BookOpen, Shield, Award, Skull, 
  Activity, Microscope, Stethoscope, BedDouble, User, Filter, Zap, ChevronDown, 
  Sparkles, GraduationCap, MessageCircle, Briefcase, MousePointer2, Smartphone, 
  Users, FileCheck, Search, UserPlus, LogIn, ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const getCourseIcon = (subject: string) => {
  switch(subject) {
    case 'Anatomy': return <Skull size={16} />;
    case 'Physiology': return <Activity size={16} />;
    case 'Microbiology': return <Microscope size={16} />;
    case 'Adult Nursing': return <BedDouble size={16} />;
    case 'Health': return <Stethoscope size={16} />;
    default: return <BookOpen size={16} />;
  }
};

export const Landing: React.FC = () => {
  const { user, courses } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject)));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSubject = selectedSubject === 'All' || c.subject === selectedSubject;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [courses, selectedSubject, searchQuery]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* ... hero content ... */}
      </section>

      {/* Courses Bento Grid */}
      <section className="py-24 relative container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-10">
            <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter flex items-center gap-4">
                    <Zap className="text-brand-gold" /> المحاضرات الأكاديمية
                </h2>
                <p className="text-brand-muted text-lg">اختر المادة العلمية وابدأ بمشاهدة العينات المجانية.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="ابحث بالاسم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-card/50 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white text-sm outline-none focus:border-brand-gold transition-all"
                    />
                </div>
                {/* ID added here for the tour */}
                <div id="subject-filters" className="flex bg-brand-card/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar gap-2">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                                selectedSubject === subject
                                ? 'bg-brand-gold text-brand-main shadow-glow'
                                : 'text-brand-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {subject === 'All' ? 'الكل' : subject}
                        </button>
                    ))}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id} className="group flex flex-col h-full premium-card rounded-[3rem] overflow-hidden">
                  {/* ... course card content ... */}
              </Link>
            ))}
          </div>
      </section>
    </div>
  );
};
