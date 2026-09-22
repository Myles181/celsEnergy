import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sun,
  Home,
  Building2,
  Battery,
  Wrench,
  Zap,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  Quote,
  Star,
  ChevronRight,
  ArrowUpRight,
  Calculator,
  Plus,
  Minus,
  Trash2,
  PhoneCall,
  MessageSquare,
  Moon,
  AlertTriangle,
  PlayCircle,
  StopCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import logoImage from "@/assets/cels-logo.jpg";
import heroImage from "@/assets/solar-hero.jpg";
import packageHome from "@/assets/package-home.jpg";
import packageBusiness from "@/assets/package-business.jpg";
import packagePremium from "@/assets/package-premium.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "CELS Energy Limited | Solar Power Solutions in Nigeria",
      },
      {
        name: "description",
        content:
          "Get reliable solar panel installation, maintenance, and battery storage for homes and businesses in Nigeria. Request a free quote from CELS Energy Limited.",
      },
      {
        property: "og:title",
        content: "CELS Energy Limited | Solar Power Solutions in Nigeria",
      },
      {
        property: "og:description",
        content:
          "Reliable solar power for homes and businesses in Nigeria. Free quotes on installation, maintenance, and battery storage.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: Index,
});

const GOOGLE_MAPS_LISTING =
  "https://maps.app.goo.gl/bGCFpnN2fzTSeDKz7";
// Write-review: same listing URL — Google Maps shows "Write a review" prominently on the page.
// To get a direct review dialog link, go to Google Business Profile → Get more reviews → copy the link.
const GOOGLE_MAPS_WRITE_REVIEW = GOOGLE_MAPS_LISTING;

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Calculator", href: "#calculator" },
  { label: "Packages", href: "#packages" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
  { label: "Quote", href: "#quote" },
];

