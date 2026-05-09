import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons broken by Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green marker
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ESPRIT Ariana coordinates
const ESPRIT_LAT = 36.8625;
const ESPRIT_LNG = 10.1956;

export function EspritMap() {
  return (
    <div
      className="rounded-3xl border border-green-400/40 shadow-card overflow-hidden"
      style={{ height: '360px', width: '100%' }}
    >
      <MapContainer
        center={[ESPRIT_LAT, ESPRIT_LNG]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[ESPRIT_LAT, ESPRIT_LNG]} icon={greenIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-sm">ESPRIT — Ariana</p>
              <p className="text-xs text-gray-500">Fieldly HQ · Tunis, Tunisia</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
