import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CheckCircle } from 'lucide-react';

interface RegionData {
  name: string;
  amount: string;
  desc: string;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  currentLang: string;
  t: (text: string) => string;
  onSelectRegion: (region: { name: string; amount: string; desc: string } | null) => void;
}

export default function InteractiveMap({ currentLang, t, onSelectRegion }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const indonesiaRegions: RegionData[] = [
    { name: 'Sumatra', amount: 'Rp 1.450.000.000', desc: '46 Sekolah Tersertifikasi & Bantuan Tanggap Bencana Gempa', lat: -0.5897, lng: 101.3431 },
    { name: 'Jawa', amount: 'Rp 4.210.000.000', desc: '14 Pesantren Mandiri, 400 Santri Asrama & 2 Sumur Bor Utama Cilacap', lat: -7.0909, lng: 110.0044 },
    { name: 'Kalimantan', amount: 'Rp 890.000.000', desc: '3 Desa Sehat Sejahtera & Perlindungan Hutan Hijau Berkelanjutan', lat: -0.8801, lng: 113.8422 },
    { name: 'Sulawesi', amount: 'Rp 1.120.000.000', desc: 'Bantuan Pangan Nelayan Pesisir & Air Mengalir Donggala', lat: -1.4300, lng: 121.4456 },
    { name: 'Nusa Tenggara & Bali', amount: 'Rp 2.800.000.000', desc: 'Sumur Bor Produktif NTT, 2 Klinik Ibu & Anak Dhuafa', lat: -8.6529, lng: 117.3616 },
    { name: 'Maluku & Papua', amount: 'Rp 1.620.000.000', desc: 'Program Edukasi Terang Papua & Distribusi Beras Gizi Pelosok Asmat', lat: -3.3194, lng: 135.0305 }
  ];

  // Map state synchronization
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map once
    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: [-2.0, 118.0], // Centered on Indonesia
        zoom: 5,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        touchZoom: true,
      });

      // Dark Matter beautifully themed map layer (CartoDB)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);

      // Add elegant zoom control in bottom-left
      L.control.zoom({
        position: 'bottomleft'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Draw markers
    indonesiaRegions.forEach((reg) => {
      const isSelected = activeRegion === reg.name;

      const customIconHtml = `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-60"></span>
          <span class="relative block w-4.5 h-4.5 ${
            isSelected ? 'bg-emerald-400 scale-125 border-white' : 'bg-emerald-500 border-emerald-350'
          } border-2 rounded-full shadow-lg transition-all duration-250"></span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customIconHtml,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([reg.lat, reg.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setActiveRegion(reg.name);
          onSelectRegion({
            name: t(reg.name),
            amount: reg.amount,
            desc: t(reg.desc),
          });
        });

      markersRef.current.push(marker);
    });

    // Invalidate size on first load so container expands correctly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [activeRegion, currentLang]);

  // Clean up Leaflet Map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-80 md:h-[400px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative shadow-inner">
      <div ref={containerRef} className="w-full h-full z-0" />
      
      {/* Decorative indicator tag */}
      <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 py-1 px-2.5 rounded-lg text-[9px] text-gray-400 z-10 pointer-events-none flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
        <CheckCircle className="w-3 h-3 text-emerald-400" /> Map Satelit Aktif (OSM)
      </div>
    </div>
  );
}
