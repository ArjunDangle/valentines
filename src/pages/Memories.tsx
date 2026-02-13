import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// The Perfect 9x8 Heart Grid Pattern
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

interface Card {
    id: string;
    imageUrl: string;
    pairId: string;
    flipped: boolean;
    matched: boolean;
}

// Generates and shuffles the 22 pairs of cards needed for the 44 slots
function shuffleCards(): Card[] {
    const totalPairsNeeded = 22;
    const availableImages = 13;
    const pairs: Card[] = [];
    
    for (let i = 0; i < totalPairsNeeded; i++) {
        const imageIndex = (i % availableImages) + 1;
        const imageUrl = `/assets/images/${imageIndex}.jpeg`;
        const pairId = `pair-${i}`;
        
        pairs.push({ id: `${pairId}-a`, imageUrl, pairId, flipped: false, matched: false });
        pairs.push({ id: `${pairId}-b`, imageUrl, pairId, flipped: false, matched: false });
    }

    // Fisher-Yates shuffle algorithm
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs;
}

const Memories = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>(shuffleCards);
    const [selected, setSelected] = useState<string[]>([]);
    const [checking, setChecking] = useState(false);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [zoomedCard, setZoomedCard] = useState<Card | null>(null);

    // Auto-close zoom after 1.5 seconds
    useEffect(() => {
        if (zoomedCard) {
            const timer = setTimeout(() => {
                setZoomedCard(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [zoomedCard]);

    const handleCardClick = (card: Card) => {
        // 1. ZOOM LOGIC: If card is already visible (flipped or matched), zoom it.
        if (card.flipped || card.matched) {
            setZoomedCard(card);
            return;
        }

        // 2. GAME LOGIC: Prevent flipping if checking matches or if card is locked
        if (checking || selected.length >= 2) return;

        // Flip the card
        const newSelected = [...selected, card.id];
        setSelected(newSelected);
        setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));

        // Check for match
        if (newSelected.length === 2) {
            setChecking(true);
            const [firstCard, secondCard] = cards.filter(c => newSelected.includes(c.id));

            setTimeout(() => {
                if (firstCard.pairId === secondCard.pairId) {
                    // Match found
                    setCards(prev => {
                        const updatedCards = prev.map(c => c.pairId === firstCard.pairId ? { ...c, matched: true } : c);
                        if (updatedCards.every(c => c.matched)) {
                            setTimeout(() => setPuzzleSolved(true), 800);
                        }
                        return updatedCards;
                    });
                } else {
                    // No match, flip back
                    setCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
                }
                setSelected([]);
                setChecking(false);
            }, 1000);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
            <AnimatePresence mode="wait">
                {!puzzleSolved ? (
                    <motion.div
                        key="puzzle"
                        className="flex flex-col items-center justify-center w-full h-full"
                        exit={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* 
                            Grid Container 
                            - Uses vw units for perfect mobile scaling
                            - Uses gap-1 for tight packing
                        */}
                        <div className="grid grid-cols-9 gap-1 max-w-[98vw] mx-auto place-items-center p-2">
                            {(() => {
                                let cardIndex = 0;
                                return HEART_GRID.flatMap((row, r) =>
                                    row.map((cell, c) => {
                                        // Grid Sizing: 
                                        // Mobile: 10vw (fits 9 cols in 90vw)
                                        // Desktop: Fixed sizes
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
                                                    {/* Card Back (Gray) */}
                                                    <div 
                                                        className="absolute inset-0 w-full h-full bg-slate-300 rounded-[2px] sm:rounded-md z-10" 
                                                        style={{ backfaceVisibility: 'hidden' }} 
                                                    />
                                                    
                                                    {/* Card Front (Image) */}
                                                    <div 
                                                        className="absolute inset-0 w-full h-full rounded-[2px] sm:rounded-md overflow-hidden bg-white" 
                                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                                    >
                                                        <motion.img 
                                                            layoutId={`img-${card.id}`} // Shared layout ID for smooth zoom
                                                            src={card.imageUrl} 
                                                            alt="Memory" 
                                                            className={`w-full h-full object-cover ${card.matched ? 'opacity-50 grayscale-[0.5]' : ''}`} 
                                                        />
                                                        {card.matched && <div className="absolute inset-0 bg-primary/20" />}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })
                                );
                            })()}
                        </div>

                        {/* Text Overlay */}
                        <div className="absolute bottom-6 w-full px-6 flex justify-between items-end pointer-events-none">
                            <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.5}}>
                                <h1 className="text-white text-2xl sm:text-4xl font-bold font-serif leading-none">Match</h1>
                                <p className="text-white/60 text-xs sm:text-sm font-sans tracking-widest uppercase mt-1">the pairs</p>
                            </motion.div>
                            
                            <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.5}} className="text-right">
                                <p className="text-white/60 text-xs sm:text-sm font-sans tracking-widest uppercase mb-1">to reveal</p>
                                <h1 className="text-white text-2xl sm:text-4xl font-bold font-serif leading-none">Surprise</h1>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="unlocked"
                        className="text-center text-white px-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold font-serif text-glow mb-6">Story Unlocked</h2>
                        <button
                            onClick={() => navigate("/scroll-page")}
                            className="rounded-full bg-white text-black px-12 py-4 font-bold text-lg tracking-wider transition-transform hover:scale-105 active:scale-95"
                        >
                            CONTINUE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ZOOM OVERLAY */}
            <AnimatePresence>
                {zoomedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
                        onClick={() => setZoomedCard(null)}
                    >
                        <motion.img
                            layoutId={`img-${zoomedCard.id}`} // Matches the grid layoutId
                            src={zoomedCard.imageUrl}
                            className="w-full max-w-lg rounded-xl shadow-2xl object-contain max-h-[80vh]"
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Memories;