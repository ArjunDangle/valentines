import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isNoBtnMoved, setIsNoBtnMoved] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  
  // Lottie Data States
  const [catData, setCatData] = useState(null);
  const [envelopeData, setEnvelopeData] = useState(null);
  const [kickingCat, setKickingCat] = useState(null);
  const [kissCat, setKissCat] = useState(null);
  const [heartsData, setHeartsData] = useState(null);
  const [loveCat, setLoveCat] = useState(null);

  const catRef = useRef<any>(null);

  // --- LOAD ASSETS ---
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
    loadLottie("/assets/lotties/hearts.json", setHeartsData);
    loadLottie("/assets/lotties/cat-love.json", setLoveCat);
  }, []);

  // --- INTRO SEQUENCE TIMING ---
  useEffect(() => {
    if (phase === "intro-cat") {
      const timer = setTimeout(() => setPhase("intro-envelope"), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleEnvelopeClick = () => {
    setPhase("question");
  };

  // --- "NO" BUTTON LOGIC ---
  const handleNoClick = () => {
    const padding = 20;
    const safeWidth = window.innerWidth - 140; 
    const safeHeight = window.innerHeight - 80;

    let newX = Math.random() * safeWidth;
    let newY = Math.random() * safeHeight;

    if (newX < padding) newX = padding;
    if (newY < padding) newY = padding;

    setNoButtonPos({ x: newX, y: newY });
    setIsNoBtnMoved(true);
    setNoCount(prev => prev + 1);
  };

  // --- "YES" BUTTON LOGIC ---
  const handleYesClick = () => {
    setShowExplosion(true);
    setTimeout(() => {
      setPhase("success");
    }, 500);
  };

  const noPhrases = [
    "No", "Are you sure?", "Really?", "Think again!", 
    "Last chance!", "Don't do this!", "I'll cry!", "Pretty please?",
  ];

  const headingWords = ["Will", "you", "be", "my", "Valentine?"];

  // Logic to determine if intro cat should be visible (Intro phases only)
  const showIntroCat = phase === "intro-cat" || phase === "intro-envelope";

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* EXPLOSION OVERLAY */}
      <AnimatePresence>
        {showExplosion && heartsData && (
          <motion.div 
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
             <Lottie animationData={heartsData} loop={false} className="w-full h-full scale-150 opacity-90" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
         --- THE CAT MASCOT --- 
         Position: Fixed to bottom of viewport. 
         Logic: Slides UP (0%) when in intro. Slides DOWN (100%) when Question starts.
         Exact classes from Anticipation.tsx
      */}
      {catData && (
        <motion.div 
          className="fixed bottom-0 z-0 pointer-events-none w-64 sm:w-80 md:w-96 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-16 lg:right-32"
          initial={{ y: "100%" }}
          animate={{ y: showIntroCat ? "0%" : "100%" }} 
          transition={
            !showIntroCat 
              ? { duration: 0.8, ease: "easeInOut" } // Exit smoothness
              : { type: "spring", delay: 0.5, duration: 1.5, bounce: 0.4 } // Entrance bounce
          }
        >
          <Lottie 
            lottieRef={catRef}
            animationData={catData} 
            loop={false} 
            onComplete={() => {
              if (catRef.current) {
                catRef.current.loop = true;
                catRef.current.playSegments([25, 77], true);
              }
            }}
          />
        </motion.div>
      )}

      {/* --- MAIN CONTENT --- */}
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: ENVELOPE */}
        {phase === "intro-envelope" && (
            <motion.div
            key="envelope-sequence"
            // z-10 ensures it is clickable above the fixed cat
            className="z-10 mb-20 flex cursor-pointer flex-col items-center gap-4 sm:mb-24"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            onClick={handleEnvelopeClick}
            >
                {/* Envelope Size - Increased on Desktop */}
                <div className="w-72 sm:w-96 md:w-[32rem] lg:w-[40rem]">
                    {envelopeData ? (
                    <Lottie animationData={envelopeData} loop={true} />
                    ) : (
                    <div className="h-72 w-72 animate-pulse rounded-xl bg-primary/10 sm:h-96 sm:w-96" />
                    )}
                </div>

                <motion.p
                    className="font-sans text-xs tracking-[0.2em] uppercase text-primary/80 sm:text-sm"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    tap to open
                </motion.p>
            </motion.div>
        )}

        {/* PHASE 2: QUESTION */}
        {phase === "question" && (
            <motion.div 
              key="question" 
              className="z-10 flex flex-col items-center justify-between w-full h-full py-8 md:py-12"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.8, delay: 0.5 }} // Wait for intro cat to leave
            >
                {/* Spacer */}
                <div className="flex-[0.5]" />

                {/* HEADING */}
                <div className="text-center space-y-6 relative z-10">
                    <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-primary/60 uppercase">The Final Question</span>
                    <motion.h1 
                      className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-foreground leading-[1.1] text-glow drop-shadow-sm" 
                      variants={containerVariants} 
                      initial="hidden" 
                      animate="visible"
                    >
                        {headingWords.map((word, i) => (
                            <span key={i} className="inline-block mx-2">
                                {word === "Valentine?" && <br className="md:hidden" />}
                                <motion.span
                                    className={`inline-block ${word === "Valentine?" ? "text-primary drop-shadow-md" : ""}`}
                                    variants={wordVariants}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </motion.h1>
                </div>

                {/* MIDDLE LOTTIE (Love Cat / Kicking Cat) */}
                <div className="h-64 flex items-center justify-center relative w-full my-6 z-0">
                    <AnimatePresence mode="wait">
                        {noCount === 0 ? (
                            // INITIAL STATE: Cute Cat
                            <motion.div
                                key="love-cat"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-48 md:w-64"
                            >
                                {loveCat && <Lottie animationData={loveCat} loop={true} />}
                            </motion.div>
                        ) : (
                            // REJECTION STATE: Kicking Cat + Bubble
                            <motion.div 
                              key="kicking-cat"
                              initial={{ opacity: 0, scale: 0.8 }} 
                              animate={{ opacity: 1, scale: 1 }} 
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative flex flex-col items-center"
                            >
                                <div className="w-48 md:w-64 z-0">
                                  {kickingCat && <Lottie animationData={kickingCat} loop={true} />}
                                </div>

                                {/* Speech Bubble */}
                                <motion.div 
                                  key={noCount}
                                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  className="absolute -top-12 z-50 bg-white border border-primary/20 px-5 py-3 rounded-2xl shadow-xl"
                                >
                                  <p className="font-bold text-primary whitespace-nowrap text-lg">
                                    {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
                                  </p>
                                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-primary/20 rotate-45" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BUTTONS CONTAINER */}
                <div className="relative w-full min-h-[120px] flex justify-center items-center gap-8 mt-8 z-20">
                    
                    {/* YES BUTTON */}
                    <motion.button 
                      onClick={handleYesClick} 
                      className="rounded-full bg-primary px-12 py-5 text-2xl md:text-3xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 box-glow" 
                      animate={{ 
                        scale: 1 + (noCount * 0.1),
                        rotate: noCount % 2 === 0 ? 0 : [0, -1, 1, 0] 
                      }}
                      whileHover={{ scale: 1.1 + (noCount * 0.1) }}
                    >
                      YES 💖
                    </motion.button>

                    {/* NO BUTTON */}
                    <motion.button 
                      onClick={handleNoClick}
                      style={isNoBtnMoved ? {
                        position: 'fixed',
                        left: noButtonPos.x,
                        top: noButtonPos.y,
                      } : {
                        position: 'relative',
                      }}
                      
                      animate={isNoBtnMoved ? {
                         left: noButtonPos.x,
                         top: noButtonPos.y,
                      } : {}}
                      
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}

                      className={cn(
                        "rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-8 py-3 text-lg font-medium text-muted-foreground shadow-sm whitespace-nowrap transition-colors",
                        "hover:bg-rose-50 hover:border-primary/40 hover:text-primary",
                        "z-50"
                      )}
                    >
                      {noCount === 0 ? "No" : noPhrases[Math.min(noCount, noPhrases.length - 1)]}
                    </motion.button>
                </div>

                <div className="flex-1" />
            </motion.div>
        )}

        {/* PHASE 3: SUCCESS */}
        {phase === "success" && (
             <motion.div 
               key="success" 
               className="z-20 flex flex-col items-center justify-center text-center px-4 w-full h-full fixed inset-0 bg-background" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ duration: 0.5 }}
             >
                <div className="w-72 md:w-96 mb-8 drop-shadow-2xl">
                    {kissCat && <Lottie animationData={kissCat} loop={true} />}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold font-serif text-primary mb-6 text-glow">
                    YAY! ❤️
                  </h1>
                  <p className="text-xl md:text-2xl text-foreground/80 font-serif italic max-w-lg mx-auto leading-relaxed">
                    I knew you'd say yes. <br/>
                    (Mostly because I didn't give you a choice)
                  </p>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ask;