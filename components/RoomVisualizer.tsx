import React from 'react';
import { RoomConfig } from '../types';

interface RoomVisualizerProps {
  config: RoomConfig;
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ config }) => {
  // Simple color mapping based on material IDs roughly
  const getColor = (id?: string) => {
    if (!id) return '#1e293b'; // slate-800 (empty)
    if (id.includes('brick')) return '#ef4444'; // red-500
    if (id.includes('drywall')) return '#e2e8f0'; // slate-200
    if (id.includes('mlv')) return '#111827'; // gray-900
    if (id.includes('wood') || id.includes('plywood')) return '#d97706'; // amber-600
    if (id.includes('air')) return '#60a5fa'; // blue-400 (transparent look logic handles elsewhere)
    if (id.includes('wool') || id.includes('fiber')) return '#fcd34d'; // amber-300
    if (id.includes('glass')) return '#93c5fd'; // blue-300
    if (id.includes('steel')) return '#94a3b8'; // slate-400
    return '#475569'; // slate-600
  };

  const PatternDefs = () => (
    <defs>
      <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="10" style={{stroke:'#000', strokeWidth:1, opacity: 0.1}} />
      </pattern>
      <pattern id="crossHatch" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M0,0 l10,10 M10,0 l-10,10" style={{stroke:'#000', strokeWidth:1, opacity: 0.1}} />
      </pattern>
    </defs>
  );

  return (
    <div className="w-full aspect-video bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-8">
      <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">
        SECTION VIEW (TOP-DOWN)
      </div>

      <svg width="100%" height="100%" viewBox="0 0 400 300" className="drop-shadow-2xl">
        <PatternDefs />
        
        {/* Room Context (Floor) */}
        <rect x="50" y="50" width="300" height="200" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        
        {/* --- COMPOSITE WALL STRUCTURE --- */}
        {/* We visualize the wall thickness based on layers selected */}
        
        {/* Outer Layer */}
        <g transform="translate(50, 50)">
           {/* Top Wall */}
           <rect x="-10" y="-10" width="320" height="10" fill={getColor(config.outerWall?.id)} stroke="none" />
           <rect x="-10" y="-10" width="320" height="10" fill="url(#diagonalHatch)" />
           
           {/* Bottom Wall */}
           <rect x="-10" y="200" width="320" height="10" fill={getColor(config.outerWall?.id)} stroke="none" />

           {/* Left Wall */}
           <rect x="-10" y="0" width="10" height="200" fill={getColor(config.outerWall?.id)} stroke="none" />

           {/* Right Wall */}
           <rect x="300" y="0" width="10" height="200" fill={getColor(config.outerWall?.id)} stroke="none" />
        </g>

        {/* Cavity / Insulation Layer */}
        <g transform="translate(50, 50)">
           {/* If cavity material is selected, show it inside the wall gap */}
           {config.cavityFill && (
             <>
              <rect x="0" y="0" width="300" height="8" fill={getColor(config.cavityFill.id)} opacity="0.8" />
              <rect x="0" y="192" width="300" height="8" fill={getColor(config.cavityFill.id)} opacity="0.8" />
              <rect x="0" y="0" width="8" height="200" fill={getColor(config.cavityFill.id)} opacity="0.8" />
              <rect x="292" y="0" width="8" height="200" fill={getColor(config.cavityFill.id)} opacity="0.8" />
              
              {/* Texture for insulation */}
              <rect x="0" y="0" width="300" height="8" fill="url(#crossHatch)" />
              <rect x="0" y="192" width="300" height="8" fill="url(#crossHatch)" />
              <rect x="0" y="0" width="8" height="200" fill="url(#crossHatch)" />
              <rect x="292" y="0" width="8" height="200" fill="url(#crossHatch)" />
             </>
           )}
        </g>

        {/* Inner Layer */}
        <g transform="translate(50, 50)">
           {/* Offset inwards by cavity thickness (approx 10px visually) */}
           <rect x="10" y="10" width="280" height="6" fill={getColor(config.innerWall?.id)} stroke="none" />
           <rect x="10" y="184" width="280" height="6" fill={getColor(config.innerWall?.id)} stroke="none" />
           <rect x="10" y="10" width="6" height="180" fill={getColor(config.innerWall?.id)} stroke="none" />
           <rect x="284" y="10" width="6" height="180" fill={getColor(config.innerWall?.id)} stroke="none" />
        </g>

        {/* --- FEATURES: DOOR & WINDOW --- */}
        
        {/* Door (Bottom Wall Center) */}
        {config.door && (
            <g transform="translate(180, 240)">
                <text x="20" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" className="uppercase font-mono">Door</text>
                <rect x="0" y="0" width="40" height="10" fill={getColor(config.door.id)} rx="2" stroke="#fff" strokeWidth="1" />
                {/* Visual gap in the wall for door */}
                 <rect x="-130" y="5" width="40" height="16" fill="#0f172a" /> 
            </g>
        )}

        {/* Window (Top Wall Center) */}
        {config.window && (
            <g transform="translate(180, 40)">
                 <text x="20" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="10" className="uppercase font-mono">Window</text>
                 <rect x="0" y="0" width="40" height="8" fill={getColor(config.window.id)} rx="1" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.5" />
            </g>
        )}

        {/* Sound Source Icon (Outside) */}
        <g transform="translate(20, 150)">
             <circle r="18" fill="#ef4444" opacity="0.2">
                <animate attributeName="r" values="12;28" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0" dur="1.5s" repeatCount="indefinite" />
             </circle>
             <text x="0" y="6" textAnchor="middle" fill="#ef4444" fontSize="20" fontWeight="bold">
                {config.source ? config.source.icon : '♫'}
             </text>
        </g>

        {/* Listener Icon (Inside) */}
        <g transform="translate(200, 150)">
            <circle r="8" fill="#10b981" />
            <text x="0" y="20" textAnchor="middle" fill="#10b981" fontSize="10">Listener</text>
        </g>

      </svg>
    </div>
  );
};

export default RoomVisualizer;