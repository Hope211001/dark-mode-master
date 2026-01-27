import { MapContainer, TileLayer, Circle, useMap, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// --- Types ---
interface Zone {
  id: string | number;
  nom: string;
  lat_center: number;
  lng_center: number;
  statut_market: 'LIBRE' | 'VENDU';
}

interface MapProps {
  zonesData: Zone[];
  searchPos: { lat: number; lon: number } | null;
  onSelectZone?: (id: string) => void;
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 12, { animate: true, duration: 1.5 });
    }
  }, [lat, lon, map]);
  return null;
}

// Créer des icônes personnalisées pour les marqueurs
const createCustomIcon = (isVendu: boolean) => {
  const color = isVendu ? '#ef4444' : '#10b981'; // Rouge vif ou Vert vif
  const shadowColor = isVendu ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 20px;
          height: 20px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px ${shadowColor}, 0 0 40px ${shadowColor};
          position: relative;
          z-index: 1000;
        "></div>
        <div style="
          width: 10px;
          height: 10px;
          background: ${color};
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.3;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function MapExplorer({ zonesData = [], searchPos, onSelectZone }: MapProps) {
  return (
    <div className="h-full w-full bg-[#0a0e1a]">
      <MapContainer
        center={[46.6033, 1.8883]}
        zoom={6}
        className="h-full w-full"
        style={{ background: "#0a0e1a" }}
      >
        {/* Layer Dark Matter - Très sombre pour contraste maximum */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {searchPos && <RecenterMap lat={searchPos.lat} lon={searchPos.lon} />}

        {zonesData.map((zone) => {
          const lat = Number(zone.lat_center);
          const lng = Number(zone.lng_center);

          if (isNaN(lat) || isNaN(lng)) return null;

          const isVendu = zone.statut_market === 'VENDU';

          return (
            <div key={zone.id}>
              {/* Circle pour la zone de couverture */}
              <Circle
                center={[lat, lng]}
                radius={5000}
                eventHandlers={{
                  click: () => onSelectZone?.(zone.id.toString()),
                }}
                pathOptions={{
                  fillColor: isVendu ? '#ef4444' : '#10b981',
                  color: isVendu ? '#f87171' : '#34d399',
                  weight: 2,
                  fillOpacity: 0.15,
                  opacity: 0.6,
                }}
              />
              
              {/* Marker avec point coloré visible */}
              <Marker
                position={[lat, lng]}
                icon={createCustomIcon(isVendu)}
                eventHandlers={{
                  click: () => onSelectZone?.(zone.id.toString()),
                }}
              >
                <Popup>
                  <div className="min-w-[180px] p-2">
                    <div className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${isVendu ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{
                          boxShadow: isVendu 
                            ? '0 0 10px rgba(239, 68, 68, 0.8)' 
                            : '0 0 10px rgba(16, 185, 129, 0.8)'
                        }}
                      />
                      {zone.nom}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      isVendu 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                      {isVendu ? '🔴 VENDU' : '🟢 LIBRE'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}