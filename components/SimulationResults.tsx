import React from 'react';
import { AnalysisResponse } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, Lightbulb } from 'lucide-react';

interface SimulationResultsProps {
  data: AnalysisResponse | null;
  isLoading: boolean;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 animate-pulse">
        <Activity size={48} className="mb-4 text-blue-500 animate-spin" />
        <p className="text-lg">AI 声学顾问正在计算 STC 指数...</p>
        <p className="text-sm">正在模拟声波穿透墙体的物理过程...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-slate-500">
        <p>请完成设计并点击“开始声学模拟”</p>
      </div>
    );
  }

  // Determine color based on STC
  const scoreColor = data.stc > 50 ? 'text-green-400' : data.stc > 35 ? 'text-yellow-400' : 'text-red-400';
  const progressColor = data.stc > 50 ? '#4ade80' : data.stc > 35 ? '#facc15' : '#f87171';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Score Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full bg-slate-900 border-4 border-current ${scoreColor}`}>
             <span className="text-3xl font-bold">{data.stc}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">STC 等级评分</h3>
            <p className="text-sm text-slate-400">Sound Transmission Class</p>
          </div>
        </div>
        <div className="flex-1 w-full md:w-auto">
            <div className="text-xs text-slate-400 mb-1 flex justify-between">
                <span>薄弱 (0)</span>
                <span>专业录音室 (60+)</span>
            </div>
            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((data.stc / 70) * 100, 100)}%`, backgroundColor: progressColor }}
                />
            </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100 mb-4">
            <ShieldCheck className="text-blue-400" /> 
            AI 物理分析
        </h3>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{data.analysis}</p>
      </div>

      {/* Grid: Chart & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Frequency Response Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 min-h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">频率响应 (Hz vs dB Loss)</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.frequency_data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit=" dB" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#60a5fa' }}
                            cursor={{fill: '#334155', opacity: 0.2}}
                        />
                        <Bar dataKey="value" name="隔音量" radius={[4, 4, 0, 0]}>
                            {data.frequency_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 40 ? '#4ade80' : entry.value > 25 ? '#60a5fa' : '#f87171'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100 mb-4">
                <Lightbulb className="text-yellow-400" />
                改进建议
            </h3>
            <ul className="space-y-3">
                {data.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                        </span>
                        <span className="text-sm text-slate-300">{sug}</span>
                    </li>
                ))}
            </ul>
            {/* Warning if egg cartons detected */}
            {data.analysis.includes("鸡蛋") && (
                <div className="mt-auto pt-4">
                    <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex gap-2 items-start text-red-300 text-sm">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>注意：科学实验表明鸡蛋托是易燃物，且几乎没有真正的隔音作用。请更换专业材料！</span>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SimulationResults;