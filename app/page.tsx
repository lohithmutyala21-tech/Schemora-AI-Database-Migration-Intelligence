import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { Architecture } from "@/components/landing/architecture"
import { CTA } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <Architecture />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
