import React, { useState } from 'react';
import { BookOpen, PenTool, BarChart3, Info, Volume2, Hammer, Music2 } from 'lucide-react';
import { MATERIALS, EDUCATIONAL_CONCEPTS, SOUND_SOURCES } from './constants';
import { Material, MaterialType, RoomConfig, AnalysisResponse, SoundSource } from './types';
import MaterialCard from './components/MaterialCard';
import RoomVisualizer from './components/RoomVisualizer';
import SimulationResults from './components/SimulationResults';
import { analyzeRoomDesign } from './services/geminiService';

enum AppView {
  LEARN = 'LEARN',
  DESIGN = 'DESIGN',
  SIMULATE = 'SIMULATE'
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DESIGN);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    source: SOUND_SOURCES[0], // Default to Drums
    outerWall: null,
    innerWall: null,
    cavityFill: null,
    window: null,
    door: null
  });
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to update specific config part
  const updateConfig = (key: keyof RoomConfig, value: Material | SoundSource) => {
    setRoomConfig(prev => ({ ...prev, [key]: value }));
    // Reset analysis when design changes
    setAnalysis(null); 
  };

  // Trigger Gemini Analysis
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setView(AppView.SIMULATE);
    const result = await analyzeRoomDesign(roomConfig);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Filter materials for UI lists
  const getMaterialsByType = (type: MaterialType) => MATERIALS.filter(m => m.type === type);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- Sidebar Navigation --- */}
      <nav className="w-full md:w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Volume2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg hidden lg:block tracking-tight">音符筑“静”界</span>
        </div>

        <div className="flex-1 flex flex-row md:flex-col gap-1 p-2 md:p-4 overflow-x-auto md:overflow-visible">
          <NavButton 
            active={view === AppView.LEARN} 
            onClick={() => setView(AppView.LEARN)} 
            icon={<BookOpen size={20} />} 
            label="声学知识站" 
          />
          <NavButton 
            active={view === AppView.DESIGN} 
            onClick={() => setView(AppView.DESIGN)} 
            icon={<PenTool size={20} />} 
            label="建造工坊" 
          />
          <NavButton 
            active={view === AppView.SIMULATE} 
            onClick={() => setView(AppView.SIMULATE)} 
            icon={<BarChart3 size={20} />} 
            label="声学模拟室" 
          />
        </div>

        <div className="p-4 border-t border-slate-800 hidden lg:block">
          <div className="bg-slate-800/50 rounded-xl p-4 text-xs text-slate-400">
            <h5 className="font-bold text-slate-200 mb-1">当前任务</h5>
            <p>设计音乐教室隔音模型</p>
            <div className="mt-2 flex items-center gap-2 text-blue-300">
               <span>{roomConfig.source?.icon}</span>
               <span>目标: 降噪 {roomConfig.source?.decibels}dB+</span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 h-[calc(100vh-80px)] md:h-screen overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
          
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {view === AppView.LEARN && '声学原理：隔音的四大金刚'}
                {view === AppView.DESIGN && '设计您的隔音房模型'}
                {view === AppView.SIMULATE && '声学性能分析报告'}
              </h1>
              <p className="text-slate-400">
                {view === AppView.LEARN && '掌握质量、阻尼、解耦和密封原理'}
                {view === AppView.DESIGN && '根据乐器类型选择材料，构建复合墙体'}
                {view === AppView.SIMULATE && '基于 Gemini AI 的实时物理仿真'}
              </p>
            </div>
            {view === AppView.DESIGN && (
               <button 
                onClick={handleAnalyze}
                disabled={!roomConfig.outerWall}
                className={`
                  px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all
                  ${roomConfig.outerWall 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                `}
               >
                 <BarChart3 size={18} />
                 开始声学模拟
               </button>
            )}
          </header>

          {/* VIEW: LEARN */}
          {view === AppView.LEARN && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EDUCATIONAL_CONCEPTS.map((concept, idx) => (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{concept.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{concept.content}</p>
                </div>
              ))}
              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 mt-4">
                <h3 className="text-xl font-bold mb-2 text-blue-200"> STC (Sound Transmission Class) 是什么?</h3>
                <p className="text-slate-300">
                  声音传输等级 (STC) 是一个整数评级，用于表示建筑物隔断减少空气传播声音的能力。STC 越高，隔音效果越好。普通谈话的隔音大约需要 STC 30-40，而大声的乐器（如鼓）通常需要 STC 60 以上。
                </p>
              </div>
            </div>
          )}

          {/* VIEW: DESIGN */}
          {view === AppView.DESIGN && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Configurator */}
              <div className="lg:col-span-7 space-y-8">

                 {/* Step 0: Sound Source Selection */}
                 <ConfigSection title="1. 选择教学场景 / 乐器声源" icon={<Music2 size={18} />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SOUND_SOURCES.map(source => (
                            <div 
                                key={source.id}
                                onClick={() => updateConfig('source', source)}
                                className={`
                                    cursor-pointer rounded-xl p-3 border transition-all text-center
                                    ${roomConfig.source?.id === source.id
                                    ? 'bg-blue-600/20 border-blue-400 ring-1 ring-blue-400' 
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}
                                `}
                            >
                                <div className="text-2xl mb-1">{source.icon}</div>
                                <div className="text-sm font-bold text-slate-200">{source.name.split(' ')[0]}</div>
                                <div className="text-xs text-slate-500">{source.decibels} dB</div>
                            </div>
                        ))}
                    </div>
                    {roomConfig.source && (
                        <p className="mt-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            挑战：{roomConfig.source.description}
                        </p>
                    )}
                 </ConfigSection>
                
                <ConfigSection title="2. 墙体外层 (Outer Layer)" icon={<Hammer size={18} />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getMaterialsByType(MaterialType.WALL_LAYER).map(m => (
                      <MaterialCard 
                        key={m.id} 
                        material={m} 
                        isSelected={roomConfig.outerWall?.id === m.id} 
                        onSelect={(m) => updateConfig('outerWall', m)} 
                      />
                    ))}
                  </div>
                </ConfigSection>

                <ConfigSection title="3. 空腔与填充 (Cavity & Insulation)" icon={<Hammer size={18} />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getMaterialsByType(MaterialType.INSULATION).map(m => (
                      <MaterialCard 
                        key={m.id} 
                        material={m} 
                        isSelected={roomConfig.cavityFill?.id === m.id} 
                        onSelect={(m) => updateConfig('cavityFill', m)} 
                      />
                    ))}
                  </div>
                </ConfigSection>

                <ConfigSection title="4. 墙体内层 (Inner Layer)" icon={<Hammer size={18} />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getMaterialsByType(MaterialType.WALL_LAYER).map(m => (
                      <MaterialCard 
                        key={m.id} 
                        material={m} 
                        isSelected={roomConfig.innerWall?.id === m.id} 
                        onSelect={(m) => updateConfig('innerWall', m)} 
                      />
                    ))}
                  </div>
                </ConfigSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ConfigSection title="5. 门 (Door)" icon={<Hammer size={18} />}>
                    <div className="flex flex-col gap-3">
                      {getMaterialsByType(MaterialType.DOOR).map(m => (
                        <MaterialCard 
                          key={m.id} 
                          material={m} 
                          isSelected={roomConfig.door?.id === m.id} 
                          onSelect={(m) => updateConfig('door', m)} 
                        />
                      ))}
                    </div>
                  </ConfigSection>

                  <ConfigSection title="6. 窗 (Window)" icon={<Hammer size={18} />}>
                    <div className="flex flex-col gap-3">
                      {getMaterialsByType(MaterialType.WINDOW).map(m => (
                         <MaterialCard 
                          key={m.id} 
                          material={m} 
                          isSelected={roomConfig.window?.id === m.id} 
                          onSelect={(m) => updateConfig('window', m)} 
                        />
                      ))}
                    </div>
                  </ConfigSection>
                </div>
              </div>

              {/* Right Column: Visualization (Sticky) */}
              <div className="lg:col-span-5">
                <div className="sticky top-6 space-y-4">
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <h3 className="font-bold text-slate-400 mb-4 text-xs tracking-wider uppercase">模型实时预览</h3>
                    <RoomVisualizer config={roomConfig} />
                  </div>
                  
                  {/* Summary Card */}
                  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4">当前配置清单</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <SummaryItem label="场景" value={roomConfig.source?.name} />
                      <SummaryItem label="外墙" value={roomConfig.outerWall?.name} />
                      <SummaryItem label="填充" value={roomConfig.cavityFill?.name} />
                      <SummaryItem label="内墙" value={roomConfig.innerWall?.name} />
                      <SummaryItem label="门" value={roomConfig.door?.name} />
                      <SummaryItem label="窗" value={roomConfig.window?.name} />
                    </ul>
                    {!roomConfig.outerWall && (
                       <div className="mt-4 p-3 bg-blue-900/20 text-blue-300 text-xs rounded border border-blue-500/20">
                          请从左侧选择材料开始构建您的隔音房。
                       </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: SIMULATE */}
          {view === AppView.SIMULATE && (
            <SimulationResults data={analysis} isLoading={isAnalyzing} />
          )}

        </div>
      </main>
    </div>
  );
};

// --- Subcomponents for Clean Layout ---

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all text-sm font-medium
      ${active 
        ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
    `}
  >
    {icon}
    <span className="hidden lg:inline">{label}</span>
  </button>
);

const ConfigSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section>
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-200 mb-4">
      <span className="text-blue-500">{icon}</span>
      {title}
    </h2>
    {children}
  </section>
);

const SummaryItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <li className="flex justify-between items-center border-b border-slate-800 pb-2 last:border-0 last:pb-0">
    <span className="text-slate-500">{label}</span>
    <span className={value ? 'text-slate-200 font-medium' : 'text-slate-600 italic'}>
      {value || '未选择'}
    </span>
  </li>
);

export default App;