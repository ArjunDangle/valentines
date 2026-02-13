
# 💌 Interactive Valentine's Love Letter

A 4-chapter interactive digital love letter that guides the recipient through an emotional journey — from mystery to playfulness to nostalgia to the grand question.

---

## Chapter 1: The Anticipation (`/`)
- **Full-screen, minimal landing** — dark/intimate atmosphere with a single focal point
- A beautifully animated **envelope/gift placeholder** centered on screen, gently pulsing to invite interaction
- On click, the envelope "opens" with a satisfying animation, revealing a short teaser message before transitioning to Chapter 2
- Sets the tone: quiet, personal, like receiving a handwritten note

## Chapter 2: The Inside Joke (`/quiz`)
- **Sleek, one-question-at-a-time interface** — 3 intimate placeholder questions presented sequentially
- Each correct answer triggers a satisfying "approved" micro-animation before sliding to the next
- Wrong answers get a gentle, playful rejection (shake + hint)
- After all 3 correct: a dramatic **"Access Granted"** unlock animation with a pause for emotional impact, then flows into Chapter 3
- Questions are placeholder text, easily swappable in a single config object

## Chapter 3: The Pieces Coming Together (`/memories`)
- **Phase 1 — Heart Puzzle:** A CSS Grid arranged in a heart shape containing a card-matching game (6-8 pairs)
  - Cards flip to reveal matching icons/emojis
  - Locked screen — no scrolling, full focus on the game
- **Phase 2 — Memory Timeline:** Once the puzzle is solved, the heart dissolves and the page transforms into a freely scrollable editorial timeline
  - 6-8 memory placeholders with image slots and caption areas
  - Cinematic pacing with staggered fade-in animations as you scroll
  - At the bottom, a soft glowing prompt leads to the finale

## Chapter 4: The Inevitable (`/ask`)
- **Full-screen, locked layout** with the big question: *"Will you be my Valentine?"*
- A large **YES** button and a small **NO** button
- Hovering over NO causes it to dodge/move away while YES grows larger and more dominant on screen
- Each dodge attempt is counted and displayed playfully ("Nice try #3...")
- Clicking YES triggers a celebratory explosion of hearts/confetti and a sweet closing message

---

## Technical Notes
- Framer Motion will be added for page transitions (`AnimatePresence`) and all micro-animations
- All quiz answers, memory captions, and text are stored in simple config objects for easy personalization
- Fully responsive — works beautifully on mobile (important since she'll likely open it on her phone!)
- No backend needed — entirely client-side
