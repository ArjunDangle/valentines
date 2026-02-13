import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

export default function Letter() {
  const navigate = useNavigate();
  const [catData, setCatData] = useState<any>(null);
  
  // A simplified state machine since we aren't moving the cat anymore
  const [phase, setPhase] = useState<"reading" | "text-exiting" | "cat-exiting">("reading");

  // Fetch the sleeping cat Lottie
  useEffect(() => {
    fetch("/assets/lotties/dance-cat.json")
      .then((res) => res.json())
      .then((data) => setCatData(data));
  }, []);

  const rawParagraphs = [
    { 
      text: "Hello beautiful girl in my phone,", 
      className: "text-3xl font-bold text-primary sm:text-4xl lg:text-5xl mb-6 sm:mb-8" 
    },
    { 
      text: "I wanted to do something a little different this year. You make every single day brighter just by being in it, and you deserve something special.", 
      className: "text-lg leading-relaxed text-foreground/90 sm:text-xl sm:leading-loose lg:text-2xl lg:leading-loose mb-6 sm:mb-8" 
    },
    { 
      text: "There is a very important question I want to ask you...", 
      className: "text-lg leading-relaxed text-foreground/90 sm:text-xl sm:leading-loose lg:text-2xl lg:leading-loose mb-6 sm:mb-8" 
    },
    { 
      text: "But before I do, I need to make absolutely sure this reached the right person.", 
      className: "text-xl italic text-primary sm:text-2xl lg:text-3xl mb-8 sm:mb-12" 
    }
  ];

  let globalWordIndex = 0;
  const processedParagraphs = rawParagraphs.map((p) => {
    const words = p.text.split(" ").map((word) => {
      return { text: word, index: globalWordIndex++ };
    });
    return { className: p.className, words };
  });

  const staggerDelay = 0.08;
  const initialDelay = 0.5;

  // The perfectly timed stationary sequence
  const handleTransition = () => {
    // 1. Text begins to disappear immediately
    setPhase("text-exiting");

    // 2. Cat stays exactly where it is for 2.5 seconds, then begins to exit
    setTimeout(() => {
      setPhase("cat-exiting");

      // 3. Wait 1 second for the cat to fully fade out, then redirect
      setTimeout(() => {
        navigate("/quiz");
      }, 1000);

    }, 2500);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-6 py-12 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 md:flex-row md:gap-16 lg:gap-24">
        
        {/* The Sleeping Cat */}
        <AnimatePresence>
          {phase !== "cat-exiting" && (
            <motion.div 
              // Exit animation for the cat
              exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1, ease: "easeInOut" } }}
              className="order-1 flex w-full justify-center md:order-2 md:w-1/2 z-10"
            >
              {catData ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className="w-56 sm:w-72 md:w-full max-w-[28rem]"
                >
                  <Lottie animationData={catData} loop={true} />
                </motion.div>
              ) : (
                <div className="h-56 w-56 animate-pulse rounded-full bg-primary/5 sm:h-72 sm:w-72" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Letter */}
        {/* We keep this wrapper div constantly rendered so the Flexbox layout NEVER collapses. 
            This is what prevents the cat from moving when the text disappears. */}
        <div className="order-2 flex w-full flex-col font-serif md:order-1 md:w-1/2">
          <AnimatePresence>
            {phase === "reading" && (
              <motion.div
                // Text beautifully blurs out
                exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
                className="w-full flex-col"
              >
                {processedParagraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className={paragraph.className}>
                    {paragraph.words.map((wordObj) => (
                      <motion.span
                        key={wordObj.index}
                        className="inline-block mr-[0.25em] mb-1"
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          delay: initialDelay + wordObj.index * staggerDelay,
                          type: "spring",
                          damping: 12,
                          stiffness: 100,
                        }}
                      >
                        {wordObj.text}
                      </motion.span>
                    ))}
                  </p>
                ))}

                <motion.div 
                  className="mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: initialDelay + globalWordIndex * staggerDelay + 0.5, duration: 1 }}
                >
                  <button
                    onClick={handleTransition}
                    className="rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95 box-glow sm:text-base"
                  >
                    Take the Test ✨
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}