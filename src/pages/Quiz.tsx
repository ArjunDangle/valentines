import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { quizConfig } from "@/config/valentineConfig";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [approved, setApproved] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const q = quizConfig.questions[currentQ];

  const handleAnswer = useCallback(
    (index: number) => {
      if (approved) return;
      if (index === q.correctIndex) {
        setApproved(true);
        setShowHint(false);
        setTimeout(() => {
          if (currentQ < quizConfig.questions.length - 1) {
            setCurrentQ((prev) => prev + 1);
            setApproved(false);
          } else {
            setUnlocked(true);
            setTimeout(() => navigate("/memories"), 2500);
          }
        }, 1200);
      } else {
        setShaking(true);
        setShowHint(true);
        setTimeout(() => setShaking(false), 500);
      }
    },
    [currentQ, q.correctIndex, approved, navigate]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {unlocked ? (
          <motion.div
            key="unlocked"
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              🔓
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-wider text-primary text-glow sm:text-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ACCESS GRANTED
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              It really is you 💕
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={`q-${currentQ}`}
            className="flex w-full max-w-md flex-col gap-8"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3">
              {quizConfig.questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                    i < currentQ
                      ? "bg-primary"
                      : i === currentQ
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <motion.h2
              className="text-center text-xl font-semibold text-foreground sm:text-2xl"
              animate={shaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {q.question}
            </motion.h2>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.p
                  className="text-center text-sm italic text-accent"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Hint: {q.hint}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {q.options.map((option, i) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(i)}
                  className={`w-full rounded-lg border px-5 py-4 text-left transition-colors ${
                    approved && i === q.correctIndex
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-card/80"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {option}
                  {approved && i === q.correctIndex && (
                    <motion.span
                      className="ml-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
