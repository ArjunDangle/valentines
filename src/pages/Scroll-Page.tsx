import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";

// --- CONFIGURATION ---
const scrollEvents = [
    {
        image: '/assets/memories/first.jpeg',
        title: 'The First Date',
        date: 'CHAPTER I',
        description: 'If you told me a year ago that I would be writing this, I would have laughed. But here we are. My favorite sunflower who looked like a sunflower that day. Truly "pehla nasha" worthy.'
    },
    {
        image: '/assets/memories/ganpati.jpeg',
        title: 'Bappa With My Sweetheart',
        date: 'CHAPTER II',
        description: '25 thousand steps. I could not feel my legs. But I would walk 25 thousand more with you with a broken leg. I hope Bappa makes this our annual tradition.'
    },
    {
        image: '/assets/memories/birthday.jpeg',
        title: 'Beer and Wine',
        date: 'CHAPTER III',
        description: 'I hope my beer glass is next to your wine glass for the rest of our lives. Can\'t wait to celebrate every single birthday with you, and make every single day feel like a celebration too.'
    },
    {
        image: '/assets/memories/card.jpeg',
        title: 'My Favorite Thing',
        date: 'CHAPTER IV',
        description: 'I don\'t usually have bad days since I met you. But if I am ever feeling low, this is my favorite thing to look at. My little Mahek Mehta in my pocket. I hope I get buried with this.'
    },
    {
        image: '/assets/memories/mahek.jpeg',
        title: 'My Sunshine Girl',
        date: 'CHAPTER V',
        description: 'One of my favorite pictures of you. One Direction knew what was up when they said, "Baby you light up my world like nobody else."'
    }
];

// --- COMPONENT: Individual Memory Section ---
const MemorySection = ({ event, index }: { event: typeof scrollEvents[0]; index: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Only scale changes now. Opacity is removed to prevent the "white overlay" look.
    const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.85, 1.05, 0.85]);
    const yText = useTransform(scrollYProgress, [0.1, 0.9], [50, -50]);
    const isEven = index % 2 === 0;

    return (
        <section ref={ref} className="min-h-screen flex items-center justify-center py-24 px-4 relative">
            <motion.div 
                style={{ scale }} // Removed opacity from here
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 max-w-7xl w-full mx-auto`}
            >
                <div className="flex-1 w-full aspect-[3/4] lg:aspect-[4/5] relative group">
                    <div className="absolute inset-0 border-2 border-primary/20 translate-x-3 translate-y-3 lg:translate-x-5 lg:translate-y-5 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
                    <div className="relative h-full w-full overflow-hidden bg-muted shadow-2xl z-10">
                        <img 
                            src={event.image} 
                            alt={event.title} 
                            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                        />
                    </div>
                </div>
                <div className="flex-1 text-center lg:text-left space-y-8 z-20">
                    <motion.div style={{ y: yText }} className="flex flex-col gap-4 items-center lg:items-start">
                        <span className="inline-block text-xs font-bold tracking-[0.4em] uppercase text-primary/70">{event.date}</span>
                        <h2 className="text-5xl md:text-7xl font-serif text-foreground leading-[0.9] tracking-tight">{event.title}</h2>
                        <div className="w-12 h-0.5 bg-primary/30 my-4" />
                        <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground max-w-md font-sans">{event.description}</p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---
const ScrollPage = () => {
    const navigate = useNavigate();
    const [rosesData, setRosesData] = useState(null);

    useEffect(() => {
        fetch('/assets/lotties/roses.json')
            .then(res => res.json())
            .then(data => setRosesData(data))
            .catch(err => console.error("Failed to load roses.json", err));
    }, []);

    return (
        <div className="bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
            
            {/* 1. HERO SECTION */}
            <div className="h-screen flex flex-col items-center justify-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="flex items-center justify-center gap-4"
                >
                    {rosesData && <Lottie animationData={rosesData} loop={false} className="w-24 md:w-32" />}
                    <h1 className="text-5xl md:text-7xl font-bold font-serif text-glow">
                        Our Memory Lane
                    </h1>
                    {rosesData && <Lottie animationData={rosesData} loop={false} className="w-24 md:w-32 transform -scale-x-100" />}
                </motion.div>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="max-w-xl text-center text-lg md:text-xl font-serif italic text-foreground/80 leading-loose mt-8"
                >
                    "Every story has a beginning, but ours is my favorite. Let's revisit the moments that brought us here..."
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 text-2xl text-primary animate-bounce"
                >
                    ↓
                </motion.div>
            </div>

            {/* 2. SCROLLABLE MEMORY SECTIONS */}
            <div className="relative z-10 bg-background space-y-20 pb-20">
                {scrollEvents.map((event, index) => (
                    <MemorySection key={index} event={event} index={index} />
                ))}
            </div>
            
            {/* 3. FINALE SECTION */}
            <div className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10 bg-background">
                 <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1 }}
                    className="max-w-2xl"
                >
                    <h2 className="text-5xl md:text-7xl font-bold font-serif mb-8 text-glow">
                        One Last Question
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 font-light">
                        We've looked at the past. Now I want to ask you about our future.
                    </p>
                    
                    <button
                        onClick={() => navigate("/ask")}
                        className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-medium text-primary-foreground transition duration-300 ease-out border-2 border-primary rounded-full shadow-md bg-primary hover:bg-transparent hover:text-primary"
                    >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-primary-foreground transition-all duration-300 transform group-hover:translate-x-full ease">
                            I'm Ready ✨
                        </span>
                        <span className="relative invisible">I'm Ready ✨</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ScrollPage;