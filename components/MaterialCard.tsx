import React from 'react';
import { Material } from '../types';

interface MaterialCardProps {
  material: Material;
  isSelected: boolean;
  onSelect: (m: Material) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(material)}
      className={`
        cursor-pointer rounded-xl p-4 border transition-all duration-200
        ${isSelected 
          ? 'bg-blue-600/20 border-blue-400 ring-1 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-100">{material.name}</h4>
        {isSelected && <span className="text-blue-400 text-xs font-mono">SELECTED</span>}
      </div>
      <p className="text-sm text-slate-400 mb-3 leading-relaxed">{material.description}</p>
      <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1">
          成本: {'$'.repeat(material.costIndex)}{'·'.repeat(5 - material.costIndex)}
        </span>
        <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">
          STC基础: +{material.stcBase}
        </span>
      </div>
    </div>
  );
};

export default MaterialCard;