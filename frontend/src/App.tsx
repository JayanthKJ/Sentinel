import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import { useNavActiveSection } from "./hooks/useNavActiveSection";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/sections/HeroSection";
import { ProblemSection } from "./components/sections/ProblemSection";
import { AIGeneratorSection } from "./components/sections/AIGeneratorSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { LiveDashboardSection } from "./components/sections/LiveDashboardSection";
import { DigitalTwinSection } from "./components/sections/DigitalTwinSection";
import { VoiceAssistantSection } from "./components/sections/VoiceAssistantSection";
import { SimulationSection } from "./components/sections/SimulationSection";
import { TeamSection } from "./components/sections/TeamSection";
import { ContactSection } from "./components/sections/ContactSection";

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
        <Navbar active={active} />
        <main className="pb-[4.5rem] md:pb-0 md:pr-[7.5rem] lg:pr-[8.5rem]">
          <HeroSection />
          <ProblemSection />
          <AIGeneratorSection />
          <FeaturesSection />
          <LiveDashboardSection />
          <DigitalTwinSection />
          <VoiceAssistantSection />
          <SimulationSection />
          <TeamSection />
          <ContactSection />
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
