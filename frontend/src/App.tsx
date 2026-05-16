import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import { useNavActiveSection } from "./hooks/useNavActiveSection";
import { HeroSection } from "./components/sections/HeroSection";
import { ProblemSection } from "./components/sections/ProblemSection";
import { AIGeneratorSection } from "./components/sections/AIGeneratorSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { LiveDashboardSection } from "./components/sections/LiveDashboardSection";
import { DigitalTwinSection } from "./components/sections/DigitalTwinSection";
// import { VoiceAssistantSection } from "./components/sections/VoiceAssistantSection";
import { OutputSection } from "./components/sections/OutputSection";
import { TeamSection } from "./components/sections/TeamSection";
import { ContactSection } from "./components/sections/ContactSection";
import { ScrollToHomeButton } from "./components/ScrollToHomeButton";
import { FloatingAIBot } from "./components/FloatingAIBot";

export default function App() {
  useLenis();
  const active = useNavActiveSection();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-bg-primary text-surface"
      >
        <main>
          <HeroSection activeSection={active} />
          <ProblemSection />
          <AIGeneratorSection />
          <FeaturesSection />
          <LiveDashboardSection />
          <DigitalTwinSection />
          {/* <VoiceAssistantSection /> */}
          <OutputSection />
          <TeamSection />
          <ContactSection />
        </main>
        <FloatingAIBot />
        <ScrollToHomeButton />
      </motion.div>
    </AnimatePresence>
  );
}
