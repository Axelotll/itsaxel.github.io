import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. KOMPONEN BOLA MELAYANG
// ==========================================
const FloatingBlob = ({ color, size, top, left, delay }) => (
  <motion.div
    className={`absolute rounded-full opacity-100 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.3)] ${color}`}
    style={{ width: size, height: size, top, left }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 20, 0, -20, 0],
      scale: [1, 1.05, 1, 0.95, 1],
    }}
    transition={{
      duration: 8 + Math.random() * 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  />
);

// ==========================================
// 2. KOMPONEN HUJAN
// ==========================================
const WordRain = ({ targetWords, activeTab }) => {
  const [activeRain, setActiveRain] = useState([]);

  useEffect(() => {
    if (activeTab !== 'home') return;

    const interval = setInterval(() => {
      const text = targetWords[Math.floor(Math.random() * targetWords.length)];
      const newWord = {
        id: Date.now() + Math.random(),
        createdAt: Date.now(),
        text: text,
        left: Math.random() * 90 + 5,
        duration: Math.random() * 5 + 7,
        size: Math.random() * 2 + 1.5,
        rotate: Math.random() * 90 - 45,
      };
      setActiveRain((prev) => [...prev, newWord]);
    }, 400);

    return () => clearInterval(interval);
  }, [targetWords, activeTab]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveRain((prev) => prev.filter((w) => now - w.createdAt < 15000));
    }, 3000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      {activeRain.map((word) => (
        <motion.div
          key={word.id}
          className="absolute top-[-100px] text-slate-500/40 font-bold whitespace-nowrap"
          style={{ left: `${word.left}%`, fontSize: `${word.size}rem` }}
          animate={{ y: [0, 1500], rotate: word.rotate }}
          transition={{ duration: word.duration, ease: "linear" }}
        >
          {word.text}
        </motion.div>
      ))}
    </div>
  );
};

