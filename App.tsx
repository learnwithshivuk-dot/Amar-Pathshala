
import React, { useState, useEffect } from 'react';
import { Grade, Subject, Lesson, Quiz, ViewState, Question } from './types';
import { generateLessonContent, generateLessonImage, generateSpeech, generateQuiz } from './services/geminiService';
import AudioPlayer from './components/AudioPlayer';

type AppLanguage = 'bn' | 'en';

const translations = {
  bn: {
    schoolName: 'আমার পাঠশালা',
    schoolTagline: 'Amar Pathshala',
    adminPanel: 'অ্যাডমিন প্যানেল',
    startLearning: 'শিখতে শুরু করো!',
    pickGrade: 'তোমার ক্লাস বেছে নাও',
    classLabel: 'ক্লাস',
    back: 'পিছনে',
    subjectsFor: 'এর বিষয়',
    clickToLearn: 'শিখতে ক্লিক করো',
    subjects: 'বিষয়সমূহ',
    exam: 'পরীক্ষা (Quiz)',
    listen: 'শোনো',
    writing: 'লিখছি...',
    creatingImage: 'ছবি আঁকছি...',
    generatingVoice: 'স্বর তৈরি করছি...',
    quizPreparing: 'কুইজ তৈরি করছি...',
    authTitle: 'প্রবেশাধিকার সংরক্ষিত',
    authDesc: 'অ্যাডমিন পিন লিখুন',
    login: 'লগইন',
    wrongPin: 'ভুল পিন! আবার চেষ্টা করুন।',
    contactPin: 'পিন-এর জন্য যোগাযোগ করুন:',
    addLesson: 'নতুন পাঠ যোগ করুন',
    grade: 'ক্লাস',
    subject: 'বিষয়',
    topic: 'টপিক',
    generateBtn: 'তৈরি এবং সেভ করুন',
    existingLessons: 'বিদ্যমান পাঠসমূহ',
    noLessons: 'কোনো পাঠ নেই।',
    sources: 'তথ্যের উৎস:',
    greatJob: 'দারুণ কাজ করেছ!',
    score: 'তোমার স্কোর:',
    nextQuestion: 'পরের প্রশ্ন',
    quitExam: 'পরীক্ষা বন্ধ করুন',
    kGrade: '০',
    nav: {
      about: 'আমাদের সম্পর্কে',
      guide: 'অভিভাবক নির্দেশিকা',
      blog: 'ব্লগ',
      curriculum: 'পাঠ্যক্রম',
      contact: 'যোগাযোগ',
      home: 'হোম'
    }
  },
  en: {
    schoolName: 'My School',
    schoolTagline: 'Amar Pathshala',
    adminPanel: 'Admin Panel',
    startLearning: 'Start Learning!',
    pickGrade: 'Select your grade level',
    classLabel: 'Class',
    back: 'Back',
    subjectsFor: 'Subjects for',
    clickToLearn: 'Click to learn',
    subjects: 'Subjects',
    exam: 'Exam (Quiz)',
    listen: 'Listen',
    writing: 'Writing...',
    creatingImage: 'Creating Image...',
    generatingVoice: 'Generating Voice...',
    quizPreparing: 'Preparing Quiz...',
    authTitle: 'Access Restricted',
    authDesc: 'Please enter Admin PIN',
    login: 'Login',
    wrongPin: 'Wrong PIN! Try again.',
    contactPin: 'Contact for PIN:',
    addLesson: 'Add New Lesson',
    grade: 'Grade',
    subject: 'Subject',
    topic: 'Topic',
    generateBtn: 'Generate & Save',
    existingLessons: 'Existing Lessons',
    noLessons: 'No lessons available.',
    sources: 'Sources:',
    greatJob: 'Great Job!',
    score: 'Your Score:',
    nextQuestion: 'Next Question',
    quitExam: 'Quit Exam',
    kGrade: 'K',
    nav: {
      about: 'About Us',
      guide: 'Parent Guide',
      blog: 'Blog',
      curriculum: 'Curriculum',
      contact: 'Contact',
      home: 'Home'
    }
  }
};

const LessonImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative mb-12 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white p-2 rounded-[2rem] shadow-lg border border-blue-100 overflow-hidden">
        {!isLoaded && (
          <div className="w-full aspect-video rounded-[1.5rem] shimmer flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <img 
          src={src} 
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full rounded-[1.5rem] shadow-inner object-cover aspect-video transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 absolute top-2 left-2 w-[calc(100%-1rem)]'}`}
        />
      </div>
    </div>
  );
};

interface StaticWrapperProps {
  title: string;
  children: React.ReactNode;
}

const StaticWrapper: React.FC<StaticWrapperProps> = ({ title, children }) => (
  <div className="max-w-4xl mx-auto py-10 px-6 md:px-12 bg-white rounded-[3rem] shadow-2xl border border-blue-50">
     <h2 className="text-4xl font-black text-blue-900 mb-8 bengali-font text-center">{title}</h2>
     <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 bengali-font leading-relaxed">
       {children}
     </div>
  </div>
);

interface HeaderProps {
  t: any;
  setView: (view: ViewState) => void;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
}

const Header: React.FC<HeaderProps> = ({ t, setView, lang, setLang }) => (
  <header className="bg-white shadow-md p-4 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-50">
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => setView('HOME')}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner text-center leading-[2.5rem]">AP</div>
      <h1 className="text-xl font-bold text-blue-900 bengali-font tracking-tight">{t.schoolName} <span className="text-blue-400 font-normal ml-1 hidden sm:inline">{t.schoolTagline}</span></h1>
    </div>
    
    <nav className="flex items-center flex-wrap justify-center gap-3 md:gap-6">
      <button onClick={() => setView('HOME')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">{t.nav.home}</button>
      <button onClick={() => setView('ABOUT')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">{t.nav.about}</button>
      <button onClick={() => setView('CURRICULUM')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">{t.nav.curriculum}</button>
      <button onClick={() => setView('BLOG')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider">{t.nav.blog}</button>
      
      <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
        <button 
          onClick={() => setLang('bn')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'bn' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}
        >
          BN
        </button>
        <button 
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}
        >
          EN
        </button>
      </div>
    </nav>
  </header>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<AppLanguage>(() => {
    return (localStorage.getItem('amar_pathshala_lang') as AppLanguage) || 'bn';
  });
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const t = translations[lang];
  const ADMIN_PIN = "824008";

  useEffect(() => {
    localStorage.setItem('amar_pathshala_lang', lang);
  }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem('amar_pathshala_lessons');
    if (saved) setAdminLessons(JSON.parse(saved));
  }, []);

  const saveLessons = (newLessons: Lesson[]) => {
    setAdminLessons(newLessons);
    localStorage.setItem('amar_pathshala_lessons', JSON.stringify(newLessons));
  };

  const handleGradeSelect = (grade: Grade) => {
    setSelectedGrade(grade);
    setView('SUBJECT_SELECT');
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    const existing = adminLessons.find(l => l.grade === selectedGrade && l.subject === subject);
    if (existing) {
      setCurrentLesson(existing);
      setView('LESSON_VIEW');
    } else {
      startLessonGeneration(selectedGrade!, subject);
    }
  };

  const startLessonGeneration = async (grade: Grade, subject: Subject, customTopic?: string) => {
    setLoading(true);
    try {
      const topic = customTopic || `General ${subject} for Grade ${grade}`;
      setLoadingStep(`${t.writing}`);
      const { title, content, sources } = await generateLessonContent(grade, subject, topic, lang === 'bn' ? 'Bengali' : 'English');
      
      setLoadingStep(`${t.creatingImage}`);
      const image = await generateLessonImage(title, content);
      
      setLoadingStep(`${t.generatingVoice}`);
      const audio = await generateSpeech(content);

      const newLesson: Lesson = {
        id: Date.now().toString(),
        grade,
        subject,
        title: title,
        content: content,
        imageUrl: image || undefined,
        audioData: audio,
        language: lang,
        sources
      };

      setCurrentLesson(newLesson);
      setView('LESSON_VIEW');
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const startQuizGeneration = async () => {
    if (!currentLesson) return;
    setLoading(true);
    setLoadingStep(t.quizPreparing);
    try {
      const questions = await generateQuiz(currentLesson.content, lang === 'bn' ? 'Bengali' : 'English');
      setCurrentQuiz({ lessonId: currentLesson.id, questions });
      setView('QUIZ_VIEW');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setPinError(false);
      setPinInput('');
      setView('ADMIN_PANEL');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleAdminAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const grade = parseInt(formData.get('grade') as string) as Grade;
    const subject = formData.get('subject') as Subject;
    const topic = formData.get('topic') as string;

    setLoading(true);
    setLoadingStep('Admin: Creating lesson...');
    try {
      const { title, content, sources } = await generateLessonContent(grade, subject, topic, lang === 'bn' ? 'Bengali' : 'English');
      const image = await generateLessonImage(title, content);
      const audio = await generateSpeech(content);

      const newLesson: Lesson = {
        id: Date.now().toString(),
        grade,
        subject,
        title: title,
        content: content,
        imageUrl: image || undefined,
        audioData: audio,
        language: lang,
        sources
      };

      const updated = [...adminLessons, newLesson];
      saveLessons(updated);
      alert("Lesson saved!");
      setView('HOME');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Header t={t} setView={setView} lang={lang} setLang={setLang} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-2xl font-bold text-blue-800 animate-pulse bengali-font text-center">{loadingStep}</p>
          </div>
        ) : (
          <>
            {view === 'HOME' && (
              <div className="text-center py-12">
                <div className="mb-8 inline-block p-4 bg-white rounded-full shadow-sm border border-blue-50">
                   <span className="text-5xl">🎓</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-blue-900 mb-4 bengali-font leading-tight">{t.startLearning}</h2>
                <p className="text-xl text-blue-500 mb-12 bengali-font font-medium">{t.pickGrade}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                  {[0, 1, 2, 3, 4, 5].map((g) => (
                    <button
                      key={g}
                      onClick={() => handleGradeSelect(g as Grade)}
                      className="aspect-square bg-white border-b-4 border-blue-200 rounded-[2.5rem] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all hover:shadow-2xl shadow-lg group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-6xl font-black text-blue-600 group-hover:text-indigo-600">{g === 0 ? t.kGrade : g}</span>
                      <span className="text-lg font-bold text-blue-400 bengali-font mt-2">{t.classLabel} {g === 0 ? t.kGrade : g}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'ABOUT' && (
              <StaticWrapper title={t.nav.about}>
                <p className="mb-6">
                  {lang === 'bn' 
                    ? 'আমার পাঠশালা একটি বৈপ্লবিক ওপেন সোর্স ডিজিটাল স্কুল প্রকল্প যা বাংলাদেশের প্রাথমিক স্তরের শিক্ষার্থীদের জন্য মানসম্পন্ন শিক্ষা নিশ্চিত করতে কাজ করে।' 
                    : 'Amar Pathshala is a revolutionary open-source digital school project dedicated to ensuring quality education for primary-level students in Bangladesh.'}
                </p>
                <p className="mb-8">
                  {lang === 'bn' 
                    ? 'আমাদের প্ল্যাটফর্মটি কৃত্রিম বুদ্ধিমত্তা (AI) ব্যবহার করে প্রতিটি শিক্ষার্থীর জন্য ব্যক্তিগতকৃত পাঠ্যক্রম এবং পরীক্ষা তৈরি করে।' 
                    : 'Our platform leverages Artificial Intelligence (AI) to generate personalized lessons and examinations for every student.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                    <div className="text-3xl mb-3">🌍</div>
                    <h4 className="font-black text-blue-900 mb-2">Accessibility</h4>
                    <p className="text-sm">Available anywhere, anytime, for free.</p>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
                    <div className="text-3xl mb-3">🤖</div>
                    <h4 className="font-black text-indigo-900 mb-2">AI Powered</h4>
                    <p className="text-sm">Advanced content generation via Gemini.</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                    <div className="text-3xl mb-3">👐</div>
                    <h4 className="font-black text-green-900 mb-2">Open Source</h4>
                    <p className="text-sm">Built by the community for the community.</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-4">Our Technology</h3>
                <p>We use the latest <strong>Google Gemini models</strong> to verify facts through Google Search, generate vivid textbook illustrations, and create human-like speech for lessons. This creates a multi-sensory learning experience that helps children retain information better.</p>
              </StaticWrapper>
            )}

            {view === 'CURRICULUM' && (
              <StaticWrapper title={t.nav.curriculum}>
                <p className="text-center mb-10 text-gray-500">Our curriculum follows international standards adapted for the local educational context.</p>
                <div className="space-y-6">
                  {[
                    { g: 0, focus: lang === 'bn' ? 'বর্ণমালা ও রং চেনা' : 'Alphabet, Colors, and Motor Skills' },
                    { g: 1, focus: lang === 'bn' ? 'প্রাথমিক যোগ-বিয়োগ ও পড়ার অভ্যাস' : 'Basic Arithmetic and Reading Habits' },
                    { g: 2, focus: lang === 'bn' ? 'শব্দভাণ্ডার বৃদ্ধি ও পরিবেশ পরিচিতি' : 'Vocabulary Expansion and Environment' },
                    { g: 3, focus: lang === 'bn' ? 'প্রাথমিক বিজ্ঞান ও সামাজিক ধারণা' : 'Basic Science and Social Concepts' },
                    { g: 4, focus: lang === 'bn' ? 'গাণিতিক যুক্তি ও ইতিহাস' : 'Mathematical Reasoning and History' },
                    { g: 5, focus: lang === 'bn' ? 'সৃজনশীল লিখন ও উচ্চতর বিজ্ঞান' : 'Creative Writing and Advanced Science' }
                  ].map(item => (
                    <div key={item.g} className="flex gap-6 items-center p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors group">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-110 transition-transform shrink-0">
                        {item.g === 0 ? 'K' : item.g}
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-blue-900">Grade {item.g === 0 ? 'Kindergarten' : item.g}</h4>
                        <p className="text-gray-600 font-medium">{item.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StaticWrapper>
            )}

            {view === 'BLOG' && (
              <StaticWrapper title={t.nav.blog}>
                <div className="grid grid-cols-1 gap-12">
                  <article className="border-b border-gray-100 pb-12 last:border-0">
                    <div className="relative h-72 bg-gray-200 rounded-[2.5rem] mb-6 overflow-hidden shadow-xl">
                       <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Kids learning" />
                       <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Education</div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-blue-900 hover:text-blue-600 cursor-pointer transition-colors">Digital Learning: The New Frontier for Primary Students</h3>
                    <p className="text-sm text-gray-400 mb-6 font-bold uppercase tracking-wider">May 24, 2024 • 8 Min Read • By Team Pathshala</p>
                    <p className="mb-6">The landscape of primary education is shifting rapidly. With AI tools becoming more accessible, students in rural areas can now access the same high-quality teaching materials as those in urban centers. This article explores how interactive sound and images improve cognition in children aged 5-10...</p>
                    <button className="bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-black hover:bg-blue-100 transition-colors">Continue Reading →</button>
                  </article>

                  <article className="border-b border-gray-100 pb-12 last:border-0">
                    <h3 className="text-3xl font-black mb-4 text-blue-900 hover:text-blue-600 cursor-pointer transition-colors">Why Multilingual Support is Crucial in Online Schools</h3>
                    <p className="text-sm text-gray-400 mb-6 font-bold uppercase tracking-wider">May 18, 2024 • 6 Min Read • By Education Experts</p>
                    <p className="mb-6">Language should never be a barrier to wisdom. At Amar Pathshala, we believe that teaching a child in their native tongue (Bengali) while introducing global languages (English) creates a dual-competency that prepares them for the global stage...</p>
                    <button className="bg-blue-50 text-blue-600 px-8 py-3 rounded-full font-black hover:bg-blue-100 transition-colors">Continue Reading →</button>
                  </article>
                </div>
              </StaticWrapper>
            )}

            {view === 'PARENT_GUIDE' && (
              <StaticWrapper title={t.nav.guide}>
                <div className="space-y-10">
                  <section>
                    <h3 className="text-2xl font-black text-blue-900 mb-4">1. Setting Up a Safe Space</h3>
                    <p>Ensure your child uses the tablet or computer in a common area. Our website requires no login, keeping your child's data safe and private. No personal information is ever collected.</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-black text-blue-900 mb-4">2. Interactive Learning</h3>
                    <p>Encourage your child to use the <strong>Listen (শোনো)</strong> button. Hearing the words while reading them helps build phonemic awareness and better pronunciation.</p>
                  </section>
                  <section className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                    <h3 className="text-2xl font-black text-orange-900 mb-4">⚠️ Screen Time Recommendations</h3>
                    <p className="text-orange-800">For children aged 5-8, we recommend no more than 45 minutes of active learning per session. Take frequent breaks to rest the eyes.</p>
                  </section>
                </div>
              </StaticWrapper>
            )}

            {view === 'CONTACT' && (
              <StaticWrapper title={t.nav.contact}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="mb-8">Have questions or want to contribute to our open-source curriculum? We'd love to hear from you!</p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">📍</div>
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase">Headquarters</p>
                          <p className="font-bold">Uluberia, West Bengal, India</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">📧</div>
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase">Email Us</p>
                          <p className="font-bold text-blue-600">amarpathshala@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                    <h4 className="font-black text-blue-900 mb-4 text-center">Contact Form</h4>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll get back to you soon."); }}>
                       <input placeholder="Your Name" className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-400" required />
                       <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-400" required />
                       <textarea placeholder="Your Message..." className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-400 h-32" required></textarea>
                       <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">Send Message</button>
                    </form>
                  </div>
                </div>
              </StaticWrapper>
            )}

            {view === 'SUBJECT_SELECT' && (
              <div className="max-w-4xl mx-auto">
                <button onClick={() => setView('HOME')} className="mb-8 text-blue-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform bg-white px-4 py-2 rounded-full shadow-sm border border-blue-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                  {t.back}
                </button>
                <h2 className="text-4xl font-black text-blue-900 mb-10 bengali-font">{t.classLabel} {selectedGrade === 0 ? t.kGrade : selectedGrade} {t.subjectsFor}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.values(Subject).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubjectSelect(sub)}
                      className="p-8 bg-white border-2 border-transparent rounded-3xl flex items-center gap-6 shadow-md hover:shadow-xl hover:border-blue-300 transition-all text-left group"
                    >
                      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                        <SubjectIcon subject={sub} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-800">{sub}</h3>
                        <p className="text-blue-400 font-bold bengali-font">{t.clickToLearn} →</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'LESSON_VIEW' && currentLesson && (
              <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-blue-50">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex justify-between items-center">
                  <button onClick={() => setView('SUBJECT_SELECT')} className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    {t.subjects}
                  </button>
                  <div className="text-center">
                    <span className="text-xs uppercase font-black tracking-widest opacity-70 block mb-1">{t.classLabel} {currentLesson.grade === 0 ? t.kGrade : currentLesson.grade}</span>
                    <h3 className="text-xl font-bold bengali-font">{currentLesson.subject}</h3>
                  </div>
                  <div className="w-20"></div>
                </div>

                <div className="p-8 md:p-12">
                  <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-10 bengali-font text-center leading-[1.2]">
                    {currentLesson.title}
                  </h2>

                  {currentLesson.imageUrl && (
                    <LessonImage src={currentLesson.imageUrl} alt={currentLesson.title} />
                  )}

                  <div className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-800 bengali-font mb-12 whitespace-pre-wrap leading-[1.8] font-medium px-4">
                    {currentLesson.content}
                  </div>

                  {/* Grounding Sources */}
                  {currentLesson.sources && currentLesson.sources.length > 0 && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">{t.sources}</p>
                      <ul className="space-y-2">
                        {currentLesson.sources.map((src, idx) => (
                          <li key={idx}>
                            <a href={src.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 font-bold underline text-sm">
                              {src.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 pt-10 border-t-2 border-blue-50">
                    <AudioPlayer base64Audio={currentLesson.audioData || null} />
                    
                    <button
                      onClick={startQuizGeneration}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] flex items-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                      {t.exam}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'QUIZ_VIEW' && currentQuiz && (
              <QuizContainer 
                quiz={currentQuiz} 
                t={t}
                onFinish={() => {}}
                onBack={() => setView('LESSON_VIEW')}
              />
            )}

            {view === 'ADMIN_AUTH' && (
              <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-100 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-2 bengali-font">{t.authTitle}</h2>
                <p className="text-gray-500 mb-8 font-medium">{t.authDesc}</p>
                
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <input 
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter PIN..."
                    className={`w-full p-4 text-center text-2xl tracking-widest bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${pinError ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-100 focus:border-blue-400'}`}
                    autoFocus
                  />
                  {pinError && <p className="text-red-500 font-bold text-sm">{t.wrongPin}</p>}
                  <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    {t.login}
                  </button>
                </form>

                <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-blue-600 font-bold text-sm mb-1 bengali-font">{t.contactPin}</p>
                  <a href="tel:8240086523" className="text-blue-900 font-black text-xl hover:underline">৮২৪০০৮৬৫২৩</a>
                  <p className="text-xs text-blue-400 mt-2 font-medium">(Call 8240086523 for Key Access)</p>
                </div>
                
                <button onClick={() => setView('HOME')} className="mt-8 text-gray-400 font-bold hover:text-gray-600 transition-colors">← {t.back}</button>
              </div>
            )}

            {view === 'ADMIN_PANEL' && (
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-blue-50">
                <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setView('HOME')} className="text-blue-600 font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    {t.back}
                  </button>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Admin Logged In</span>
                </div>
                <h2 className="text-3xl font-black mb-8 text-blue-900">{t.addLesson}</h2>
                <form onSubmit={handleAdminAdd} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">{t.grade}</label>
                      <select name="grade" className="w-full p-4 bg-blue-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 font-bold" required>
                        {[0, 1, 2, 3, 4, 5].map(g => <option key={g} value={g}>{t.classLabel} {g === 0 ? t.kGrade : g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">{t.subject}</label>
                      <select name="subject" className="w-full p-4 bg-blue-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 font-bold" required>
                        {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">{t.topic}</label>
                    <input name="topic" placeholder="The Magic of Seasons..." className="w-full p-4 bg-blue-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 font-bold" required />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg">
                    {t.generateBtn}
                  </button>
                </form>

                <div className="mt-16">
                  <h3 className="text-xl font-black mb-6 text-blue-900 border-b pb-2">{t.existingLessons}</h3>
                  <div className="space-y-3">
                    {adminLessons.length === 0 ? (
                      <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold italic">
                        {t.noLessons}
                      </div>
                    ) : (
                      adminLessons.map(l => (
                        <div key={l.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                          <div>
                            <span className="font-black text-blue-600 mr-2">G{l.grade}</span>
                            <span className="font-bold text-gray-700">{l.title}</span>
                          </div>
                          <button 
                            onClick={() => saveLessons(adminLessons.filter(al => al.id !== l.id))}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-12 mt-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">AP</div>
                <h4 className="font-black text-2xl text-blue-900">{t.schoolName}</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Providing high-quality, AI-driven educational resources to primary students across the globe for free.</p>
           </div>
           <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-900">Platform</h5>
              <ul className="text-sm space-y-3 text-gray-500 font-medium">
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('HOME')}>{t.nav.home}</button></li>
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('CURRICULUM')}>{t.nav.curriculum}</button></li>
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('ADMIN_AUTH')}>{t.adminPanel}</button></li>
              </ul>
           </div>
           <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-900">Resources</h5>
              <ul className="text-sm space-y-3 text-gray-500 font-medium">
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('ABOUT')}>{t.nav.about}</button></li>
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('PARENT_GUIDE')}>{t.nav.guide}</button></li>
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('BLOG')}>{t.nav.blog}</button></li>
                <li><button className="hover:text-blue-600 transition-colors" onClick={() => setView('CONTACT')}>{t.nav.contact}</button></li>
              </ul>
           </div>
           <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-900">Get Involved</h5>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Our project is open-source. Fork us on GitHub or join our community of educators.</p>
              <div className="flex gap-4">
                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">f</div>
                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">t</div>
                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">in</div>
              </div>
           </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-100 text-gray-400 text-sm">
          <p>© 2024 {t.schoolTagline} • <span className="text-blue-400 font-bold">Perfect Education for Every Child</span></p>
        </div>
      </footer>
    </div>
  );
};

const SubjectIcon: React.FC<{ subject: Subject }> = ({ subject }) => {
  switch (subject) {
    case Subject.BENGALI: return <span className="text-4xl font-black">অ</span>;
    case Subject.ENGLISH: return <span className="text-4xl font-black">Aa</span>;
    case Subject.MATHEMATICS: return <span className="text-4xl font-black">±</span>;
    case Subject.SCIENCE: return <span className="text-4xl">🔬</span>;
    case Subject.SOCIAL_STUDIES: return <span className="text-4xl">🌍</span>;
    case Subject.ART: return <span className="text-4xl">🎨</span>;
    default: return <span className="text-4xl">📚</span>;
  }
};

const QuizContainer: React.FC<{ quiz: Quiz; t: any; onFinish: (score: number, total: number) => void; onBack: () => void }> = ({ quiz, t, onFinish, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    const isCorrect = selected === quiz.questions[currentIdx].correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) setScore(newScore);

    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      onFinish(newScore, quiz.questions.length);
    }
  };

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-[3rem] shadow-2xl border border-blue-50 p-12">
        <div className="text-8xl mb-8 animate-bounce">🎊</div>
        <h2 className="text-5xl font-black text-blue-900 mb-6 bengali-font">{t.greatJob}</h2>
        <div className="bg-blue-50 rounded-[2rem] p-8 mb-10 border-2 border-blue-100">
           <p className="text-lg text-blue-400 uppercase font-black tracking-widest mb-2">{t.score}</p>
           <p className="text-7xl font-black text-blue-600">{score} / {quiz.questions.length}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl"
        >
          {t.back}
        </button>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-blue-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-2 bg-blue-100 w-full">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}></div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-black text-sm uppercase">Question {currentIdx + 1} of {quiz.questions.length}</span>
        <button onClick={onBack} className="text-gray-300 hover:text-red-400 font-bold transition-colors">{t.quitExam}</button>
      </div>

      <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-12 bengali-font leading-snug">{q.question}</h3>

      <div className="space-y-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full p-6 rounded-[1.5rem] border-2 text-left transition-all text-xl bengali-font font-bold flex items-center gap-4 ${
              selected === i 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-inner' 
                : 'border-gray-100 hover:border-blue-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-300'}`}>
              {selected === i && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
            </div>
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={handleNext}
        className={`mt-12 w-full py-6 rounded-full font-black text-2xl shadow-xl transition-all active:scale-95 ${
          selected === null ? 'bg-gray-100 text-gray-300' : 'bg-green-500 text-white hover:bg-green-600 shadow-[0_10px_20px_rgba(34,197,94,0.3)]'
        }`}
      >
        {t.nextQuestion} →
      </button>
    </div>
  );
};

export default App;
