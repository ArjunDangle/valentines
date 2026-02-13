import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils"; // Ensure you have utils, otherwise standard string concat works

const Ask = () => {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [catKissData, setCatKissData] = useState(null);
  
  // Button state
  const [noPosition, setNoPosition] = useState({ top: "auto", left: "auto", position: "relative" } as any);
  const [hasMoved, setHasMoved] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Celebration Lottie
  useEffect(() => {
    fetch("/assets/lotties/cat-kiss.json")
      .then((res) => res.json())
      .then((data) => setCatKissData(data))
      .catch(err => console.error("Failed to load cat-kiss.json", err));
  }, []);

  const noPhrases = [
    "No",
    "Are you sure?",
    "Really?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "I wouldn't say no!",
    "Pretty please?",
    "I'll make you cookies!",
  ];

  // Logic to move the button to a SAFE random spot
  const moveNoButton = () => {
    if (!containerRef.current) return;
    
    // Get screen dimensions
    const { width, height } = containerRef.current.getBoundingClientRect();
    const btnWidth = 120; 
    const btnHeight = 60;

    // Calculate safe bounds (padding of 50px)
    const maxX = width - btnWidth - 50;
    const maxY = height - btnHeight - 50;

    const newX = Math.random() * maxX + 25; // 25px padding
    const newY = Math.random() * maxY + 25;

    setNoPosition({
      position: "absolute",
      top: `${newY}px`,
      left: `${newX}px`,
      transition: "top 0.3s ease, left 0.3s ease" // Smooth glide instead of teleport
    });
    
    setHasMoved(true);
    setNoCount(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100 selection:bg-primary/20"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            className="z-10 flex flex-col items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            {/* The Big Text */}
            <div className="text-center space-y-4 px-4">
              <span className="text-sm font-bold tracking-[0.3em] text-primary/60 uppercase">
                The Final Question
              </span>
              <h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground leading-[1.1] text-glow">
                Will you be my <br/>
                <span className="text-primary inline-block mt-2">Valentine?</span>
              </h1>
            </div>

            {/* Buttons Container */}
            <div className="relative flex flex-col md:flex-row items-center gap-6 mt-4 w-full justify-center min-h-[120px]">
              
              {/* YES BUTTON */}
              <motion.button
                onClick={() => setAccepted(true)}
                className="z-20 relative group overflow-hidden rounded-full bg-primary px-12 py-5 text-xl md:text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 box-glow"
                animate={{ 
                  scale: 1 + (noCount * 0.05) // Grows slowly
                }}
                whileHover={{ scale: (1 + (noCount * 0.05)) * 1.05 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  YES <span className="text-2xl">💖</span>
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent z-0" />
              </motion.button>

              {/* NO BUTTON */}
              <motion.button
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton} // Just in case they click fast
                style={noPosition}
                className={`
                  rounded-full border-2 border-primary/20 bg-white/80 backdrop-blur-sm px-10 py-4 text-lg font-medium text-muted-foreground shadow-sm transition-all
                  hover:bg-rose-50 hover:border-primary/40 hover:text-primary
                  ${hasMoved ? "absolute" : "relative"}
                `}
                animate={hasMoved ? { opacity: 1 } : { x: [0, -4, 4, 0] }} // Shake slightly at start
              >
                {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
              </motion.button>

            </div>
            
            {/* Hint text if they try too hard */}
            {noCount > 1 && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground/60 italic absolute bottom-10"
                >
                    (Nice try, but you really have no choice 😘)
                </motion.p>
            )}

          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="z-20 flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
             {/* The Cat Kiss Lottie */}
             <div className="w-64 md:w-80 mb-8 drop-shadow-2xl">
                {catKissData && (
                    <Lottie animationData={catKissData} loop={true} />
                )}
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h1 className="text-5xl md:text-7xl font-bold font-serif text-primary mb-6">
                  YAY! ❤️
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-serif italic max-w-lg mx-auto leading-relaxed">
                  I knew you'd say yes. <br/>
                  (Mostly because I didn't give you a choice)
                </p>
                
                <div className="mt-12 p-6 bg-white/50 backdrop-blur-md rounded-2xl border border-primary/10 shadow-lg max-w-md mx-auto">
                    <p className="text-sm font-bold tracking-widest text-primary/70 uppercase mb-2">Next Step</p>
                    <p className="text-lg text-foreground">See you on February 14th.</p>
                </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ask;