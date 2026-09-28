import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, Activity, GitBranch, ShieldCheck, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import { useSimulation } from './hooks/useSimulation';
import { Overview } from './components/Landing';
import { TestSetup } from './components/TestSetup';
import { LiveTest } from './components/LiveDashboard';
import { Architecture } from './components/ControlArchitecture';
import { SafetyValidation } from './components/SafetyPanel';

type Tab = 'overview' | 'setup' | 'live' | 'architecture' | 'safety';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Home size={14} /> },
  { id: 'setup', label: 'Test Setup', icon: <Settings size={14} /> },
  { id: 'live', label: 'Live Test', icon: <Activity size={14} /> },
  { id: 'architecture', label: 'Architecture', icon: <GitBranch size={14} /> },
  { id: 'safety', label: 'Safety & Validation', icon: <ShieldCheck size={14} /> },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [presentationMode, setPresentationMode] = useState(false);
  const sim = useSimulation();

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
  };

  return (
    <div className={`min-h-screen grid-bg relative ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* Emergency Overlay */}
      <AnimatePresence>
        {sim.status === 'emergency' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="emergency-overlay"
            onClick={sim.clearEmergency}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-slate-900 rounded-2xl border border-red-500/30 shadow-2xl max-w-sm mx-4 text-center p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertTriangle className="text-red-400 mx-auto mb-3" size={40} />
              <h2 className="text-xl font-mono font-extrabold text-red-400 mb-2">
                Emergency Stop
              </h2>
              <p className="text-sm text-slate-400 mb-1 font-medium">
                HVAC: OFF · Actuators: OFF
              </p>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Safe shutdown completed
              </p>
              <button className="btn-secondary !text-red-400 !border-red-400/30" onClick={sim.clearEmergency}>
                Acknowledge & Clear
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/85 border-b border-slate-800/40">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-400/10">
              <span className="text-[10px] font-extrabold text-slate-900">TC</span>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-100">HVAC Test Chamber</h1>
              <p className="text-xs font-mono text-slate-500 font-semibold">Conceptual Demonstrator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <span className={`status-dot ${
                sim.status === 'emergency' ? 'error' :
                sim.status === 'running' ? 'active' : 'idle'
              }`} />
              <span className="text-xs font-mono text-slate-400 font-bold">
                {sim.status === 'emergency' ? 'EMERGENCY' :
                 sim.status === 'running' ? 'RUNNING' : 'STANDBY'}
              </span>
            </div>

            {/* Presentation Mode Toggle */}
            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/30
                         bg-transparent text-xs font-mono text-slate-400 hover:text-sky-400 hover:border-sky-400/20 transition-all"
              title={presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
            >
              {presentationMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span className="hidden md:inline font-bold">{presentationMode ? 'Exit' : 'Present'}</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full px-8 pb-2">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <Overview status={sim.status} onNavigate={handleNavigate} />
            )}
            {activeTab === 'setup' && (
              <TestSetup
                params={sim.params}
                setParams={sim.setParams}
                status={sim.status}
                onStart={sim.startTest}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'live' && (
              <LiveTest
                readings={sim.readings}
                chartData={sim.chartData}
                status={sim.status}
                params={sim.params}
                onStop={sim.stopTest}
              />
            )}
            {activeTab === 'architecture' && (
              <Architecture />
            )}
            {activeTab === 'safety' && (
              <SafetyValidation
                safety={sim.safety}
                status={sim.status}
                onEmergencyStop={sim.emergencyStop}
                onClearEmergency={sim.clearEmergency}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/30 mt-8">
        <div className="w-full px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600 font-mono font-semibold">
            UPEI Cairo — Sustainable Design Engineering Year 4 × EOG International
          </p>
          <p className="text-xs text-slate-600 font-mono text-center sm:text-right max-w-md font-semibold">
            Conceptual demonstrator. Final architecture subject to EOG requirements,
            engineering calculations, and validation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
