/* eslint-disable */
import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import { fetchZones } from "@/lib/landing-api";

const DEPT_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/departements.geojson";
const PARIS_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/communes/par-departement/communes-75-paris.geojson";
const LYON_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/communes/par-departement/communes-69-rhone.geojson";
const MARSEILLE_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/communes/par-departement/communes-13-bouches-du-rhone.geojson";

const STATUS_LABEL = {
  available: "Libre",
  limited: "Bientôt prise",
  reserved: "Réservée",
  closed: "Complète",
};

const STATUS_FILL = {
  available: "#DAF2E5",
  limited: "#FCEAD2",
  reserved: "#E1E4E8",
  closed: "#2A2D33",
};
const STATUS_HOVER_FILL = {
  available: "#B6E5C7",
  limited: "#F8D9A8",
  reserved: "#CFD3DA",
  closed: "#1F2329",
};
const STATUS_STROKE = {
  available: "#1F8A5B",
  limited: "#D97706",
  reserved: "#8A8780",
  closed: "#0F0E0C",
};

const W = 760;
const H = 800;

export default function MapFrance({ onSelectZone, light = true }) {
  const [geo, setGeo] = useState(null);
  const [arrGeo, setArrGeo] = useState(null);
  const [zones, setZones] = useState({});
  const [arrZones, setArrZones] = useState({});
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState(`0 0 ${W} ${H}`);
  const svgRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [g, z] = await Promise.all([
          fetch(DEPT_GEOJSON_URL).then((r) => r.json()),
          fetchZones(),
        ]);
        setGeo(g);
        const m = {};
        z.forEach((zone) => { m[zone.code] = zone; });
        setZones(m);
      } catch (e) {
        console.error("Map load error", e);
      }
    })();
  }, []);

  const projection = useMemo(() => (geo ? geoMercator().fitSize([W, H], geo) : null), [geo]);
  const path = useMemo(() => (projection ? geoPath(projection) : null), [projection]);

  useEffect(() => {
    if (!selected) { setArrGeo(null); setArrZones({}); return; }
    const code = selected.properties.code;
    let url = null;
    if (code === "75") url = PARIS_GEOJSON_URL;
    else if (code === "69") url = LYON_GEOJSON_URL;
    else if (code === "13") url = MARSEILLE_GEOJSON_URL;
    if (!url) return;
    (async () => {
      try {
        const [g, z] = await Promise.all([
          fetch(url).then((r) => r.json()),
          fetchZones({ kind: "arrondissement", parent_code: code }),
        ]);
        setArrGeo(g);
        const m = {};
        z.forEach((x) => { m[x.code] = x; });
        setArrZones(m);
      } catch (e) { console.error(e); }
    })();
  }, [selected]);

  const zoomTo = (feat) => {
    if (!path) return;
    const [[x0, y0], [x1, y1]] = path.bounds(feat);
    const padX = (x1 - x0) * 0.2 + 28;
    const padY = (y1 - y0) * 0.2 + 28;
    setViewBox(`${x0 - padX} ${y0 - padY} ${(x1 - x0) + padX * 2} ${(y1 - y0) + padY * 2}`);
  };

  const reset = () => {
    setSelected(null); setArrGeo(null); setArrZones({});
    setViewBox(`0 0 ${W} ${H}`);
  };

  const handleClick = (feat) => {
    setSelected(feat);
    zoomTo(feat);
    const zone = zones[feat.properties.code];
    if (zone && onSelectZone) onSelectZone(zone);
  };

  const handleMove = (e, feat) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHover(feat);
  };

  const statusOf = (code, isArr) => (isArr ? arrZones[code]?.status : zones[code]?.status) || "available";

  const depts = Object.values(zones).filter((z) => z.kind === "departement");
  const totalDepts = depts.length || 96;
  const availCount = depts.filter((z) => z.status === "available").length;

  return (
    <div className="map-shell relative w-full h-full select-none" data-testid="map-france-shell">
      {/* Header counter */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4 md:p-6 pointer-events-none">
        <div className="pointer-events-auto bg-paper/85 backdrop-blur-md border border-line rounded-full px-3.5 py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-available pulse-ring" />
          <span className="font-mono text-xs text-ink"><b>{availCount}</b> <span className="text-mute">zones libres</span></span>
        </div>
        <div className="pointer-events-auto bg-paper/85 backdrop-blur-md border border-line rounded-full px-3.5 py-2 hidden sm:block">
          <span className="font-mono text-xs text-mute">{totalDepts} départements</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{ transition: "all 700ms cubic-bezier(.2,.7,.2,1)" }}
        className="w-full h-full"
        data-testid="map-france-svg"
      >
        <defs>
          <pattern id="hatch-closed" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          </pattern>
        </defs>

        {geo && path && geo.features.map((feat) => {
          const code = feat.properties.code;
          const status = statusOf(code, false);
          const isSel = selected?.properties?.code === code;
          let fill = STATUS_FILL[status];
          if (status === "closed") fill = "#2A2D33";
          return (
            <path
              key={code}
              d={path(feat)}
              fill={fill}
              stroke={STATUS_STROKE[status]}
              strokeWidth={isSel ? 1.6 : 0.7}
              strokeOpacity={status === "closed" ? 0.4 : 0.85}
              className={status === "limited" ? "pulse-limited-stroke" : ""}
              onClick={() => handleClick(feat)}
              onMouseEnter={(e) => handleMove(e, feat)}
              onMouseMove={(e) => handleMove(e, feat)}
              onMouseLeave={() => setHover(null)}
              data-testid={`map-dept-${code}`}
            />
          );
        })}

        {/* Closed hatch overlay */}
        {geo && path && geo.features.filter((f) => statusOf(f.properties.code, false) === "closed").map((feat) => (
          <path
            key={"hatch-" + feat.properties.code}
            d={path(feat)}
            fill="url(#hatch-closed)"
            pointerEvents="none"
          />
        ))}

        {arrGeo && path && arrGeo.features.map((feat) => {
          const props = feat.properties;
          const inseeCode = props.code || props.code_insee || props.cog || "";
          const lastTwo = String(inseeCode).slice(-2).padStart(2, "0");
          const parent = String(inseeCode).slice(0, 2);
          const code = `${parent}-${lastTwo}`;
          const status = statusOf(code, true);
          let fill = STATUS_FILL[status];
          if (status === "closed") fill = "#2A2D33";
          return (
            <path
              key={inseeCode + code}
              d={path(feat)}
              fill={fill}
              stroke={STATUS_STROKE[status]}
              strokeWidth={0.5}
              className={status === "limited" ? "pulse-limited-stroke" : ""}
              onClick={(e) => {
                e.stopPropagation();
                if (arrZones[code] && onSelectZone) onSelectZone(arrZones[code]);
              }}
              onMouseEnter={(e) => handleMove(e, { properties: { code, nom: arrZones[code]?.name || props.nom } })}
              onMouseMove={(e) => handleMove(e, { properties: { code, nom: arrZones[code]?.name || props.nom } })}
              onMouseLeave={() => setHover(null)}
              data-testid={`map-arr-${code}`}
            />
          );
        })}
      </svg>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 pointer-events-none"
            style={{ left: Math.min(tip.x + 14, W - 200), top: tip.y + 14 }}
          >
            <div className="bg-paper border border-line shadow-lg rounded-xl px-3.5 py-2.5 min-w-[170px]">
              <div className="font-mono text-[10px] text-mute uppercase tracking-wider">{hover.properties.code}</div>
              <div className="text-ink font-bold text-sm mt-0.5">{hover.properties.nom}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full bg-status-${statusOf(hover.properties.code, hover.properties.code.includes("-"))}`} />
                <span className="text-xs text-body font-semibold">
                  {STATUS_LABEL[statusOf(hover.properties.code, hover.properties.code.includes("-"))]}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="absolute bottom-4 left-4 z-30 px-3.5 py-2 bg-paper border border-line rounded-full text-ink text-xs font-semibold shadow-sm hover:bg-cream-2 transition"
            data-testid="map-reset-btn"
          >
            ← Vue France
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 z-20 bg-paper/95 backdrop-blur border border-line rounded-2xl p-3 space-y-1.5" data-testid="map-legend">
        {[
          { k: "available", l: "Libre" },
          { k: "limited", l: "Bientôt prise" },
          { k: "reserved", l: "Réservée" },
          { k: "closed", l: "Complète" },
        ].map((s) => (
          <div key={s.k} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-sm bg-status-${s.k}`} />
            <span className="text-[11px] text-body font-medium">{s.l}</span>
          </div>
        ))}
      </div>

      {!geo && (
        <div className="absolute inset-0 flex items-center justify-center text-mute font-medium text-sm">
          Chargement de la carte…
        </div>
      )}
    </div>
  );
}
