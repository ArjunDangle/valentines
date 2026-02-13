import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { quizConfig } from "@/config/valentineConfig";

export default function Quiz() {
  const navigate = useNavigate();
  // Expanded phases: intro -> quiz -> transition -> unlocked (hearts)
  const [phase, setPhase] = useState<"intro" | "quiz" | "transition" | "unlocked">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [approved, setApproved] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  
  const [catData, setCatData] = useState<any>(null);
  const [heartsData, setHeartsData] = useState<any>(null);

  useEffect(() => {
    fetch("/assets/lotties/sleeping-cat.json")
      .then((res) => res.json())
      .then((data) => setCatData(data));
      
    fetch("/assets/lotties/hearts.json")
      .then((res) => res.json())
      .then((data) => setHeartsData(data));
  }, []);

  const q = quizConfig.questions[currentQ];

  const triggerSuccess = useCallback(() => {
    setApproved(true);
    setCurrentRemark(q.remark || "Correct! ✨");

    setTimeout(() => {
      if (currentQ < quizConfig.questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setApproved(false);
        setCurrentRemark("");
        setTextAnswer("");
      } else {
        // After final question, go to the "Memory Lane" message
        setPhase("transition");
      }
    }, 2000); 
  }, [currentQ, q.remark]);

  const triggerError = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const handleMcqAnswer = useCallback(
    (index: number) => {
      if (approved) return;
      if (index === q.correctIndex || q.options[index] === "Mahek") {
        triggerSuccess();
      } else {
        triggerError();
      }
    },
    [q, approved, triggerSuccess, triggerError]
  );

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (approved) return;
    if (textAnswer.trim().length > 0) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  // The logic for the final hearts transition sequence
  const handleFinalTransition = () => {
    setPhase("unlocked");
    
    // Sequence logic:
    // 1. Hearts start immediately (in Phase 4 render)
    // 2. Text exit starts at 1s (handled by Framer transition)
    // 3. Navigate away after hearts have played for 3s
    setTimeout(() => {
      navigate("/memories");
    }, 3000);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6 pb-24">
      
      {/* Sleeping Cat - Stays visible until the final hearts animation */}
      {catData && (phase === "intro" || phase === "quiz" || phase === "transition") && (
        <motion.div 
          className="fixed bottom-[-20px] left-1/2 z-0 w-48 -translate-x-1/2 pointer-events-none opacity-80 sm:w-64"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }} 
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
        >
          <Lottie animationData={catData} loop={true} />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* --- PHASE 1: THE RULES INTRO --- */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="z-10 flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border border-border/50 bg-card/60 p-8 text-center shadow-xl backdrop-blur-md sm:p-12"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Girlfriend Verification Process
            </h1>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              (Intruders will have cockroaches released in their house 🪳)
            </p>
            <div className="my-2 h-px w-16 bg-primary/20" />
            <p className="font-serif text-lg leading-relaxed text-foreground/80 sm:text-xl">
              Not exactly "rules", but over the period of 17 months of knowing you and 6 months of dating you, I think my girlfriend would be pretty qualified to answer these questions.
            </p>
            <button
              onClick={() => setPhase("quiz")}
              className="mt-4 rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95 box-glow"
            >
              Are you ready? ✨
            </button>
          </motion.div>
        )}

        {/* --- PHASE 2: THE QUIZ --- */}
        {phase === "quiz" && (
          <motion.div
            key={`q-${currentQ}`}
            className="z-10 flex w-full max-w-md flex-col gap-8 rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-md sm:p-8"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {quizConfig.questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i < currentQ ? "bg-primary" : i === currentQ ? "bg-primary/40" : "bg-black/5"
                    }`}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                {approved && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center font-serif text-sm font-medium text-primary h-5"
                  >
                    {currentRemark}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2">
              <motion.h2
                className="text-center font-serif text-2xl font-semibold text-foreground sm:text-3xl"
                animate={shaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {q.question}
              </motion.h2>
              <p className="text-center font-serif text-sm italic text-primary/70">
                Hint: {q.hint}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {q.type === "mcq" ? (
                q.options.map((option, i) => {
                  const isCorrectThisTime = approved && (i === q.correctIndex || option === "Mahek");
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleMcqAnswer(i)}
                      className={`w-full rounded-xl border px-5 py-4 text-left font-medium transition-all ${
                        isCorrectThisTime
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 bg-white/50 text-foreground/80 hover:border-primary/40 hover:bg-white/80"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option}
                      {isCorrectThisTime && <span className="float-right text-primary">✓</span>}
                    </motion.button>
                  );
                })
              ) : (
                <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    disabled={approved}
                    className={`w-full rounded-xl border px-5 py-4 text-center font-medium outline-none transition-all ${
                      approved ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-white/50 focus:border-primary/60"
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-3.5 font-sans text-sm font-medium text-primary-foreground box-glow"
                  >
                    Submit Answer
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* --- PHASE 3: TRANSITION MESSAGE --- */}
        {phase === "transition" && (
          <motion.div
            key="transition-msg"
            className="z-10 flex w-full max-w-lg flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Now that I know it really is my sunshine girl...
            </h2>
            <p className="font-serif text-lg text-foreground/80 sm:text-xl">
              I want to take you on a ride down memory lane.
            </p>
            <button
              onClick={handleFinalTransition}
              className="mt-4 rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95 box-glow"
            >
              Ready, my love? ✨
            </button>
          </motion.div>
        )}

        {/* --- PHASE 4: THE HEARTS FINALE --- */}
        {phase === "unlocked" && (
          <motion.div
            key="hearts-sequence"
            className="z-10 flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* The Heart JSON Lottie playing for 3 seconds */}
            <div className="w-64 sm:w-80">
              {heartsData && (
                <Lottie animationData={heartsData} loop={true} />
              )}
            </div>
            
            {/* Text disappears silently after 1s of hearts playing */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1, duration: 6, ease: "easeInOut" }}
              className="flex flex-col gap-2"
            >
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}