function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteContext, setQuoteContext] = useState<{
    package: string;
    items: LoadItem[] | null;
    rec: SolarRec | null;
  }>({ package: "5 kVA Family Backup", items: null, rec: null });

  const scrollToQuote = () =>
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });

  const handlePackageClick = (pkgTitle: string) => {
    setQuoteContext((prev) => ({ ...prev, package: pkgTitle }));
    scrollToQuote();
  };

  const handleCalculatorSelect = (
    pkg: string,
    items: LoadItem[],
    rec: SolarRec
  ) => {
    setQuoteContext({ package: pkg, items, rec });
    scrollToQuote();
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-16 md:pb-0">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3 py-1.5 min-h-[44px]">
            <div className="bg-white shadow-sm border border-emerald-100/80 rounded-xl px-2.5 py-1 flex items-center justify-center">
              <img
                src={logoImage}
                alt="CELS Energy Limited logo"
                className="h-11 w-auto object-contain"
                width="120"
                height="44"
              />
            </div>
            <span className="hidden text-lg font-bold leading-tight text-foreground sm:inline-block">
              CELS Energy
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-brand-green min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="bg-brand-green text-white hover:bg-brand-green/90 h-11 px-6">
              <a href="#quote">Free Quote</a>
            </Button>
          </nav>

          <button
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background/98 md:hidden">
            <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium text-foreground/90 hover:bg-brand-green-light hover:text-brand-green transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3">
                <Button asChild className="w-full bg-brand-green text-white hover:bg-brand-green/90 h-12 text-base font-semibold">
                  <a href="#quote" onClick={() => setMobileMenuOpen(false)}>
                    Free Quote
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Solar panels installed on a home roof in Lagos"
              className="h-full w-full object-cover"
              width={1344}
              height={896}
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-900/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sun className="h-4 w-4 text-brand-gold" />
                <span>Serving homes & businesses across Nigeria</span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Serving Nigeria for almost a decade
              </h1>
              <p className="mt-4 font-medium italic text-brand-gold text-lg sm:text-xl">
                "Power dey go, peace of mind no dey go."
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
                Done with epileptic NEPA supply and noisy generators? CELS Energy installs
                silent hybrid solar systems that keep your home or business running — quietly,
                without fuel, and without the bill shock.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90 h-12 px-6 text-base font-semibold"
                >
                  <a href="#quote">
                    Get a free quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white h-12 px-6 text-base"
                >
                  <a href="#calculator">Try our free calculator</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />
                  <span>Free site survey</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />
                  <span>Silent, generator-free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />
                  <span>After-install support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-border/60 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "500+", label: "Installations completed" },
                { value: "10MW+", label: "Solar capacity deployed" },
                { value: "24/7", label: "Support available" },
                { value: "5+ years", label: "Serving Southwest Nigeria" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-bold text-brand-green">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                What we do
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Solar solutions for every need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From home rooftops to commercial estates, we design, install, and maintain systems
                that keep your power running.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  icon: Home,
                  title: "Solar For Home",
                  description: "Rooftop systems sized for families and budgets.",
                },
                {
                  icon: Building2,
                  title: "Solar For Business",
                  description: "Scalable power for offices, shops, and factories.",
                },
                {
                  icon: Battery,
                  title: "Battery Storage",
                  description: "Store excess energy for night time and outages.",
                },
                {
                  icon: Zap,
                  title: "Solar Inverter",
                  description: "Efficient inverters that convert sun to usable power.",
                },
                {
                  icon: Sun,
                  title: "Solar Panels",
                  description: "High-efficiency panels built for local weather.",
                },
              ].map((service) => (
                <Card
                  key={service.title}
                  className="group border-border/60 bg-white transition-all hover:shadow-lg"
                >
                  <CardContent className="flex flex-col p-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-light text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">{service.title}</h3>
                    <p className="mt-2 flex-grow text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <a
                      href="#quote"
                      className="mt-4 inline-flex items-center text-sm font-semibold text-brand-green hover:underline min-h-[44px]"
                    >
                      See Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solar Load Calculator Section */}
        <section id="calculator" className="bg-gradient-to-b from-white to-brand-green-light/20 py-20 sm:py-28 border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-green">
                <Calculator className="h-3.5 w-3.5" />
                Interactive Estimator
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Calculate Your Solar Power Need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Select your home appliances to instantly estimate your peak power load and see the recommended solar package.
              </p>
              <p className="mt-2 text-sm text-muted-foreground/80">
                Unlike basic inverters that overload and shutdown, a properly sized hybrid system handles your real load — day and night.
              </p>
            </div>

            {/* 3-step visual guide */}
            <div className="mx-auto mt-10 flex max-w-sm items-center justify-center sm:max-w-md">
              {(["Add appliances", "Calculate", "Get your quote"] as const).map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                      i === 0 ? "bg-brand-green" : i === 1 ? "bg-brand-blue" : "bg-brand-gold"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-center text-[11px] font-semibold text-muted-foreground whitespace-nowrap">{label}</span>
                  </div>
                  {i < 2 && <div className="mb-5 mx-3 h-px w-8 shrink-0 bg-border/50 sm:mx-5 sm:w-14" />}
                </div>
              ))}
            </div>

            <SolarLoadCalculator onSelectPackage={handleCalculatorSelect} />
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="bg-brand-green-light/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                Choose your plan
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Solar Packages
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you need a small backup setup or a complete power upgrade, our packages are
                designed to match your needs and budget.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {[
                {
                  image: packageHome,
                  title: "3.5 kVA Home Starter",
                  subtitle: "Perfect for apartments & small homes",
                  price: "₦1,850,000",
                  features: [
                    "3.5 kVA hybrid inverter",
                    "4 x 450W mono panels",
                    "2 x 200Ah batteries",
                    "Lights, fans, TV & fridge",
                    "1-year installation warranty",
                  ],
                  popular: false,
                },
                {
                  image: packageBusiness,
                  title: "5 kVA Family Backup",
                  subtitle: "Reliable power for medium homes",
                  price: "₦2,950,000",
                  features: [
                    "5 kVA hybrid inverter",
                    "8 x 450W mono panels",
                    "4 x 200Ah batteries",
                    "AC, freezer, pumps & more",
                    "2-year installation warranty",
                  ],
                  popular: true,
                },
                {
                  image: packagePremium,
                  title: "10 kVA Commercial Kit",
                  subtitle: "For offices, shops & estates",
                  price: "Custom quote",
                  features: [
                    "10 kVA three-phase inverter",
                    "16+ x 450W mono panels",
                    "Lithium or tubular battery bank",
                    "Full load support design",
                    "3-year maintenance plan",
                  ],
                  popular: false,
                },
              ].map((pkg) => (
                <Card
                  key={pkg.title}
                  className={cn(
                    "group overflow-hidden border-border/60 bg-white transition-all hover:shadow-xl flex flex-col justify-between",
                    pkg.popular && "ring-2 ring-brand-green shadow-md",
                    quoteContext.package === pkg.title && "ring-2 ring-brand-gold"
                  )}
                >
                  <div>
                    {pkg.popular && (
                      <div className="bg-brand-green px-4 py-1.5 text-center text-xs font-semibold text-white">
                        Most Popular
                      </div>
                    )}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={1024}
                        height={768}
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground">{pkg.title}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
                      <p className="mt-4 text-2xl font-bold text-brand-green">{pkg.price}</p>
                      <ul className="mt-4 space-y-2">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                  <div className="p-6 pt-0">
                    <Button
                      onClick={() => handlePackageClick(pkg.title)}
                      className={cn(
                        "w-full h-12 text-base font-semibold transition-all",
                        quoteContext.package === pkg.title
                          ? "bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
                          : "bg-brand-green text-white hover:bg-brand-green/90"
                      )}
                    >
                      {quoteContext.package === pkg.title ? "Selected — Request Quote ↓" : "Request this package"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                Customer Reviews
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Real stories from homes and businesses across Nigeria that made the switch to solar.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Chinedu Obi",
                  role: "Homeowner, Lekki",
                  text: "Since CELS installed our 5kVA system, generator noise is history. My family sleeps better and our monthly power costs dropped significantly.",
                  rating: 5,
                },
                {
                  name: "Adaobi Nwosu",
                  role: "Boutique Owner, Ikeja",
                  text: "My shop now runs on solar during the day. No more fuel trips and my customers enjoy uninterrupted air conditioning. Best business decision this year.",
                  rating: 5,
                },
                {
                  name: "Emeka Udo",
                  role: "Estate Manager, Victoria Island",
                  text: "CELS handled the full estate installation professionally. Their team was punctual, tidy, and the system has been running smoothly for over a year.",
                  rating: 5,
                },
              ].map((review) => (
                <Card key={review.name} className="border-border/60 bg-white">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-brand-gold" />
                    <p className="mt-4 text-foreground">{review.text}</p>
                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* See more reviews CTA */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href={GOOGLE_MAPS_LISTING}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-brand-green/30 bg-white px-6 py-3 text-sm font-semibold text-brand-green shadow-sm transition-colors hover:bg-brand-green-light"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                See all reviews on Google
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={GOOGLE_MAPS_WRITE_REVIEW}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline-offset-2 hover:text-brand-green hover:underline transition-colors"
              >
                Happy with us? Leave a review →
              </a>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section id="about" className="bg-brand-green-light/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                  Why CELS Energy
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Local expertise, quality equipment, honest pricing
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  We are not just installers — we are your long-term power partner. Our team
                  designs systems that match your actual energy needs and local conditions.
                </p>

                <div className="mt-8 grid gap-5">
                  {[
                    {
                      icon: Zap,
                      title: "Custom system design",
                      description: "Every installation is sized from your energy usage and roof space.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Certified products",
                      description: "We use tested panels, inverters, and batteries built to last.",
                    },
                    {
                      icon: Phone,
                      title: "Responsive local support",
                      description: "Our Lagos-based team is reachable before, during, and after installation.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-gold/20 text-brand-gold">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-brand-green/5" />
                <div className="relative space-y-4 rounded-2xl border border-border/60 bg-white p-6 shadow-xl sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-white">
                      <Sun className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-foreground">Typical home savings</p>
                  </div>
                  <p className="text-5xl font-extrabold text-brand-green">Up to 70%</p>
                  <p className="text-muted-foreground">
                    Many CELS customers reduce their monthly energy spend after switching to solar.
                    Results depend on usage and system size.
                  </p>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    <span>No hidden charges on quotes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    <span>Flexible payment plans available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote form */}
        <section id="quote" className="bg-brand-green py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
                  Start your solar journey
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Get your free solar quote today
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Tell us a little about your property and energy needs. We will assess your site
                  and send a tailored recommendation — no obligation, no hidden fees.
                </p>

                <div className="mt-8 space-y-4">
                  <a href="tel:+2349066500304" className="flex items-start gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Call us directly</p>
                      <p className="text-white/80 text-sm">+234 906 650 0304</p>
                    </div>
                  </a>
                  <a href="mailto:info@celsenergy.com" className="flex items-start gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Email us</p>
                      <p className="text-white/80 text-sm">info@celsenergy.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 p-2">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-gold">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Visit our office</p>
                      <p className="text-white/80 text-sm">Lagos, Lagos State, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 text-foreground shadow-2xl sm:p-8">
                <h3 className="text-xl font-semibold">Request a free quote</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in your details and we'll send your full estimate directly to CELS Energy on WhatsApp.
                </p>
                <QuoteForm quoteContext={quoteContext} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Floating Quick Contact Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-white p-3 shadow-lg md:hidden">
        <a
          href="tel:+2349066500304"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 font-semibold text-gray-800 hover:bg-gray-200 transition-colors mr-2"
        >
          <PhoneCall className="h-4 w-4 text-brand-green" />
          <span>Call Us</span>
        </a>
        <a
          href="#quote"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green font-semibold text-white hover:bg-brand-green/90 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Get Quote</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="inline-block bg-white shadow-sm border border-emerald-100/80 rounded-xl px-3 py-1.5">
                <img
                  src={logoImage}
                  alt="CELS Energy Limited logo"
                  className="h-14 w-auto object-contain"
                  width="140"
                  height="56"
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Reliable solar power solutions for homes and businesses in Nigeria and across
                Southwest Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Quick links</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-brand-green min-h-[36px] inline-flex items-center">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Services</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Residential Solar</li>
                <li>Commercial Solar</li>
                <li>Battery Storage</li>
                <li>Solar Maintenance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-green shrink-0" />
                  Lagos, Lagos State, Nigeria
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-green shrink-0" />
                  info@celsenergy.com
                </li>
                <li className="flex items-center gap-2">
                  <a href="tel:+2349066500304" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                    <Phone className="h-4 w-4 text-brand-green shrink-0" />
                    +234 906 650 0304
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CELS Energy Limited. All rights reserved.</p>
            <p className="mt-2">
              Site built by{" "}
              <a
                href="https://wa.me/2347048568350"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-green hover:underline"
              >
                Myles
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Google review badge — desktop only (mobile has smaller screen) */}
      <a
        href={GOOGLE_MAPS_WRITE_REVIEW}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Leave a review on Google Maps"
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <div className="flex flex-col items-center leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Google</span>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <span className="text-xs font-semibold text-foreground">Rate us</span>
      </a>
    </div>
  );
}

interface LoadItem {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
}

const PRESET_APPLIANCES: Array<{ name: string; watts: number }> = [
  { name: "Refrigerator", watts: 150 },
  { name: "Freezer", watts: 200 },
  { name: "Ceiling Fan", watts: 75 },
  { name: "Standing Fan", watts: 50 },
  { name: 'LED TV (32")', watts: 50 },
  { name: 'LED TV (55")', watts: 120 },
  { name: "LED Bulb", watts: 10 },
  { name: "Air Conditioner (1 HP)", watts: 750 },
  { name: "Air Conditioner (1.5 HP)", watts: 1100 },
  { name: "Water Pump (0.5 HP)", watts: 375 },
  { name: "Water Pump (1 HP)", watts: 750 },
  { name: "Microwave", watts: 1000 },
  { name: "Laptop", watts: 65 },
  { name: "Phone Charger", watts: 10 },
  { name: "Washing Machine", watts: 500 },
  { name: "Electric Iron", watts: 1000 },
  { name: "Electric Kettle", watts: 1500 },
  { name: "DSTV Decoder", watts: 20 },
  { name: "Blender", watts: 300 },
  { name: "Printer", watts: 50 },
  { name: "Security Lights", watts: 30 },
  { name: "CCTV System", watts: 40 },
];

const DEFAULT_LOAD_ITEMS: LoadItem[] = [
  { id: "d1", name: "LED Bulb", watts: 10, quantity: 8, hoursPerDay: 8 },
  { id: "d2", name: "Ceiling Fan", watts: 75, quantity: 2, hoursPerDay: 12 },
  { id: "d3", name: 'LED TV (32")', watts: 50, quantity: 1, hoursPerDay: 6 },
  { id: "d4", name: "Refrigerator", watts: 150, quantity: 1, hoursPerDay: 24 },
];

// ---------- CELS Energy product catalog ----------
const HYBRID_INVERTERS = [
  { model: "Hybrid Inverter 1.2kVA 12V", kva: 1.2, voltage: 12, maxWatts: 960   },
  { model: "Hybrid Inverter 1.8kVA 12V", kva: 1.8, voltage: 12, maxWatts: 1440  },
  { model: "Hybrid Inverter 2kVA 12V",   kva: 2,   voltage: 12, maxWatts: 1600  },
  { model: "Hybrid Inverter 3kVA 24V",   kva: 3,   voltage: 24, maxWatts: 2400  },
  { model: "Hybrid Inverter 3.5kVA 24V", kva: 3.5, voltage: 24, maxWatts: 2800  },
  { model: "Hybrid Inverter 4kVA 24V",   kva: 4,   voltage: 24, maxWatts: 3200  },
  { model: "Hybrid Inverter 5kVA 48V",   kva: 5,   voltage: 48, maxWatts: 4000  },
  { model: "Hybrid Inverter 6kVA 48V",   kva: 6,   voltage: 48, maxWatts: 4800  },
  { model: "Hybrid Inverter 8kVA 48V",   kva: 8,   voltage: 48, maxWatts: 6400  },
  { model: "Hybrid Inverter 10kVA 48V",  kva: 10,  voltage: 48, maxWatts: 8000  },
  { model: "Hybrid Inverter 12kVA 48V",  kva: 12,  voltage: 48, maxWatts: 9600  },
  { model: "Hybrid Inverter 20kVA 48V",  kva: 20,  voltage: 48, maxWatts: 16000 },
];

const LITHIUM_BATTERIES = [
  { model: "Lithium Battery 1.3kWh 12V",  kwh: 1.3,  voltage: 12 },
  { model: "Lithium Battery 2.5kWh 12V",  kwh: 2.5,  voltage: 12 },
  { model: "Lithium Battery 3kWh 12V",    kwh: 3,    voltage: 12 },
  { model: "Lithium Battery 3.8kWh 12V",  kwh: 3.8,  voltage: 12 },
  { model: "Lithium Battery 4kWh 12V",    kwh: 4,    voltage: 12 },
  { model: "Lithium Battery 2.5kWh 24V",  kwh: 2.5,  voltage: 24 },
  { model: "Lithium Battery 3kWh 24V",    kwh: 3,    voltage: 24 },
  { model: "Lithium Battery 3.8kWh 24V",  kwh: 3.8,  voltage: 24 },
  { model: "Lithium Battery 5kWh 24V",    kwh: 5,    voltage: 24 },
  { model: "Lithium Battery 7.5kWh 24V",  kwh: 7.5,  voltage: 24 },
  { model: "Lithium Battery 8kWh 24V",    kwh: 8,    voltage: 24 },
  { model: "Lithium Battery 5kWh 48V",    kwh: 5,    voltage: 48 },
  { model: "Lithium Battery 10kWh 48V",   kwh: 10,   voltage: 48 },
  { model: "Lithium Battery 15kWh 48V",   kwh: 15,   voltage: 48 },
  { model: "Lithium Battery 17.5kWh 48V", kwh: 17.5, voltage: 48 },
  { model: "Lithium Battery 20kWh 48V",   kwh: 20,   voltage: 48 },
  { model: "Lithium Battery 25kWh 48V",   kwh: 25,   voltage: 48 },
];

const DEFAULT_PANEL_WATTS = 450;
// --------------------------------------------------

type SolarRec = {
  peakLoadKw: number;
  dailyKwh: number;
  inverterModel: string;
  inverterKva: number;
  inverterVoltage: number;
  inverterQty: number;
  panelWatts: number;
  panelCount: number;
  batteryModel: string;
  batteryKwh: number;
  batteryCount: number;
  totalBatteryKwh: number;
  suggestedPackage: string;
};

function computeRecommendations(items: LoadItem[]): {
  economy: SolarRec;
  standard: SolarRec;
  premium: SolarRec;
} | null {
  const active = items.filter((it) => it.quantity > 0);
  if (active.length === 0) return null;

  const peakLoadW = active.reduce((s, it) => s + it.watts * it.quantity, 0);
  const dailyWh   = active.reduce((s, it) => s + it.watts * it.quantity * it.hoursPerDay, 0);
  const energyWithLosses = dailyWh * 1.3;
  const inverterNeededW  = (peakLoadW / 0.8) * 1.25;
  const baseNeededKwh    = energyWithLosses / (1000 * 0.85);
  const basePanels       = Math.max(1, Math.ceil(energyWithLosses / (5 * DEFAULT_PANEL_WATTS * 0.85)));

  const minIdx   = HYBRID_INVERTERS.findIndex((inv) => inv.maxWatts >= inverterNeededW);
  const safeMin  = minIdx === -1 ? HYBRID_INVERTERS.length - 1 : minIdx;
  const biggest  = HYBRID_INVERTERS[HYBRID_INVERTERS.length - 1]!;

  const buildTier = (invIdx: number, batMultiplier: number, extraPanels: number): SolarRec => {
    const inv        = HYBRID_INVERTERS[Math.min(invIdx, HYBRID_INVERTERS.length - 1)]!;
    const inverterQty = inv.maxWatts >= inverterNeededW ? 1 : Math.ceil(inverterNeededW / biggest.maxWatts);
    const compatBats  = LITHIUM_BATTERIES.filter((b) => b.voltage === inv.voltage);
    const largestBat  = compatBats[compatBats.length - 1]!;
    const batteryCount     = Math.max(1, Math.ceil((baseNeededKwh * batMultiplier) / largestBat.kwh));
    const totalBatteryKwh  = batteryCount * largestBat.kwh;
    const panelCount       = basePanels + extraPanels;
    const totalKva         = inv.kva * inverterQty;
    return {
      peakLoadKw: peakLoadW / 1000,
      dailyKwh:   dailyWh / 1000,
      inverterModel:   inv.model,
      inverterKva:     inv.kva,
      inverterVoltage: inv.voltage,
      inverterQty,
      panelWatts:      DEFAULT_PANEL_WATTS,
      panelCount,
      batteryModel:    largestBat.model,
      batteryKwh:      largestBat.kwh,
      batteryCount,
      totalBatteryKwh,
      suggestedPackage:
        totalKva <= 3.5 ? "3.5 kVA Home Starter" :
        totalKva <= 5   ? "5 kVA Family Backup" :
                          "10 kVA Commercial Kit",
    };
  };

  return {
    economy:  buildTier(safeMin,     1.0, 0),
    standard: buildTier(safeMin + 1, 1.5, 2),
    premium:  buildTier(safeMin + 2, 2.0, 4),
  };
}

// ---------- Power management guide ----------
const ALWAYS_ON_KEYWORDS = ["refrigerator", "fridge", "freezer", "modem", "router", "cctv", "security"];
const HIGH_DRAW_W = 500;

function classifyItem(item: LoadItem): "essential" | "solar_peak" | "flexible" {
  const n = item.name.toLowerCase();
  if (item.hoursPerDay >= 20 || ALWAYS_ON_KEYWORDS.some((k) => n.includes(k))) return "essential";
  if (item.watts >= HIGH_DRAW_W) return "solar_peak";
  return "flexible";
}

type PowerGuide = {
  essential: { name: string; watts: number; qty: number }[];
  solarPeak: { name: string; watts: number; qty: number }[];
  flexible:  { name: string; watts: number; qty: number }[];
  batteryHours: number;
  warnings: string[];
};

function generatePowerGuide(
  items: LoadItem[],
  rec: SolarRec
): PowerGuide {
  const active = items.filter((it) => it.quantity > 0);
  const essential: PowerGuide["essential"] = [];
  const solarPeak: PowerGuide["solarPeak"] = [];
  const flexible:  PowerGuide["flexible"]  = [];

  for (const it of active) {
    const cat = classifyItem(it);
    const entry = { name: it.name, watts: it.watts, qty: it.quantity };
    if (cat === "essential") essential.push(entry);
    else if (cat === "solar_peak") solarPeak.push(entry);
    else flexible.push(entry);
  }

  const inverterCapacityW = rec.inverterKva * rec.inverterQty * 1000 * 0.8;
  const essentialLoadW = essential.reduce((s, it) => s + it.watts * it.qty, 0);

  // Battery duration on essential loads only
  const batteryHours = essentialLoadW > 0
    ? Math.min(99, Math.round((rec.totalBatteryKwh * 1000 * 0.85) / essentialLoadW * 10) / 10)
    : 0;

  // Flag pairs of high-draw items that together exceed inverter headroom
  const warnings: string[] = [];
  for (let i = 0; i < solarPeak.length; i++) {
    for (let j = i + 1; j < solarPeak.length; j++) {
      const a = solarPeak[i]!;
      const b = solarPeak[j]!;
      const combinedW = essentialLoadW + a.watts * a.qty + b.watts * b.qty;
      if (combinedW > inverterCapacityW) {
        warnings.push(
          `Avoid running ${a.name} and ${b.name} simultaneously — combined draw (${combinedW.toLocaleString()}W) exceeds inverter headroom.`
        );
      }
    }
  }

  return { essential, solarPeak, flexible, batteryHours, warnings };
}
// --------------------------------------------

function SolarLoadCalculator({
  onSelectPackage,
}: {
  onSelectPackage: (
    pkg: string,
    items: LoadItem[],
    rec: SolarRec
  ) => void;
}) {
  const [items, setItems] = useState<LoadItem[]>(DEFAULT_LOAD_ITEMS);
  const [showPresets, setShowPresets] = useState(false);

  const addItem = (name: string, watts: number) => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, watts, quantity: 1, hoursPerDay: 8 },
    ]);
    setShowPresets(false);
  };

  const updateItem = <K extends keyof LoadItem>(id: string, field: K, value: LoadItem[K]) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const [mobileTab, setMobileTab] = useState<"appliances" | "results">("appliances");
  const [result, setResult] = useState<{
    economy: SolarRec;
    standard: SolarRec;
    premium: SolarRec;
    guide: PowerGuide;
  } | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [speechWords, setSpeechWords] = useState<string[]>([]);
  const [spokenUpTo, setSpokenUpTo] = useState(-1);
  const [calculating, setCalculating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_STEPS = [
    "Calculating peak load…",
    "Sizing your inverter…",
    "Matching battery capacity…",
    "Finalising recommendation…",
  ];

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setSpeechWords([]);
      setSpokenUpTo(-1);
      return;
    }
    if (!result) return;
    const { economy, standard, premium, guide } = result;
    const text = [
      "Your solar estimate is ready.",
      `Peak load is ${standard.peakLoadKw.toFixed(1)} kilowatts, using ${standard.dailyKwh.toFixed(1)} kilowatt hours per day.`,
      "We have 3 system options.",
      `Economy: ${economy.inverterModel}, ${economy.panelCount} panels, ${economy.batteryCount} batteries totalling ${economy.totalBatteryKwh} kilowatt hours.`,
      `Standard: ${standard.inverterModel}, ${standard.panelCount} panels, ${standard.batteryCount} batteries totalling ${standard.totalBatteryKwh} kilowatt hours.`,
      `Premium: ${premium.inverterModel}, ${premium.panelCount} panels, ${premium.batteryCount} batteries totalling ${premium.totalBatteryKwh} kilowatt hours.`,
      guide.batteryHours > 0 ? `Battery covers essential loads for about ${guide.batteryHours} hours without solar.` : "",
      guide.warnings[0] ?? "",
    ].filter(Boolean).join(" ");

    // Build word list and cumulative start positions for boundary matching
    const words = text.split(/\s+/);
    const wordStarts: number[] = [];
    let pos = 0;
    for (const w of words) { wordStarts.push(pos); pos += w.length + 1; }

    setSpeechWords(words);
    setSpokenUpTo(-1);
    setSpeaking(true);

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.88;
    utt.addEventListener("boundary", (e: SpeechSynthesisEvent) => {
      if (e.name !== "word") return;
      // Find the rightmost word whose start is <= charIndex
      let idx = -1;
      for (let i = 0; i < wordStarts.length; i++) {
        if (wordStarts[i]! <= e.charIndex) idx = i; else break;
      }
      setSpokenUpTo(idx);
    });
    utt.onend = () => { setSpeaking(false); setSpeechWords([]); setSpokenUpTo(-1); };
    utt.onerror = () => { setSpeaking(false); setSpeechWords([]); setSpokenUpTo(-1); };
    window.speechSynthesis.speak(utt);
  };

  const handleCalculate = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    const recs = computeRecommendations(items);
    if (!recs) return;
    setCalculating(true);
    setResult(null);
    setLoadingStep(0);
    let step = 0;
    const iv = setInterval(() => setLoadingStep(++step), 450);
    setTimeout(() => {
      clearInterval(iv);
      setResult({ ...recs, guide: generatePowerGuide(items, recs.standard) });
      setCalculating(false);
      setMobileTab("results");
      requestAnimationFrame(() => {
        document.getElementById("tier-cards")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }, 1800);
  };

  return (
    <div className="mt-12 rounded-2xl border border-border/60 bg-white shadow-xl overflow-hidden">

      {/* Mobile tab switcher */}
      <div className="flex border-b border-border/60 lg:hidden">
        {(["appliances", "results"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${
              mobileTab === tab
                ? "border-b-2 border-brand-green bg-brand-green-light/30 text-brand-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "appliances" ? "My Appliances" : `Results${result ? " ✓" : ""}`}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px]">
        {/* Left: load list */}
        <div className={`p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-border/60 ${mobileTab === "appliances" ? "block" : "hidden lg:block"}`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your appliances</h3>
            {items.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {items.reduce((s, it) => s + it.quantity, 0)} units total
              </span>
            )}
          </div>

          {/* Column headers — desktop only */}
          <div className="mb-2 hidden px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[1fr_72px_96px_96px_32px] sm:gap-x-3">
            <span>Appliance</span>
            <span className="text-center">Watts</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Hrs / day</span>
            <span />
          </div>

          {/* Items list */}
          <div className="space-y-2.5">
            {items.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No appliances yet. Add some below to get your estimate.
              </div>
            )}
            {items.map((item) => {
              const dailyWh = item.watts * item.quantity * item.hoursPerDay;
              const dailyLabel =
                dailyWh >= 1000
                  ? `${(dailyWh / 1000).toFixed(2)} kWh/day`
                  : `${Math.round(dailyWh)} Wh/day`;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-gray-50/50 p-3"
                >
                  {/* Desktop row */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_72px_96px_96px_32px] sm:items-center sm:gap-x-3">
                    <div>
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-input bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">{dailyLabel}</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.watts}
                      onChange={(e) => updateItem(item.id, "watts", Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-lg border border-input bg-white px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-brand-green hover:text-brand-green"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-brand-green hover:text-brand-green"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => updateItem(item.id, "hoursPerDay", Math.max(0.5, item.hoursPerDay - 0.5))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-brand-green hover:text-brand-green"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-foreground">{item.hoursPerDay}h</span>
                      <button
                        onClick={() => updateItem(item.id, "hoursPerDay", Math.min(24, item.hoursPerDay + 0.5))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:border-brand-green hover:text-brand-green"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove appliance"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile layout */}
                  <div className="space-y-2 sm:hidden">
                    <div className="flex items-center gap-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="flex-1 rounded-lg border border-input bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove appliance"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-center text-[10px] font-semibold uppercase text-muted-foreground">Watts</label>
                        <input
                          type="number"
                          min={1}
                          value={item.watts}
                          onChange={(e) => updateItem(item.id, "watts", Math.max(1, Number(e.target.value)))}
                          className="w-full rounded-lg border border-input bg-white px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-center text-[10px] font-semibold uppercase text-muted-foreground">Qty</label>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-brand-green hover:text-brand-green"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-brand-green hover:text-brand-green"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-center text-[10px] font-semibold uppercase text-muted-foreground">Hrs/day</label>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateItem(item.id, "hoursPerDay", Math.max(0.5, item.hoursPerDay - 0.5))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-brand-green hover:text-brand-green"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.hoursPerDay}h</span>
                          <button
                            onClick={() => updateItem(item.id, "hoursPerDay", Math.min(24, item.hoursPerDay + 0.5))}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:border-brand-green hover:text-brand-green"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">{dailyLabel}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add appliance */}
          <div className="mt-4 rounded-xl border border-dashed border-border/70 p-4">
            {showPresets ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Pick an appliance</p>
                  <button
                    onClick={() => setShowPresets(false)}
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_APPLIANCES.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => addItem(p.name, p.watts)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-green hover:bg-brand-green-light hover:text-brand-green"
                    >
                      <Plus className="h-3 w-3" />
                      {p.name}
                      <span className="text-muted-foreground">({p.watts}W)</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 border-t border-border/60 pt-3">
                  <button
                    onClick={() => addItem("Custom appliance", 100)}
                    className="text-sm font-medium text-brand-blue hover:underline"
                  >
                    + Add custom appliance
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPresets(true)}
                  className="w-full border-brand-green/40 text-brand-green hover:bg-brand-green-light sm:w-auto"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add common appliance
                </Button>
                <button
                  onClick={() => addItem("Custom appliance", 100)}
                  className="text-sm text-muted-foreground hover:text-brand-green hover:underline"
                >
                  or add custom
                </button>
              </div>
            )}
          </div>

          {/* Calculate button */}
          {items.length > 0 && (
            <Button
              onClick={handleCalculate}
              disabled={calculating}
              className="mt-4 h-12 w-full bg-brand-green text-base font-semibold text-white hover:bg-brand-green/90 disabled:opacity-60"
            >
              <Calculator className="mr-2 h-5 w-5" />
              {result ? "Recalculate" : "Calculate My Solar System"}
            </Button>
          )}

          {/* Total summary bar */}
          {result && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm">
              <span className="font-medium text-foreground">
                {items.length} appliance{items.length !== 1 ? "s" : ""}
              </span>
              <div className="flex flex-wrap gap-4">
                <span className="text-muted-foreground">
                  Peak: <strong className="text-foreground">{result.standard.peakLoadKw.toFixed(2)} kW</strong>
                </span>
                <span className="text-muted-foreground">
                  Daily: <strong className="text-foreground">{result.standard.dailyKwh.toFixed(2)} kWh</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: stats + power guide panel */}
        <div className={`flex flex-col bg-gradient-to-b from-brand-green-light/30 to-white p-6 sm:p-8 ${mobileTab === "results" ? "block" : "hidden lg:flex"}`}>
          {calculating ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-brand-green/20 border-t-brand-green" />
              <p className="text-sm font-semibold text-foreground">Analysing your system…</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {LOADING_STEPS[loadingStep % LOADING_STEPS.length]}
              </p>
            </div>
          ) : result ? (
            <>
              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-white">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">System estimate</h3>
                </div>
                <button
                  onClick={handleSpeak}
                  title={speaking ? "Stop reading" : "Play summary"}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    speaking
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
                  }`}
                >
                  {speaking
                    ? <><StopCircle className="h-3.5 w-3.5" /> Stop</>
                    : <><PlayCircle className="h-3.5 w-3.5" /> Play</>
                  }
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Peak load</span>
                  <span className="font-semibold text-foreground">{result.standard.peakLoadKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily energy</span>
                  <span className="font-semibold text-foreground">{result.standard.dailyKwh.toFixed(2)} kWh/day</span>
                </div>
              </div>

              {/* Live transcript with word highlighting */}
              {speaking && speechWords.length > 0 && (
                <div className="mt-4 rounded-xl border border-brand-green/30 bg-brand-green/5 p-4 text-sm leading-7">
                  {speechWords.map((word, i) => (
                    <span
                      key={i}
                      className={
                        i <= spokenUpTo
                          ? "rounded bg-brand-green/25 px-0.5 font-semibold text-brand-green"
                          : "text-muted-foreground"
                      }
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              )}

              {/* Power Management Guide */}
              {(result.guide.essential.length + result.guide.solarPeak.length + result.guide.flexible.length > 0) && (
                <>
                  <div className="my-4 h-px bg-border/60" />
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Power management
                  </p>
                  <div className="space-y-3">
                    {result.guide.essential.length > 0 && (
                      <div className="rounded-lg border border-brand-green/20 bg-brand-green/5 p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-brand-green" />
                          <span className="text-xs font-semibold text-brand-green">Always on (essential)</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {result.guide.essential.map((it) => it.qty > 1 ? `${it.qty}× ${it.name}` : it.name).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Run 24/7 — size all other decisions around these.</p>
                        {result.guide.batteryHours > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Battery className="h-3 w-3" />
                            <span>Essentials covered for <span className="font-semibold text-foreground">~{result.guide.batteryHours} hrs</span> without solar</span>
                          </div>
                        )}
                      </div>
                    )}
                    {result.guide.solarPeak.length > 0 && (
                      <div className="rounded-lg border border-brand-gold/20 bg-brand-gold-light/40 p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                          <Sun className="h-3.5 w-3.5 text-brand-gold" />
                          <span className="text-xs font-semibold text-brand-gold">Use during solar hours (10 am – 3 pm)</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {result.guide.solarPeak.map((it) => it.qty > 1 ? `${it.qty}× ${it.name}` : it.name).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Panels power these directly — saves battery for night.</p>
                      </div>
                    )}
                    {result.guide.flexible.length > 0 && (
                      <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                          <Moon className="h-3.5 w-3.5 text-brand-blue" />
                          <span className="text-xs font-semibold text-brand-blue">Evening / battery-friendly</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {result.guide.flexible.map((it) => it.qty > 1 ? `${it.qty}× ${it.name}` : it.name).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Moderate load — safe after sunset on stored energy.</p>
                      </div>
                    )}
                    {result.guide.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                        <p className="text-xs text-destructive">{w}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
                <Calculator className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {items.length > 0 ? "Ready to calculate" : "Add your appliances"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {items.length > 0
                  ? "Click \"Calculate My Solar System\" to see your options."
                  : "Add appliances on the left, then hit Calculate to get your solar recommendation."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3-tier recommendation cards */}
      {result && (
        <div id="tier-cards" className="border-t border-border/60 p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choose your system</p>
              <p className="mt-0.5 text-sm text-muted-foreground">3 options sized to your load — pick what fits your budget</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(
              [
                { key: "economy",  label: "Economy",  desc: "Minimum viable system",         tier: result.economy,  highlight: false },
                { key: "standard", label: "Standard", desc: "Recommended for most homes",    tier: result.standard, highlight: true  },
                { key: "premium",  label: "Premium",  desc: "Future-proof with max backup",  tier: result.premium,  highlight: false },
              ] as const
            ).map(({ key, label, desc, tier, highlight }, cardIdx) => (
              <div
                key={key}
                style={{
                  animation: "fadeSlideUp 0.45s ease forwards",
                  animationDelay: `${cardIdx * 120}ms`,
                  opacity: 0,
                }}
                className={`relative flex flex-col rounded-xl border p-4 ${
                  highlight
                    ? "border-brand-green shadow-md shadow-brand-green/10"
                    : "border-border/60"
                }`}
              >
                {highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-green px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Recommended
                  </span>
                )}
                <div className="mb-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    highlight
                      ? "bg-brand-green/10 text-brand-green"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {label}
                  </span>
                  <p className="mt-1 text-[11px] text-muted-foreground">{desc}</p>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">Inverter</span>
                    <span className="text-right font-medium text-foreground leading-snug">
                      {tier.inverterQty > 1 ? `${tier.inverterQty}× ` : ""}{tier.inverterModel}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">Battery</span>
                    <span className="text-right font-medium text-foreground leading-snug">
                      {tier.batteryCount}× {tier.batteryModel}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Panels</span>
                    <span className="font-medium text-foreground">{tier.panelCount}× {tier.panelWatts}W</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-semibold text-brand-green">{tier.totalBatteryKwh} kWh</span>
                  </div>
                </div>

                <Button
                  onClick={() => onSelectPackage(`${label} — ${tier.suggestedPackage}`, items, tier)}
                  className={`mt-4 h-9 w-full text-sm font-semibold ${
                    highlight
                      ? "bg-brand-green text-white hover:bg-brand-green/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  variant={highlight ? "default" : "outline"}
                >
                  Get a quote
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Based on 5 peak sun hours · 30% system losses · 85% battery usable capacity · Nigeria
          </p>
        </div>
      )}
    </div>
  );
}

const WA_NUMBER = "2349066500304";

function buildWhatsAppMessage(
  fields: { name: string; property: string; location: string; notes: string },
  ctx: { package: string; items: LoadItem[] | null; rec: SolarRec | null }
) {
  const customerName = fields.name || "Customer";
  const tierLabel = ctx.package.split(" — ")[0] ?? ctx.package;

  const contactBlock = [
    `*Name:* ${customerName}`,
    `*Property:* ${fields.property || "Not specified"}`,
    `*Location:* ${fields.location || "Nigeria"}`,
    fields.notes ? `*Notes:* ${fields.notes}` : "",
  ].filter(Boolean).join("\n");

  if (!ctx.items || !ctx.rec) {
    return `Hello CELS Energy Team,

I'm interested in a solar installation and would like to request a quote.

━━━━━━━━━━━━━━━━━━
*CUSTOMER DETAILS*
${contactBlock}
*Package Interest:* ${ctx.package}

Please reach out to discuss options and pricing. Thank you!

_Sent via CELS Energy website_`;
  }

  const { items, rec } = ctx;

  const appLines = items
    .filter((it) => it.quantity > 0)
    .map((it) => {
      const wh = it.watts * it.quantity * it.hoursPerDay;
      const label = wh >= 1000 ? `${(wh / 1000).toFixed(2)} kWh/day` : `${Math.round(wh)} Wh/day`;
      return `  • ${it.quantity}x ${it.name} (${it.watts}W x ${it.hoursPerDay}h = ${label})`;
    })
    .join("\n");

  const inverterLine =
    rec.inverterQty > 1 ? `${rec.inverterQty}x ${rec.inverterModel}` : `1x ${rec.inverterModel}`;
  const totalPanelKwp = ((rec.panelWatts * rec.panelCount) / 1000).toFixed(2);

  const guide = generatePowerGuide(items, rec);
  const powerTipsLines = [
    guide.solarPeak.length > 0
      ? `☀ Run during solar hours (10am-3pm): ${guide.solarPeak.map((it) => it.name).join(", ")}`
      : "",
    guide.flexible.length > 0
      ? `- Safe for evening/battery use: ${guide.flexible.map((it) => it.name).join(", ")}`
      : "",
    guide.batteryHours > 0
      ? `- Battery backup (essentials only): ~${guide.batteryHours} hrs without solar`
      : "",
    ...guide.warnings.map((w) => `⚠ ${w}`),
  ].filter(Boolean).join("\n");

  return `Hello CELS Energy Team,

I used your solar calculator and I'm ready to move forward. Please find my load details and preferred package below.

━━━━━━━━━━━━━━━━━━
*CUSTOMER DETAILS*
${contactBlock}

━━━━━━━━━━━━━━━━━━
🔥*ENERGY LOAD PROFILE*
Peak Load: *${rec.peakLoadKw.toFixed(2)} kW*
Daily Consumption: *${rec.dailyKwh.toFixed(2)} kWh/day*

*Appliances:*
${appLines}

━━━━━━━━━━━━━━━━━━
*SELECTED PACKAGE — ${tierLabel.toUpperCase()}*
• Inverter: ${inverterLine}
• Solar Panels: ${rec.panelCount}x ${rec.panelWatts}W (${totalPanelKwp} kWp total)
• Battery Bank: ${rec.batteryCount}x ${rec.batteryModel} (${rec.totalBatteryKwh} kWh total)
${powerTipsLines ? `\n━━━━━━━━━━━━━━━━━━\n*POWER MANAGEMENT NOTES*\n${powerTipsLines}` : ""}

━━━━━━━━━━━━━━━━━━
Please contact me to discuss pricing, site survey, and installation timeline. Thank you!

_Sent via CELS Energy Solar Calculator_`;
}

function QuoteForm({
  quoteContext,
}: {
  quoteContext: { package: string; items: LoadItem[] | null; rec: SolarRec | null };
}) {
  const [name, setName] = useState("");
  const [property, setProperty] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const hasCalcData = !!quoteContext.items && !!quoteContext.rec;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildWhatsAppMessage({ name, property, location, notes }, quoteContext);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <form onSubmit={handleSend} className="mt-5 space-y-4">
      {/* Package badge */}
      <div className="rounded-xl border border-brand-green/25 bg-brand-green-light/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-green">Selected system</p>
          {!hasCalcData && (
            <a href="#calculator" className="text-xs font-medium text-brand-green hover:underline">
              Use calculator ↑
            </a>
          )}
        </div>
        <p className="mt-0.5 font-semibold text-foreground">{quoteContext.package}</p>
        {quoteContext.rec && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{quoteContext.rec.inverterQty > 1 ? `${quoteContext.rec.inverterQty}× ` : ""}{quoteContext.rec.inverterModel}</span>
            <span>{quoteContext.rec.panelCount}× {quoteContext.rec.panelWatts}W panels</span>
            <span>{quoteContext.rec.totalBatteryKwh} kWh storage</span>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="qf-name">Full name *</Label>
        <Input
          id="qf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          autoComplete="name"
          className="h-11 md:h-12"
        />
      </div>

      {/* Property + Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="qf-property">Property type</Label>
          <Input
            id="qf-property"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            placeholder="Home, office, shop…"
            className="h-11 md:h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qf-location">Your location</Label>
          <Input
            id="qf-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Lekki, Ikeja, VI…"
            className="h-11 md:h-12"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="qf-notes">Additional notes</Label>
        <Textarea
          id="qf-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Budget range, timeline, current generator size…"
        />
      </div>

      {/* Preview of what will be sent */}
      {hasCalcData && quoteContext.rec && (
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-gray-50/60 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground text-sm">Message will include your full load estimate</p>
          <p>⚡ Peak: {quoteContext.rec.peakLoadKw.toFixed(2)} kW · Daily: {quoteContext.rec.dailyKwh.toFixed(2)} kWh/day</p>
          <p>
            🔧 {quoteContext.rec.inverterQty > 1 ? `${quoteContext.rec.inverterQty}× ` : "1× "}{quoteContext.rec.inverterModel}
            {" · "}{quoteContext.rec.panelCount} panels
            {" · "}{quoteContext.rec.batteryCount}× {quoteContext.rec.batteryModel}
          </p>
        </div>
      )}

      {/* WhatsApp button */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg className="mr-2 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.537 5.873L0 24l6.29-1.513A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.36-.214-3.733.897.933-3.622-.234-.373A9.818 9.818 0 1112 21.818z" />
        </svg>
        Send Quote via WhatsApp
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Opens WhatsApp with your full estimate pre-written and ready to send.
      </p>
    </form>
  );
}

