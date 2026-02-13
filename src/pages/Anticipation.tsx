import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Anticipation = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => navigate("/quiz"), 2200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Ambient particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
          }}
          animate={{
            y: [null, Math.random() * -200 - 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            className="flex cursor-pointer flex-col items-center gap-8"
            onClick={handleOpen}
            exit={{ scale: 1.2, opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Envelope */}
            <motion.div
              className="relative flex h-40 w-56 items-center justify-center rounded-lg border border-border bg-card box-glow sm:h-52 sm:w-72"
              animate={{
                y: [0, -8, 0],
                boxShadow: [
                  "0 0 30px hsl(340 80% 60% / 0.2)",
                  "0 0 50px hsl(340 80% 60% / 0.4)",
                  "0 0 30px hsl(340 80% 60% / 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Envelope flap */}
              <div className="absolute -top-[1px] left-0 right-0">
                <div
                  className="mx-auto h-0 w-0 border-l-[7rem] border-r-[7rem] border-t-[4.5rem] border-l-transparent border-r-transparent border-t-card sm:border-l-[9rem] sm:border-r-[9rem] sm:border-t-[5.5rem]"
                  style={{
                    filter: "drop-shadow(0 2px 4px hsl(340 80% 60% / 0.15))",
                  }}
                />
              </div>
              {/* Heart seal */}
              <motion.span
                className="text-5xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                💌
              </motion.span>
            </motion.div>

            <motion.p
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              tap to open
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="flex flex-col items-center gap-6 px-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <motion.p
              className="font-serif text-2xl italic text-foreground sm:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5 }}
            >
              I made something for you...
            </motion.p>
            <motion.div
              className="h-px w-24 bg-primary/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              but first, prove you're really you ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Anticipation;
