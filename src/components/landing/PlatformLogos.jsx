import { useState } from "react";

/**
 * PlatformLogo
 * Affiche le vrai logo (déposé dans /app/frontend/public/logos/).
 * Fallback : pastille texte aux couleurs de marque si l'image échoue.
 */
const BRANDS = {
  leboncoin: { label: "leboncoin", file: "/logos/leboncoin.png", bg: "#EC5A13", fg: "#FFFFFF" },
  seloger: { label: "SeLoger", file: "/logos/seloger.webp", bg: "#E2001A", fg: "#FFFFFF" },
  pap: { label: "PAP", file: "/logos/pap.png", bg: "#0084CB", fg: "#FFFFFF" },
  bienici: { label: "Bien'ici", file: "/logos/bienici.svg", bg: "#FF6F61", fg: "#FFFFFF" },
};

// Hauteurs en px (pour image et fallback aligné)
const SIZES = {
  sm: 22,
  md: 32,
  lg: 44,
  xl: 60,
};

export function PlatformLogo({ slug, size = "md", className = "" }) {
  const brand = BRANDS[slug];
  const [imgFailed, setImgFailed] = useState(false);
  if (!brand) return null;

  const h = SIZES[size] || SIZES.md;

  if (!imgFailed) {
    return (
      <img
        src={brand.file}
        alt={brand.label}
        onError={() => setImgFailed(true)}
        loading="lazy"
        className={`object-contain ${className}`}
        style={{ height: h, width: "auto", mixBlendMode: "multiply" }}
        data-testid={`platform-logo-${slug}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center px-3 font-bold rounded-md tracking-tight ${className}`}
      style={{ height: h, backgroundColor: brand.bg, color: brand.fg, fontSize: h * 0.4 }}
      data-testid={`platform-logo-${slug}-fallback`}
    >
      {brand.label}
    </span>
  );
}

export const PLATFORM_SLUGS = ["leboncoin", "seloger", "pap", "bienici"];

export default function PlatformLogos({ size = "md", gap = "gap-6", className = "" }) {
  return (
    <div className={`flex flex-wrap items-center ${gap} ${className}`}>
      {PLATFORM_SLUGS.map((slug) => (
        <PlatformLogo key={slug} slug={slug} size={size} />
      ))}
    </div>
  );
}
