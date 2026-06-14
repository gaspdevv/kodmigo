import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import LessonPreview from "@/components/LessonPreview";
import WaitlistSection from "@/components/WaitlistSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <LessonPreview />
      <WaitlistSection />
      <Footer />
    </>
  );
}
