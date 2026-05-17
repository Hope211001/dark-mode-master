import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, CalendarClock, LogIn } from "lucide-react";

export default function Nav({ onReserve, onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = [
    { id: "comment", label: "Comment ça marche" },
    { id: "plateforme", label: "Plateforme" },
    { id: "carte", label: "Carte des zones" },
    { id: "tarif", label: "Tarif" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[rgba(250,247,242,0.85)] backdrop-blur-xl border-b border-line" : ""
      }`}
      data-testid="main-nav"
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
        <button onClick={() => goto("hero")} className="flex items-baseline gap-2" data-testid="nav-logo">
          <span className="font-bold text-ink text-xl md:text-[22px] tracking-tight">méridien</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-clay" />
          <span className="hidden sm:inline text-mute text-xs font-medium">licence territoriale</span>
        </button>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goto(l.id)}
              className="text-body hover:text-clay text-sm font-medium transition"
              data-testid={`nav-${l.id}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 text-body hover:text-clay text-sm font-medium transition" data-testid="nav-cta-login">
            <LogIn size={15} />
            Se connecter
          </Link>
          <button onClick={onBook} className="hidden md:inline-flex items-center gap-1.5 text-body hover:text-clay text-sm font-medium transition" data-testid="nav-cta-book">
            <CalendarClock size={15} />
            Prendre RDV
          </button>
          <button onClick={onReserve} className="btn-primary text-sm" data-testid="nav-cta-reserve">
            Sécuriser ma zone
            <span aria-hidden>→</span>
          </button>
          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
            data-testid="nav-burger"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-paper border-t border-line">
          <div className="flex flex-col px-5 py-4 gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => goto(l.id)}
                className="text-left py-3 text-body hover:text-clay font-medium"
              >
                {l.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); onBook(); }} className="text-left py-3 text-body hover:text-clay font-medium flex items-center gap-2">
              <CalendarClock size={15} />Prendre rendez-vous
            </button>
            <Link to="/login" onClick={() => setOpen(false)} className="text-left py-3 text-body hover:text-clay font-medium flex items-center gap-2">
              <LogIn size={15} />Se connecter
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