// ==========================================
// 3. KOMPONEN UTAMA (APP)
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [targetWords, setTargetWords] = useState(["React", "Tailwind CSS", "UI/UX", "Developer"]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (activeTab === 'home') {
      setIsProjectOpen(false);
    }
  }, [activeTab]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (inputValue.trim() !== '') {
        setTargetWords([inputValue.trim()]);
      } else {
        setTargetWords(["React", "Tailwind CSS", "UI/UX", "Developer"]);
      }
      setInputValue("");
    }
  };

  const remainingLetters = [
    { char: 'X', size: 'text-6xl md:text-8xl', y: -10 },
    { char: 'E', size: 'text-8xl md:text-[10rem]', y: 5 },
    { char: 'L', size: 'text-6xl md:text-8xl', y: -5 },
  ];

  const popTransition = { type: "spring", stiffness: 350, damping: 28 };

  return (
    <div className="relative h-screen w-screen bg-white text-slate-800 font-['Kalam'] overflow-hidden selection:bg-pink-200">

      {/* NAVBAR */}
      <nav className="absolute top-6 left-0 right-0 flex justify-center gap-4 z-50">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-6 py-2 border-2 border-slate-800 rounded-full font-bold hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] ${activeTab === 'home' ? 'bg-pink-200' : 'bg-white hover:bg-slate-100'}`}
        >
          Me
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-2 border-2 border-slate-800 rounded-full font-bold hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] ${activeTab === 'projects' ? 'bg-pink-200' : 'bg-white hover:bg-slate-100'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-6 py-2 border-2 border-slate-800 rounded-full font-bold hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] ${activeTab === 'resume' ? 'bg-pink-200' : 'bg-white hover:bg-slate-100'}`}
        >
          Resume
        </button>
      </nav>

      {/* TRACK ANIMASI GESER HALAMAN */}
      <motion.div
        className="flex h-full w-[300vw]"
        animate={{
          x: activeTab === 'home' ? '0vw' : activeTab === 'projects' ? '-100vw' : '-200vw'
        }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* ================================== */}
        {/* PANEL 1: HOME PAGE */}
        {/* ================================== */}
        <div className="relative w-screen h-screen flex-shrink-0">
          <WordRain targetWords={targetWords} activeTab={activeTab} />

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            <FloatingBlob color="bg-pink-300" size="300px" top="10%" left="15%" delay={0} />
            <FloatingBlob color="bg-teal-200" size="200px" top="60%" left="10%" delay={1} />
            <FloatingBlob color="bg-blue-300" size="400px" top="30%" left="60%" delay={2} />
            <FloatingBlob color="bg-slate-200" size="150px" top="70%" left="75%" delay={0.5} />
          </div>

          <main className="relative flex flex-col items-center justify-center h-full px-4 z-20 pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 md:gap-6 mt-12">
                <div className="relative">
                  <motion.div
                    className="absolute -top-12 -left-16 md:-top-16 md:-left-20 bg-white text-slate-800 px-4 py-2 rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
                    initial={{ rotate: -15 }}
                    animate={{ y: [0, -10, 0], rotate: [-15, -10, -15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-xl md:text-2xl font-bold">&lt;/&gt; dev</span>
                  </motion.div>
                  <motion.span
                    className="text-7xl md:text-9xl font-bold text-slate-800 drop-shadow-sm inline-block"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 10 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    A
                  </motion.span>
                </div>
                {remainingLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    className={`${letter.size} font-bold text-slate-800 drop-shadow-sm inline-block`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: letter.y }}
                    transition={{ delay: i * 0.1 + 0.6, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.1, rotate: Math.random() > 0.5 ? 10 : -10 }}
                  >
                    {letter.char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                className="mt-16 w-full max-w-md mx-auto relative z-30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 120 }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a word & press Enter..."
                  className="w-full text-xl md:text-2xl text-center font-bold bg-white/100 px-6 py-4 rounded-2xl border-4 border-slate-800 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] focus:outline-none focus:shadow-[10px_10px_0px_0px_rgba(30,41,59,1)] focus:-translate-y-1 transition-all placeholder:text-slate-400"
                />
                <motion.p
                  className="text-center text-slate-800 font-bold mt-4 text-sm bg-white/80 rounded-full px-4 py-1 mx-auto w-max border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  *Try typing any word and press Enter!
                </motion.p>
              </motion.div>
            </div>
          </main>
        </div>

        {/* ================================== */}
        {/* PANEL 2: PROJECTS PAGE */}
        {/* ================================== */}
        <div className="relative w-screen h-screen flex-shrink-0 flex flex-col items-center justify-center bg-slate-50/50 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
          <h2 className="absolute top-24 text-4xl md:text-5xl font-bold text-center text-slate-800 tracking-tight">My Playground</h2>

          {/* GRID HALAMAN BELAKANG */}
          <div className="relative z-10 w-full max-w-6xl px-8 flex flex-row items-center justify-center gap-8 h-[60vh] mt-16">

            {/* KARTU 1 */}
            <motion.div
              className="w-[300px] h-[430px] flex-shrink-0"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                onClick={() => setIsProjectOpen(true)}
                whileHover={{ scale: 1.05 }}
                className="w-full h-full flex flex-col p-6 lg:p-8 bg-blue-200 border-4 border-slate-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] cursor-pointer"
              >
                <div className="flex-1 w-full bg-white border-4 border-slate-800 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-slate-800 text-center px-4 text-xl opacity-60">
                    Click to see details
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">Forever Shinkyu</h3>
                  <p className="text-slate-700 text-sm lg:text-base leading-relaxed line-clamp-3">
                    Professional website for a Japanese acupuncture clinic featuring interactive modals.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* KARTU 2 MISTERI */}
            <motion.div
              className="w-[300px] h-[430px] flex flex-col p-6 bg-zinc-200 border-4 border-slate-800 border-dashed rounded-3xl flex-shrink-0 select-none shadow-[4px_4px_0px_0px_rgba(30,41,59,0.5)]"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex-1 w-full bg-zinc-300/50 border-4 border-dashed border-zinc-400/50 rounded-2xl mb-6 flex items-center justify-center">
                <span className="text-5xl">🔒</span>
              </div>
              <h3 className="text-3xl font-bold mb-3 text-zinc-400 text-center">???</h3>
              <p className="text-zinc-400 text-center text-sm">Project locked.</p>
            </motion.div>

            {/* KARTU 3 MISTERI */}
            <motion.div
              className="w-[300px] h-[430px] flex flex-col p-6 bg-zinc-200 border-4 border-slate-800 border-dashed rounded-3xl flex-shrink-0 select-none shadow-[4px_4px_0px_0px_rgba(30,41,59,0.5)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex-1 w-full bg-zinc-300/50 border-4 border-dashed border-zinc-400/50 rounded-2xl mb-6 flex items-center justify-center">
                <span className="text-5xl">🔒</span>
              </div>
              <h3 className="text-3xl font-bold mb-3 text-zinc-400 text-center">???</h3>
              <p className="text-zinc-400 text-center text-sm">Project locked.</p>
            </motion.div>

          </div>
        </div>

        {/* ================================== */}
        {/* PANEL 3: RESUME PAGE              */}
        {/* ================================== */}
        <div className="relative w-screen h-screen flex-shrink-0 bg-yellow-50/20 overflow-y-auto pt-28 pb-16 px-4 md:px-12 selection:bg-teal-200">

          {/* Latar Belakang Pola Grid Doodle */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* KOLOM KIRI (PROFIL & SKILLS) */}
            <div className="md:col-span-4 space-y-6">

              {/* Kartu Profil Utama */}
              <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transform -rotate-1">
                <h1 className="text-3xl font-bold leading-tight">Jonathan Axel Tedy Asihto</h1>
                <p className="text-pink-500 font-bold text-lg mt-1">Front-End Developer & UI/UX Designer</p>
                <hr className="border-2 border-slate-800 border-dashed my-4" />
                <div className="space-y-2 text-sm font-bold text-slate-700">
                  <p>📱 +62 821 1017 7292</p>
                  <p>✉️ jonatan.axel31@gmail.com</p>
                  <p>📍 Tangerang, Indonesia</p>
                </div>
              </div>

              {/* Kartu Technical Skills */}
              <div className="bg-teal-50 border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transform rotate-1">
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-slate-800 pb-1 w-max">Technical Skills</h2>

                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-slate-900 mb-1.5 text-sm">Languages & Markup:</p>
                    <div className="flex flex-wrap gap-2">
                      {["HTML5", "CSS3", "Flexbox / Grid", "JavaScript (ES6+)"].map((skill, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 border-2 border-slate-800 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-1.5 text-sm">Frameworks & Libraries:</p>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Tailwind CSS", "Framer Motion"].map((skill, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 border-2 border-slate-800 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-1.5 text-sm">Design & Prototyping:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Figma", "Wireframing", "Components", "Prototyping", "Responsive Design", "Visual Hierarchy"].map((skill, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 border-2 border-slate-800 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-1.5 text-sm">Workflow & Tools:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Git", "VS Code", "Browser DevTools", "npm"].map((skill, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 border-2 border-slate-800 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kartu Bahasa & Pendidikan */}
              <div className="bg-pink-50 border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transform -rotate-1">
                <h2 className="text-2xl font-bold mb-3 border-b-4 border-slate-800 pb-1 w-max">Languages</h2>
                <div className="space-y-1.5 text-sm font-bold">
                  <p>🇮🇩 Bahasa Indonesia <span className="text-slate-500 font-medium">(Native / Fluent)</span></p>
                  <p>🇬🇧 English <span className="text-teal-600 font-medium">(Advanced C1)</span></p>
                </div>

                <h2 className="text-2xl font-bold mb-3 mt-6 border-b-4 border-slate-800 pb-1 w-max">Education</h2>
                <div className="text-sm font-bold text-slate-800">
                  <p className="text-base">Bachelor's Degree in Informatics <span className="text-xs font-medium text-slate-500">(Ongoing)</span></p>
                  <p className="text-slate-600 font-medium">Pradita University · Semester 6</p>
                  <p className="text-slate-400 text-xs mt-0.5">2023 – Present · Tangerang, Indonesia</p>
                  <div className="mt-2 text-xs bg-white border-2 border-slate-800 px-2 py-1 rounded-xl w-max shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    🚀 Student Executive Board Member (BEM), 2023–2024
                  </div>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN (SUMMARY & EXPERIENCE & PROJECTS) */}
            <div className="md:col-span-8 space-y-6">

              {/* Summary */}
              <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]">
                <h2 className="text-2xl font-bold mb-3 border-b-4 border-slate-800 pb-1 w-max">Summary</h2>
                <p className="text-slate-700 leading-relaxed font-bold text-sm md:text-base">
                  Informatics student with hands-on experience building production websites using React, Tailwind CSS, and Framer Motion. Combines a solid grasp of front-end fundamentals with a design sensibility developed through formal UI/UX study and real-world creative work. Communicates fluently in English, works well across functions, and stays current with modern web practices.
                </p>
              </div>

              {/* Experience */}
              <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]">
                <h2 className="text-2xl font-bold mb-6 border-b-4 border-slate-800 pb-1 w-max">Experience</h2>

                <div className="space-y-8">

                  {/* Kerja 1 - Front-End UI/UX */}
                  <div className="relative pl-6 border-l-4 border-slate-800">
                    <div className="absolute w-4 h-4 bg-teal-200 border-4 border-slate-800 rounded-full -left-[10px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Front-End & UI/UX Developer</h3>
                        <p className="text-xs font-bold text-slate-500">(Self-Directed Learning) · Independent · Indonesia</p>
                      </div>
                      <span className="bg-yellow-100 border-2 border-slate-800 text-xs font-bold px-2 py-0.5 rounded-full mt-1 sm:mt-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] whitespace-nowrap">2023 – Present</span>
                    </div>
                    <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1 font-bold">
                      <li>Built multiple project websites from scratch using React, Tailwind CSS, and Framer Motion, covering component architecture, responsive layouts, and scroll-based animations.</li>
                      <li>Practised the full design-to-code workflow: sketching user flows in Figma, prototyping interactions, then implementing them in React.</li>
                      <li>Studied user-centred design principles including information architecture, accessibility (WCAG basics), and usability heuristics through structured self-learning.</li>
                      <li>Maintained a consistent study routine covering HTML, CSS, and JavaScript fundamentals to strengthen the foundation underlying every front-end project.</li>
                    </ul>
                  </div>

                  {/* Kerja 2 - English Public Speaker */}
                  <div className="relative pl-6 border-l-4 border-slate-800">
                    <div className="absolute w-4 h-4 bg-blue-200 border-4 border-slate-800 rounded-full -left-[10px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">English Public Speaker & Translator</h3>
                        <p className="text-xs font-bold text-slate-500">Freelance · Independent · Indonesia</p>
                      </div>
                      <span className="bg-yellow-100 border-2 border-slate-800 text-xs font-bold px-2 py-0.5 rounded-full mt-1 sm:mt-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] whitespace-nowrap">2021</span>
                    </div>
                    <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1 font-bold">
                      <li>Competed in national-level English speech contests, developing the ability to communicate complex ideas clearly and persuasively to diverse audiences.</li>
                      <li>Applied analytical writing and precise language skills to translation work — strengths that directly inform writing clear documentation, UI copy, and accessibility labels.</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Projects */}
              <div className="bg-blue-50 border-4 border-slate-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]">
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-slate-800 pb-1 w-max">Projects</h2>

                <div className="bg-white border-4 border-slate-800 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                    <h3 className="text-lg font-bold text-slate-900">Forevershinkyu.com — Official Website</h3>
                    <div className="flex gap-1.5 mt-1 sm:mt-0">
                      {["React", "Tailwind CSS", "Framer Motion"].map((tech, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1 font-bold">
                    <li>Designed and built the full website for a professional organisation, translating brand requirements into a polished, responsive multi-page React app.</li>
                    <li>Implemented scroll-triggered animations and page transitions with Framer Motion to create a smooth, engaging user experience.</li>
                    <li>Structured the component library in Figma before coding, ensuring visual consistency across all pages.</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>

      </motion.div>

      {/* ================================== */}
      {/* OVERLAY LAYER POP-UP */}
      {/* ================================== */}
      <AnimatePresence>
        {isProjectOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">

            {/* Backdrop Gelap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsProjectOpen(false)}
            />

            {/* Container Konten Pop-up */}
            <div className="relative z-10 flex flex-row items-center justify-center gap-8 w-full max-w-5xl h-[60vh] px-8 pointer-events-none">

              {/* KARTU POP-UP BESAR */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={popTransition}
                className="w-[45%] h-full flex flex-col p-8 bg-blue-200 border-4 border-slate-800 rounded-3xl shadow-[12px_12px_0px_0px_rgba(30,41,59,1)] pointer-events-auto cursor-default z-20"
              >
                {/* Area Biru Interaktif (Clickable Website Link) */}
                <a
                  href="https://forevershinkyu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 w-full bg-blue-300 border-4 border-slate-800 rounded-2xl mb-6 flex flex-col items-center justify-center overflow-hidden hover:bg-blue-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer group"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl mb-2 lg:mb-4 group-hover:scale-110 transition-transform"
                  >
                    👆
                  </motion.div>
                  <span className="font-bold text-slate-800 text-center px-4 text-xl lg:text-3xl">
                    Click to visit official website
                  </span>
                </a>

                <div>
                  <h3 className="text-3xl font-bold mb-3 leading-tight">Forever Shinkyu</h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    Professional website for a Japanese acupuncture clinic featuring interactive modals.
                  </p>
                </div>
              </motion.div>

              {/* INFO WINDOW */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.4, opacity: 0, x: 20 }}
                transition={popTransition}
                className="w-[45%] h-full bg-white border-4 border-slate-800 rounded-3xl shadow-[12px_12px_0px_0px_rgba(30,41,59,1)] p-8 flex flex-col relative z-10 pointer-events-auto"
              >
                {/* Tombol Close */}
                <button
                  onClick={() => setIsProjectOpen(false)}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-pink-300 border-4 border-slate-800 rounded-full font-bold text-xl flex items-center justify-center hover:bg-pink-400 hover:scale-110 transition-all shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
                >
                  X
                </button>

                <h2 className="text-3xl font-bold mb-6 border-b-4 border-slate-800 pb-4">Behind the Code</h2>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-lg text-slate-700">
                  <p><strong className="text-slate-900">Role:</strong> Web Developer</p>
                  <p><strong className="text-slate-900">Tech Stack:</strong> React, Tailwind CSS, Custom UI</p>
                  <p>
                    Forever Shinkyu is a custom platform designed to showcase modern aesthetics wrapped in the calming atmosphere of a Japanese clinic.
                  </p>

                  <div className="mt-8 p-4 bg-yellow-100 border-2 border-slate-800 rounded-xl transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                    <p className="font-bold text-slate-800">✨ Key Features:</p>
                    <ul className="list-disc pl-5 mt-2 font-medium">
                      <li>100% Custom coded from scratch</li>
                      <li>Responsive & Interactive UI/UX</li>
                      <li>Interactive Modal System</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}