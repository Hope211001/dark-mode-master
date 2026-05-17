export default function Footer() {
  return (
    <footer className="relative bg-paper border-t border-line pt-14 pb-8" data-testid="footer">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <div className="text-ink font-bold text-2xl tracking-tight">méridien</div>
            <p className="text-body text-sm leading-relaxed mt-3 max-w-sm">
              Une zone réservée. Des propriétaires à sous-louer qui arrivent.
              Vous signez. C'est tout.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-mute text-xs">
              <span>Soutenu par l'écosystème</span>
              <span className="text-ink font-bold text-sm">Goodtime</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-ink font-semibold mb-3 text-sm">Plateforme</div>
            <ul className="space-y-2 text-body text-sm">
              <li><a href="#comment" className="hover:text-clay">Comment ça marche</a></li>
              <li><a href="#carte" className="hover:text-clay">Carte des zones</a></li>
              <li><a href="#tarif" className="hover:text-clay">Tarif</a></li>
              <li><a href="#faq" className="hover:text-clay">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-ink font-semibold mb-3 text-sm">Contact</div>
            <ul className="space-y-2 text-body text-sm">
              <li><a href="mailto:bonjour@meridien.fr" className="hover:text-clay">bonjour@meridien.fr</a></li>
              <li className="text-mute">Réponse sous 48 h ouvrées</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-mute text-xs">
          <div>© {new Date().getFullYear()} MÉRIDIEN — Tous droits réservés</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink">Mentions légales</a>
            <a href="#" className="hover:text-ink">CGU</a>
            <a href="#" className="hover:text-ink">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
