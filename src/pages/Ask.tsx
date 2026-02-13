import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askConfig } from "@/config/valentineConfig";

const Ask = () => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const yesScale = Math.min(1 + dodgeCount * 0.15, 2.5);

  const handleDodge = useCallback(() => {
    setDodgeCount((prev) => prev + 1);
    if (!noRef.current || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const btn = noRef.current.getBoundingClientRect();
    const maxX = container.width - btn.width - 20;
    const maxY = container.height - btn.height - 20;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    noRef.current.style.position = "absolute";
    noRef.current.style.left = `${newX}px`;
    noRef.current.style.top = `${newY}px`;
  }, []);

  const dodgeMessage =
    dodgeCount > 0
      ? askConfig.dodgeMessages[Math.min(dodgeCount - 1, askConfig.dodgeMessages.length - 1)]
      : null;

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            className="flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl font-bold text-foreground text-glow sm:text-5xl md:text-6xl"
              animate={{
                textShadow: [
                  "0 0 20px hsl(340 80% 60% / 0.3)",
                  "0 0 40px hsl(340 80% 60% / 0.5)",
                  "0 0 20px hsl(340 80% 60% / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {askConfig.question}
            </motion.h1>

            {/* Dodge message */}
            <AnimatePresence>
              {dodgeMessage && (
                <motion.p
                  key={dodgeCount}
                  className="text-sm text-accent"
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {dodgeMessage} (#{dodgeCount})
                </motion.p>
              )}
            </AnimatePresence>

            {/* YES Button */}
            <motion.button
              onClick={() => setAccepted(true)}
              className="rounded-2xl bg-primary px-12 py-5 text-xl font-bold text-primary-foreground box-glow sm:text-2xl"
              animate={{ scale: yesScale }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
            >
              YES! 💕
            </motion.button>

            {/* NO Button */}
            <button
              ref={noRef}
              onMouseEnter={handleDodge}
              onTouchStart={handleDodge}
              className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs text-muted-foreground transition-all hover:bg-secondary/80"
            >
              no...
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
          >
            {/* Hearts explosion */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none fixed text-2xl sm:text-3xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  delay: Math.random() * 0.3,
                  ease: "easeOut",
                }}
              >
                {["❤️", "💕", "💖", "💗", "✨", "🥰"][Math.floor(Math.random() * 6)]}
              </motion.span>
            ))}

            <motion.div
              className="text-7xl sm:text-8xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💖
            </motion.div>

            <motion.p
              className="max-w-md text-xl italic text-foreground sm:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {askConfig.yesMessage}
            </motion.p>

            {dodgeCount > 0 && (
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                (you tried to say no {dodgeCount} time{dodgeCount > 1 ? "s" : ""} 😂)
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ask;
