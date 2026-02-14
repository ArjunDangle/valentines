import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// --- CONFIG ---
const HEART_GRID = [
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
];

// The 9 extra pairs we need
const EMOJI_LIST = ["🌻", "🐈", "🐒", "🦊", "🍣", "💖", "🧸", "🎀", "🌙"];

interface Card {
    id: string;
    type: 'image' | 'emoji';
    content: string; // URL for images, Emoji char for emojis
    pairId: string;
    flipped: boolean;
    matched: boolean;
    justMatched?: boolean;
}

function shuffleCards(): Card[] {
    const pairs: Card[] = [];
    const totalImagePairs = 13;
    
    // 1. Create Image Pairs (1-13)
    for (let i = 1; i <= totalImagePairs; i++) {
        const pairId = `img-pair-${i}`;
        const imageUrl = `/assets/images/${i}.jpeg`;
        pairs.push({ id: `${pairId}-a`, type: 'image', content: imageUrl, pairId, flipped: false, matched: false });
        pairs.push({ id: `${pairId}-b`, type: 'image', content: imageUrl, pairId, flipped: false, matched: false });
    }

    // 2. Create Emoji Pairs (9 pairs)
    EMOJI_LIST.forEach((emoji, index) => {
        const pairId = `emoji-pair-${index}`;
        pairs.push({ id: `${pairId}-a`, type: 'emoji', content: emoji, pairId, flipped: false, matched: false });
        pairs.push({ id: `${pairId}-b`, type: 'emoji', content: emoji, pairId, flipped: false, matched: false });
    });

    // Total: 13 + 9 = 22 Pairs (44 Cards)

    // 3. Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs;
}

const Sparkles = () => (
    <div className="absolute inset-0 pointer-events-none z-50 flex justify-center items-center">
         {[...Array(8)].map((_, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                    opacity: 0, 
                    scale: [0, 1.2, 1.5], 
                    x: (Math.random() - 0.5) * 100, 
                    y: -40 - Math.random() * 60 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute text-2xl"
             >
                 💖
             </motion.div>
         ))}
    </div>
);

