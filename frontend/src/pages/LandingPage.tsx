import { FeatureSection } from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import { TemplateSection } from "@/components/TemplateSection";
import { useEffect } from "react";

export default function LandingPage() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    return (
        <main className="overflow-x-hidden">
            <HeroSection />
            <FeatureSection />
            <TemplateSection />
        </main>
    )
}