import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

export default function Anticipation() {
  const navigate = useNavigate();
  // Expanded state machine to handle the cinematic exit
  const [phase, setPhase] = useState<"typing" | "envelope" | "exiting-envelope" | "exiting-cat">("typing");
  
  const [catData, setCatData] = useState<any>(null);
  const [envelopeData, setEnvelopeData] = useState<any>(null);
  const catRef = useRef<any>(null);

  useEffect(() => {
    fetch("/assets/lotties/cat.json")
      .then((res) => res.json())
      .then((data) => setCatData(data));
      
    fetch("/assets/lotties/envelope.json")
      .then((res) => res.json())
      .then((data) => setEnvelopeData(data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase((prev) => (prev === "typing" ? "envelope" : prev));
    }, 8500); 

    return () => clearTimeout(timer);
  }, []);

  const message = "Oh, looks like this letter was meant for a very specific girl... one with beautiful brown hair, and the prettiest brown eyes. Yep, it definitely flew to the correct inbox.";
  const words = message.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 1.5 }, 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: "blur(10px)",
      transition: { duration: 1, ease: "easeInOut" } 
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
  };

  // The perfectly timed exit sequence
  const handleTransition = () => {
    // 1. Envelope immediately begins to blur/fade out
    setPhase("exiting-envelope");

    // 2. Wait 0.8s (for envelope to fade) + 0.5s pause = 1.3s total
    setTimeout(() => {
      setPhase("exiting-cat");

      // 3. Cat drops down (takes about 0.8s), then we navigate
      setTimeout(() => {
        navigate("/letter");
      }, 1000); 

    }, 1300);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6">
      
      {/* The Cat Mascot */}
      {catData && (
        <motion.div 
          className="fixed bottom-0 z-0 pointer-events-none w-64 sm:w-80 md:w-96 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-16 lg:right-32"
          // Starts hidden below screen
          initial={{ y: "100%" }}
          // If phase is exiting-cat, move back to 100% (hidden). Otherwise, 0% (visible).
          animate={{ y: phase === "exiting-cat" ? "100%" : "0%" }} 
          // Switch the transition based on whether it's entering or exiting
          transition={
            phase === "exiting-cat" 
              ? { duration: 0.8, ease: "easeInOut" } // Smooth slide down to exit
              : { type: "spring", delay: 0.5, duration: 1.5, bounce: 0.4 } // Bouncy entrance
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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {phase === "typing" && (
          <motion.div
            key="text-sequence"
            className="z-10 mb-20 max-w-2xl text-center sm:mb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="font-serif text-xl leading-relaxed text-foreground sm:text-3xl sm:leading-relaxed md:text-4xl md:leading-relaxed">
              {words.map((word, index) => (
                <motion.span key={index} className="inline-block mr-2" variants={wordVariants}>
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        )}

        {phase === "envelope" && (
          <motion.div
            key="envelope-sequence"
            className="z-10 mb-20 flex cursor-pointer flex-col items-center gap-4 sm:mb-24"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            // Add the exit animation for when the envelope unmounts
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
            onClick={handleTransition}
          >
            <div className="w-72 sm:w-96 md:w-[32rem]">
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
              tap to find out what it says
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}