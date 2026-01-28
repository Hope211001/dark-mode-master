import { MapContainer, TileLayer, Circle, useMap, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { stripeService } from "@/services/stripe.service";
import { useToast } from "@/components/ui/use-toast"; 

// --- Types ---
interface Zone {
  id: string | number;
  nom: string;
  price?: number; // Ajouté car utile pour l'achat
  lat_center: number;
  lng_center: number;
  statut_market: 'LIBRE' | 'VENDU';
}

interface MapProps {
  zonesData: Zone[];
  searchPos: { lat: number; lon: number } | null;
  onSelectZone?: (id: string) => void;
}

// --- CSS Injecté ---
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
        <div style="position: absolute; width: 25px; height: 25px; background: ${color}; border-radius: 50%; animation: pulse-soft 2s infinite;"></div>
        <div style="width: 12px; height: 12px; background: ${color}; border: 2px solid white; border-radius: 50%; z-index: 2; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function MapExplorer({ zonesData = [], searchPos, onSelectZone }: MapProps) {
  // const { toast } = useToast(); // Décommenter si tu as le hook toast

  // --- LOGIQUE D'ACHAT ---
  const handlePurchase = async (zoneId: string) => {
    try {
      console.log("Tentative d'achat pour la zone :", zoneId);
      
      // Appel au service Stripe
      const data = await stripeService.buyZone(zoneId);
      
      // Redirection vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Pas d'URL reçue de Stripe");
      }
    } catch (error) {
      console.error("Erreur achat", error);
      alert("Erreur lors de la création de la session de paiement.");
      // toast({ title: "Erreur Stripe", description: "Impossible de lancer le paiement", variant: "destructive" });
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0e1a] overflow-hidden">
      <style>{customStyles}</style>

      <MapContainer
        center={[46.6033, 1.8883]}
        zoom={6}
        className="h-full w-full"
        zoomControl={false}
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
              {/* Cercle de zone */}
              <Circle
                center={[lat, lng]}
                radius={3000}
                pathOptions={{
                  fillColor: isVendu ? '#ef4444' : '#22c55e',
                  color: isVendu ? '#ef4444' : '#22c55e',
                  weight: 1,
                  fillOpacity: 0.1,
                }}
              />

              {/* Marqueur interactif */}
              <Marker
                position={[lat, lng]}
                icon={createCustomIcon(isVendu)}
                eventHandlers={{
                  click: () => onSelectZone?.(zone.id.toString()),
                }}
              >
                <Popup minWidth={220} closeButton={false}>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                      Zone de couverture
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                      {zone.nom}
                    </h3>
                    
                    {/* Affichage du prix si disponible */}
                    {zone.price && (
                      <p className="text-sm font-medium text-slate-600 mb-3">
                        Prix : <span className="text-slate-900 font-bold">{zone.price} €</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      
                      {/* Badge Statut */}
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${isVendu
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${isVendu ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {isVendu ? 'VENDU' : 'DISPONIBLE'}
                      </span>

                      {/* Bouton Acheter (Seulement si LIBRE) */}
                      {!isVendu && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Empêche de fermer la popup
                            handlePurchase(zone.id.toString());
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold py-1.5 px-3 rounded shadow transition-colors"
                        >
                          Acheter →
                        </button>
                      )}
                      
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