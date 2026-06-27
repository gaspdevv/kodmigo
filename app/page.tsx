import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import LandingAuthRedirect from "@/components/landing/LandingAuthRedirect";
import LessonPreview from "@/components/LessonPreview";
import WaitlistSection from "@/components/WaitlistSection";

export default function Home() {
  return (
    <>
      <LandingAuthRedirect />
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <LessonPreview />
      <WaitlistSection />
      <Footer />
    </>
  );
}
