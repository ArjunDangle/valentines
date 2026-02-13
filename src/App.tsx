import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Anticipation from "./pages/Anticipation";
import Quiz from "./pages/Quiz";
import Memories from "./pages/Memories";
import Ask from "./pages/Ask";
import NotFound from "./pages/NotFound";
import Letter from "./pages/Letter";
import ScrollPage from "./pages/Scroll-Page"; // New Import

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Anticipation />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/letter" element={<Letter />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/scroll-page" element={<ScrollPage />} /> {/* New Route */}
        <Route path="/ask" element={<Ask />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;