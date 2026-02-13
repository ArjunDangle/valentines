// ============================================
// 💌 PERSONALIZATION CONFIG
// Edit these values to customize your love letter!
// ============================================

export const quizConfig = {
  questions: [
    {
      question: "Where did we have our first date?",
      options: ["The coffee shop downtown", "That Italian place", "The park by the river", "The rooftop bar"],
      correctIndex: 1,
      hint: "Think pasta and candlelight... 🍝",
    },
    {
      question: "What song were we listening to on our road trip?",
      options: ["Golden Hour", "Lover", "Perfect", "At Last"],
      correctIndex: 0,
      hint: "It was golden, just like us ✨",
    },
    {
      question: "What do I always steal from your plate?",
      options: ["Your dessert", "Your fries", "Your pizza crust", "Everything"],
      correctIndex: 1,
      hint: "Salty and irresistible, just like me 🍟",
    },
  ],
};

export const memoriesConfig = {
  matchPairs: [
    { id: "heart", emoji: "❤️" },
    { id: "star", emoji: "⭐" },
    { id: "moon", emoji: "🌙" },
    { id: "flower", emoji: "🌸" },
    { id: "kiss", emoji: "💋" },
    { id: "sparkle", emoji: "✨" },
  ],
  timeline: [
    {
      date: "The Beginning",
      caption: "The day everything changed. One look and I knew.",
      imageUrl: "/placeholder.svg",
    },
    {
      date: "First Adventure",
      caption: "We got lost and found something better — each other.",
      imageUrl: "/placeholder.svg",
    },
    {
      date: "That Silly Moment",
      caption: "You laughed so hard you cried. I fell even harder.",
      imageUrl: "/placeholder.svg",
    },
    {
      date: "Our Secret Place",
      caption: "The spot that became ours. No one else knows.",
      imageUrl: "/placeholder.svg",
    },
    {
      date: "The Late Night Talk",
      caption: "3 AM and still talking. Time doesn't exist with you.",
      imageUrl: "/placeholder.svg",
    },
    {
      date: "Right Now",
      caption: "Every moment with you is my favorite memory.",
      imageUrl: "/placeholder.svg",
    },
  ],
};

export const askConfig = {
  question: "Will you be my Valentine?",
  yesMessage: "I knew you'd say yes! 💕 You just made me the happiest person alive.",
  dodgeMessages: [
    "Nice try... 😏",
    "You can't escape love!",
    "The button is scared of you 😂",
    "Almost got it!",
    "It's faster than you think!",
    "Give up yet? 💕",
  ],
};
