import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Toaster } from "sonner";

import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Dashboard from "@/components/landing/Dashboard";
import MapSection from "@/components/landing/MapSection";
import Example from "@/components/landing/Example";
import Testimonials from "@/components/landing/Testimonials";
import Offers from "@/components/landing/Offers";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";
import Reservation from "@/components/landing/Reservation";
import BookingModal from "@/components/landing/BookingModal";

import "@/styles/landing.css";

function FinalCta({ onReserve, onBook }: { onReserve: () => void; onBook: () => void }) {
  return (
    <section className="relative py-24 md:py-32 bg-cream-2 overflow-hidden" data-testid="final-cta">
      <div className="absolute inset-0 pointer-events-none paper-texture" />
      <div className="relative max-w-[900px] mx-auto px-5 md:px-8 text-center">
        <div className="pill mx-auto"><span className="pill-dot" />Premier arrivé, premier servi</div>
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-tight font-extrabold mt-5">
          Votre zone est peut-être <span className="text-clay">encore libre</span>.<br />
          Ça vous prend 2 minutes à vérifier.
        </h2>
        <p className="text-body text-lg mt-5 max-w-xl mx-auto">
          Si elle est déjà sécurisée par un autre opérateur, on vous propose une zone proche.
          Si elle est libre, on l'active pour vous.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={onReserve} className="btn-primary text-base px-8 py-4" data-testid="final-cta-btn">
            Sécuriser ma zone
            <ArrowRight size={18} />
          </button>
          <button onClick={onBook} className="btn-secondary text-base px-7 py-4" data-testid="final-cta-book">
            <CalendarClock size={16} />
            Prendre rendez-vous
          </button>
        </div>
        <div className="mt-5 text-mute text-xs">Réponse de l'équipe sous 48 h · Pas de carte bancaire</div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [reservOpen, setReservOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [picked, setPicked] = useState<unknown>(null);

  const openReserv = (zone: unknown = null) => { setPicked(zone); setReservOpen(true); };
  const closeReserv = () => { setReservOpen(false); setPicked(null); };
  const openBook = () => setBookOpen(true);
  const closeBook = () => setBookOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (reservOpen) closeReserv();
      else if (bookOpen) closeBook();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reservOpen, bookOpen]);

  return (
    <div className="landing-page">
      <Nav onReserve={() => openReserv()} onBook={openBook} />
      <main>
        <Hero onReserve={() => openReserv()} onBook={openBook} />
        <HowItWorks />
        <Dashboard />
        <MapSection onZonePick={(z: unknown) => openReserv(z)} />
        <Example onReserve={() => openReserv()} onBook={openBook} />
        <Testimonials />
        <Offers onReserve={() => openReserv()} onBook={openBook} />
        <Faq />
        <FinalCta onReserve={() => openReserv()} onBook={openBook} />
      </main>
      <Footer />
      <Reservation open={reservOpen} onClose={closeReserv} prefilledZone={picked} />
      <BookingModal open={bookOpen} onClose={closeBook} />
      <Toaster position="bottom-center" theme="light" richColors />
    </div>
  );
}
