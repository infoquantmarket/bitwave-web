import HeroSection from "@/components/home/HeroSection"
import TrustBar from "@/components/home/TrustBar"
import HowItWorks from "@/components/home/HowItWorks"
import WhoWeServe from "@/components/home/WhoWeServe"
import LocationsSection from "@/components/home/LocationsSection"
import BlogCarousel from "@/components/home/BlogCarousel"
import ComplianceSection from "@/components/home/ComplianceSection"
import FaqSection from "@/components/home/FaqSection"
import ContactSection from "@/components/home/ContactSection"
import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton"
import { getLocale } from "next-intl/server"

export default async function HomePage() {
  const locale = await getLocale()
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <WhoWeServe />
      <LocationsSection />
      <BlogCarousel locale={locale} />
      <ComplianceSection />
      <FaqSection />
      <ContactSection />
      <WhatsAppFloatButton />
    </main>
  )
}