const Memories = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>(shuffleCards);
    const [selected, setSelected] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    
    const [phase, setPhase] = useState<"playing" | "celebrating" | "finished">("playing");
    const [heartsData, setHeartsData] = useState<any>(null);

    useEffect(() => {
        fetch("/assets/lotties/hearts.json")
          .then((res) => res.json())
          .then((data) => setHeartsData(data));
    }, []);

    // --- MATCH LOGIC ---
    useEffect(() => {
        if (selected.length === 2) {
            setIsChecking(true);
            
            const [id1, id2] = selected;
            const card1 = cards.find(c => c.id === id1);
            const card2 = cards.find(c => c.id === id2);

            if (!card1 || !card2) return;

            // Simple Pair ID check works now because every pair is unique!
            if (card1.pairId === card2.pairId) {
                // MATCH
                setCards(prev => prev.map(c => 
                    (c.id === id1 || c.id === id2) 
                    ? { ...c, matched: true, flipped: true, justMatched: true } 
                    : c
                ));

                setTimeout(() => {
                     setCards(prev => prev.map(c => 
                        (c.id === id1 || c.id === id2) 
                        ? { ...c, justMatched: false } 
                        : c
                    ));
                }, 1000);
                
                setSelected([]);
                setIsChecking(false);
            } else {
                // NO MATCH
                setTimeout(() => {
                    setCards(prev => prev.map(c => 
                        (c.id === id1 || c.id === id2) 
                        ? { ...c, flipped: false } 
                        : c
                    ));
                    setSelected([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    }, [selected, cards]);

    // --- WIN CONDITION ---
    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.matched)) {
            setTimeout(() => setPhase("celebrating"), 800);
        }
    }, [cards]);

    // --- CELEBRATION TIMER ---
    useEffect(() => {
        if (phase === "celebrating") {
            const timer = setTimeout(() => {
                setPhase("finished");
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const handleCardClick = (card: Card) => {
        if (isChecking || card.flipped || card.matched) return;
        setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));
        setSelected(prev => [...prev, card.id]);
    };

    return (
        <motion.div 
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            initial={{ backgroundColor: "#ffffff" }}
            animate={{ backgroundColor: "#000000" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
        >
            <AnimatePresence mode="wait">
                
                {/* PHASE 1: GAME BOARD */}
                {phase === "playing" && (
                    <motion.div
                        key="puzzle"
                        className="flex flex-col items-center justify-center w-full h-full relative z-10"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                    >
                         <motion.div 
                            className="grid grid-cols-9 gap-1 max-w-[98vw] mx-auto place-items-center p-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5, duration: 1.5 }}
                        >
                            {(() => {
                                let cardIndex = 0;
                                return HEART_GRID.flatMap((row, r) =>
                                    row.map((cell, c) => {
                                        const cellSize = "w-[10vw] h-[10vw] sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20";
                                        
                                        if (cell === 0) return <div key={`empty-${r}-${c}`} className={cellSize} />;
                                        
                                        const card = cards[cardIndex++];
                                        if (!card) return <div key={`extra-${r}-${c}`} className={cellSize} />;

                                        return (
                                            <div
                                                key={card.id}
                                                className={`${cellSize} relative cursor-pointer`}
                                                style={{ perspective: '1000px' }}
                                                onClick={() => handleCardClick(card)}
                                            >
                                                <motion.div
                                                    className="w-full h-full relative"
                                                    style={{ transformStyle: 'preserve-3d' }}
                                                    animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    {/* Card Back */}
                                                    <div 
                                                        className="absolute inset-0 w-full h-full bg-slate-300 rounded-[2px] sm:rounded-md z-10" 
                                                        style={{ backfaceVisibility: 'hidden' }} 
                                                    />
                                                    
                                                    {/* Card Front */}
                                                    <div 
                                                        className="absolute inset-0 w-full h-full rounded-[2px] sm:rounded-md overflow-hidden bg-white flex items-center justify-center" 
                                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                                    >
                                                        {card.type === 'image' ? (
                                                            <img 
                                                                src={card.content} 
                                                                alt="Memory" 
                                                                className={`w-full h-full object-cover transition-all duration-500 ${card.matched ? 'opacity-40 grayscale' : ''}`} 
                                                            />
                                                        ) : (
                                                            // Emoji Render
                                                            <span className={`text-2xl sm:text-4xl select-none transition-all duration-500 ${card.matched ? 'opacity-40 grayscale' : ''}`}>
                                                                {card.content}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Sparkles */}
                                                    {card.justMatched && (
                                                        <div 
                                                            className="absolute inset-0 flex items-center justify-center z-50" 
                                                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                                        >
                                                            <Sparkles />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        );
                                    })
                                );
                            })()}
                        </motion.div>

                        {/* Instructions */}
                        <div className="absolute bottom-6 w-full px-6 flex justify-between items-end pointer-events-none">
                            <motion.div 
                                initial={{opacity: 0, x: -20}} 
                                animate={{opacity: 1, x: 0}} 
                                transition={{delay: 2.0, duration: 1}}
                            >
                                <h1 className="text-white text-2xl sm:text-4xl font-bold font-serif leading-none">Match</h1>
                                <p className="text-white/60 text-xs sm:text-sm font-sans tracking-widest uppercase mt-1">the pairs</p>
                            </motion.div>
                            
                            <motion.div 
                                initial={{opacity: 0, x: 20}} 
                                animate={{opacity: 1, x: 0}} 
                                transition={{delay: 2.0, duration: 1}} 
                                className="text-right"
                            >
                                <p className="text-white/60 text-xs sm:text-sm font-sans tracking-widest uppercase mb-1">to reveal</p>
                                <h1 className="text-white text-2xl sm:text-4xl font-bold font-serif leading-none">Surprise</h1>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* PHASE 2: CELEBRATION */}
                {phase === "celebrating" && (
                    <motion.div
                        key="celebration"
                        className="absolute inset-0 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.5 } }}
                    >
                        <div className="w-full max-w-md p-8">
                            {heartsData && <Lottie animationData={heartsData} loop={true} />}
                        </div>
                    </motion.div>
                )}

                {/* PHASE 3: FINALE */}
                {phase === "finished" && (
                    <motion.div
                        key="cta"
                        className="flex flex-col items-center justify-center text-center z-30 px-6 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            You found all the pieces of my heart.
                        </h2>
                        <p className="text-white/70 text-lg mb-10 font-light">
                            Now, are you ready to see where this journey has taken us?
                        </p>
                        
                        <button
                            onClick={() => navigate("/scroll-page")}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold tracking-widest text-sm uppercase transition-all hover:scale-105 hover:bg-rose-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        >
                            <span>Walk down Memory Lane</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Memories;