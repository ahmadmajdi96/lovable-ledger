import Navigation from "@/components/showcase/Navigation";
import HeroSection from "@/components/showcase/HeroSection";
import SystemArchitecture from "@/components/showcase/SystemArchitecture";
import ModuleShowcase from "@/components/showcase/ModuleShowcase";
import BenefitsSection from "@/components/showcase/BenefitsSection";
import IndustryStandards from "@/components/showcase/IndustryStandards";
import Footer from "@/components/showcase/Footer";

const Landing = () => (
  <div className="pp-dark min-h-screen text-foreground">
    <Navigation />
    <HeroSection />
    <SystemArchitecture />
    <ModuleShowcase />
    <BenefitsSection />
    <IndustryStandards />
    <Footer />
  </div>
);

export default Landing;
