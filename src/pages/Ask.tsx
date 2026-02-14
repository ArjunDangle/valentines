import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// --- ANIMATION VARIANts FOR THE HEADING ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Time between each word
      delayChildren: 0.5,    // Wait 0.5s before starting
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", damping: 12, stiffness: 100 }
  },
};

const Ask = () => {
  const [phase, setPhase] = useState<"intro-cat" | "intro-envelope" | "question" | "success">("intro-cat");
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: "auto", left: "auto", position: "relative" } as any);
  
  const [catData, setCatData] = useState(null);
  const [envelopeData, setEnvelopeData] = useState(null);
  const [kickingCat, setKickingCat] = useState(null);
  const [kissCat, setKissCat] = useState(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<any>(null);

  useEffect(() => {
    const loadLottie = async (path: string, setter: any) => {
      try {
        const res = await fetch(path);
        const data = await res.json();
        setter(data);
      } catch (err) { console.error(`Failed to load ${path}`, err); }
    };

    loadLottie("/assets/lotties/cat.json", setCatData);
    loadLottie("/assets/lotties/envelope.json", setEnvelopeData);
    loadLottie("/assets/lotties/kicking-cat.json", setKickingCat);
    loadLottie("/assets/lotties/cat-kiss.json", setKissCat);
  }, []);

  useEffect(() => {
    if (phase === "intro-cat") {
      const timer = setTimeout(() => setPhase("intro-envelope"), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleEnvelopeClick = () => {
    setPhase("question");
  };

  const moveNoButton = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const btnW = 150, btnH = 60, padding = 20;
    const newX = Math.random() * (width - btnW - padding * 2) + padding;
    const newY = Math.random() * (height - btnH - padding * 2) + padding;

    setNoButtonPos({
      position: "absolute",
      top: `${newY}px`,
      left: `${newX}px`,
      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      zIndex: 50
    });
    
    setNoCount(prev => prev + 1);
  };

  const noPhrases = [
    "No", "Are you sure?", "Really?", "Think again!", 
    "Last chance!", "Don't do this!", "I'll cry!", "Pretty please?",
  ];

  const headingWords = ["Will", "you", "be", "my", "Valentine?"];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        
        {(phase === "intro-cat" || phase === "intro-envelope") && (
            <motion.div key="intro" exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} transition={{ duration: 0.8 }} className="relative z-10 flex flex-col items-center">
                {catData && (
                    <motion.div className="fixed bottom-0 z-0 w-64 sm:w-80 pointer-events-none" initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 50 }}>
                        <Lottie lottieRef={catRef} animationData={catData} loop={false} onComplete={() => { if (catRef.current) { catRef.current.loop = true; catRef.current.playSegments([25, 77], true); } }} />
                    </motion.div>
                )}
                {phase === "intro-envelope" && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} className="cursor-pointer z-20 mb-32" onClick={handleEnvelopeClick}>
                        <div className="w-64 md:w-96 drop-shadow-2xl">
                             {envelopeData && <Lottie animationData={envelopeData} loop={true} />}
                        </div>
                        <p className="text-center mt-6 font-serif text-primary tracking-widest uppercase text-sm animate-pulse">Tap to open</p>
                    </motion.div>
                )}
            </motion.div>
        )}

        {phase === "question" && (
            <motion.div key="question" className="z-10 flex flex-col items-center gap-8 w-full px-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <div className="text-center space-y-2">
                    <span className="text-xs font-bold tracking-[0.3em] text-primary/60 uppercase">The Final Question</span>
                    <motion.h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground leading-tight text-glow" variants={containerVariants} initial="hidden" animate="visible">
                        {headingWords.map((word) => (
                            <div key={word} style={{ display: 'inline-block' }}> {/* Use div for cleaner structure */}
                                {word === "Valentine?" && <br />}
                                <motion.span
                                    className={`inline-block mr-3 ${word === "Valentine?" ? "text-primary" : ""}`}
                                    variants={wordVariants}
                                >
                                    {word}
                                </motion.span>
                            </div>
                        ))}
                    </motion.h1>
                </div>

                <div className="h-48 flex flex-col items-center justify-center relative">
                    <AnimatePresence>
                        {noCount > 0 && kickingCat && (
                            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="w-48 md:w-64 absolute flex flex-col items-center">
                                <Lottie animationData={kickingCat} loop={true} />
                                <p className="text-center font-bold text-primary mt-2 animate-bounce">{noPhrases[Math.min(noCount, noPhrases.length - 1)]}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- BUTTON CONTAINER (FIX APPLIED HERE) --- */}
                {/* The "relative" class has been REMOVED from this div. This is the fix. */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center min-h-[100px]">
                    <motion.button onClick={() => setPhase("success")} className="z-20 relative rounded-full bg-primary px-12 py-5 text-xl md:text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 box-glow" animate={{ scale: 1 + (noCount * 0.1) }}>YES 💖</motion.button>
                    <motion.button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} onClick={moveNoButton} style={noButtonPos} className={`rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-10 py-4 text-lg font-medium text-muted-foreground shadow-sm hover:bg-rose-50 hover:border-primary/40 hover:text-primary ${noCount > 0 ? "absolute" : "relative"}`}>No</motion.button>
                </div>
            </motion.div>
        )}

        {phase === "success" && (
             <motion.div key="success" className="z-20 flex flex-col items-center justify-center text-center px-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                <div className="w-64 md:w-80 mb-8 drop-shadow-2xl">
                    {kissCat && <Lottie animationData={kissCat} loop={true} />}
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-serif text-primary mb-6">YAY! ❤️</h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-serif italic max-w-lg mx-auto leading-relaxed">I knew you'd say yes. <br/>(Mostly because I didn't give you a choice)</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ask;