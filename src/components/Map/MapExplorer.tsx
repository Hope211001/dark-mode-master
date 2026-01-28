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

// --- CSS Injecté pour les Popups et Animations ---
const customStyles = `
  .leaflet-popup-content-wrapper {
    background: #ffffff !important;
    color: #1e293b !important;
    border-radius: 12px !important;
    padding: 0px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
  }
  .leaflet-popup-tip {
    background: #ffffff !important;
  }
  .custom-marker-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes pulse-soft {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
`;

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 12, { animate: true, duration: 1.5 });
    }
  }, [lat, lon, map]);
  return null;
}

const createCustomIcon = (isVendu: boolean) => {
  const color = isVendu ? '#ef4444' : '#22c55e'; 
  
  return L.divIcon({
    className: 'custom-marker-container',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <!-- Halo d'animation -->
        <div style="
          position: absolute;
          width: 25px;
          height: 25px;
          background: ${color};
          border-radius: 50%;
          animation: pulse-soft 2s infinite;
        "></div>
        <!-- Point Central -->
        <div style="
          width: 12px;
          height: 12px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function MapExplorer({ zonesData = [], searchPos, onSelectZone }: MapProps) {
  return (
    <div className="h-full w-full bg-[#0a0e1a] overflow-hidden">
      <style>{customStyles}</style>
      
      <MapContainer
        center={[46.6033, 1.8883]}
        zoom={6}
        className="h-full w-full"
        zoomControl={false} // Plus propre pour le design
      >
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
              <Circle
                center={[lat, lng]}
                radius={3000} // Réduit légèrement pour plus de clarté
                pathOptions={{
                  fillColor: isVendu ? '#ef4444' : '#22c55e',
                  color: isVendu ? '#ef4444' : '#22c55e',
                  weight: 1,
                  fillOpacity: 0.1,
                }}
              />
              
              <Marker
                position={[lat, lng]}
                icon={createCustomIcon(isVendu)}
                eventHandlers={{
                  click: () => onSelectZone?.(zone.id.toString()),
                }}
              >
                <Popup minWidth={200} closeButton={false}>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                      Zone de couverture
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                      {zone.nom}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${
                        isVendu 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isVendu ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {isVendu ? 'DÉJÀ VENDU' : 'DISPONIBLE'}
                      </span>
                      
                      <button 
                        onClick={() => onSelectZone?.(zone.id.toString())}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Détails →
                      </button>
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