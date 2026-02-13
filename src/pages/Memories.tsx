import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { memoriesConfig } from "@/config/valentineConfig";

// Heart-shaped grid: 1 = card, 0 = empty
const HEART_GRID = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

interface Card {
  id: string;
  emoji: string;
  pairId: string;
  flipped: boolean;
  matched: boolean;
}

function shuffleCards(): Card[] {
  const pairs = memoriesConfig.matchPairs.flatMap((p) => [
    { id: `${p.id}-a`, emoji: p.emoji, pairId: p.id, flipped: false, matched: false },
    { id: `${p.id}-b`, emoji: p.emoji, pairId: p.id, flipped: false, matched: false },
  ]);
  // Shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

function getCardSlots() {
  const slots: { row: number; col: number }[] = [];
  HEART_GRID.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 1) slots.push({ row: r, col: c });
    })
  );
  return slots;
}

const TimelineItem = ({ item, index }: { item: (typeof memoriesConfig.timeline)[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col gap-4 sm:flex-row sm:gap-8 ${index % 2 === 1 ? "sm:flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
    >
      <div className="flex-shrink-0 overflow-hidden rounded-xl border border-border sm:w-72">
        <img
          src={item.imageUrl}
          alt={item.caption}
          className="h-48 w-full object-cover sm:h-56"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          {item.date}
        </span>
        <p className="max-w-sm text-lg italic text-foreground/90" style={{ fontFamily: "'Playfair Display', serif" }}>
          "{item.caption}"
        </p>
      </div>
    </motion.div>
  );
};

const Memories = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(shuffleCards);
  const [selected, setSelected] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  const cardSlots = getCardSlots();

  const handleFlip = useCallback(
    (cardId: string) => {
      if (checking || selected.length >= 2) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.flipped || card.matched) return;

      const newCards = cards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c));
      setCards(newCards);
      const newSelected = [...selected, cardId];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setChecking(true);
        const [a, b] = newSelected.map((id) => newCards.find((c) => c.id === id)!);
        setTimeout(() => {
          if (a.pairId === b.pairId) {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.pairId === a.pairId ? { ...c, matched: true } : c
              );
              if (updated.every((c) => c.matched)) {
                setTimeout(() => setPuzzleSolved(true), 800);
              }
              return updated;
            });
          } else {
            setCards((prev) =>
              prev.map((c) =>
                newSelected.includes(c.id) ? { ...c, flipped: false } : c
              )
            );
          }
          setSelected([]);
          setChecking(false);
        }, 800);
      }
    },
    [cards, selected, checking]
  );

  return (
    <div className={`min-h-screen ${!puzzleSolved ? "flex items-center justify-center overflow-hidden" : ""}`}>
      <AnimatePresence mode="wait">
        {!puzzleSolved ? (
          <motion.div
            key="puzzle"
            className="flex flex-col items-center gap-6 px-4"
            exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Match the pairs to unlock our story
            </motion.p>

            {/* Heart grid */}
            <div
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(8, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(6, minmax(0, 1fr))`,
                width: "min(90vw, 420px)",
              }}
            >
              {(() => {
                let cardIndex = 0;
                return HEART_GRID.flatMap((row, r) =>
                  row.map((cell, c) => {
                    if (cell === 0) {
                      return (
                        <div
                          key={`empty-${r}-${c}`}
                          style={{ gridRow: r + 1, gridColumn: c + 1 }}
                        />
                      );
                    }
                    const card = cards[cardIndex++];
                    if (!card) return null;
                    return (
                      <motion.button
                        key={card.id}
                        onClick={() => handleFlip(card.id)}
                        className={`aspect-square rounded-md border text-lg transition-colors sm:text-xl ${
                          card.matched
                            ? "border-primary/40 bg-primary/10"
                            : card.flipped
                            ? "border-primary bg-card"
                            : "border-border bg-secondary hover:border-primary/30"
                        }`}
                        style={{ gridRow: r + 1, gridColumn: c + 1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={card.matched ? { scale: [1, 1.15, 1] } : {}}
                      >
                        {card.flipped || card.matched ? card.emoji : ""}
                      </motion.button>
                    );
                  })
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            className="mx-auto max-w-2xl px-6 py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.h2
              className="mb-16 text-center text-3xl font-bold text-foreground text-glow sm:text-4xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Our Story So Far
            </motion.h2>

            <div className="flex flex-col gap-16 sm:gap-24">
              {memoriesConfig.timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </div>

            {/* Prompt to finale */}
            <motion.div
              className="mt-24 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-20 w-px bg-gradient-to-b from-transparent via-primary/50 to-primary" />
              <motion.button
                onClick={() => navigate("/ask")}
                className="group flex flex-col items-center gap-2 text-primary"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg italic text-glow">One more thing...</span>
                <motion.span
                  className="text-2xl"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↓
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memories;
