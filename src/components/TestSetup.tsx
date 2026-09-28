import { motion } from 'framer-motion';
import { Play, Thermometer, Droplets, Users, Wind, Gauge } from 'lucide-react';
import type { TestParameters, SystemStatus, TestProfile } from '../types';
import { TEST_PROFILES } from '../types';

interface TestSetupProps {
  params: TestParameters;
  setParams: React.Dispatch<React.SetStateAction<TestParameters>>;
  status: SystemStatus;
  onStart: () => void;
  onNavigate: (tab: string) => void;
}

function Slider({
  label, value, min, max, unit, icon, onChange,
}: {
  label: string; value: number; min: number; max: number; unit: string;
  icon: React.ReactNode; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sky-400">{icon}</span>
          <span className="text-sm font-mono text-slate-300 font-bold">{label}</span>
        </div>
        <span className="text-base font-mono text-sky-400 font-extrabold tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        className="range-slider"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[11px] font-mono text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export function TestSetup({ params, setParams, status, onStart, onNavigate }: TestSetupProps) {
  const isRunning = status === 'running';
  const isEmergency = status === 'emergency';

  const applyProfile = (key: TestProfile) => {
    const profile = TEST_PROFILES[key];
    setParams(prev => ({ ...prev, ...profile.params }));
  };

  const handleStart = () => {
    onStart();
    onNavigate('live');
  };

  return (
    <div className="space-y-8 w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="section-title">Test Setup</div>
        <p className="text-sm text-slate-500 font-mono font-medium">
          Illustrative values — final test conditions to be defined with EOG
        </p>
      </motion.div>

      {/* Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel"
      >
        <div className="text-sm font-mono text-slate-400 mb-4 font-bold">Example Scenarios</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(TEST_PROFILES) as TestProfile[]).map((key) => {
            const profile = TEST_PROFILES[key];
            return (
              <button
                key={key}
                onClick={() => applyProfile(key)}
                disabled={isRunning}
                className="text-left px-5 py-4 rounded-xl border border-slate-700/40
                           bg-slate-800/30 hover:bg-sky-400/[0.06] hover:border-sky-400/20 transition-all
                           disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <div className="text-base font-mono font-bold text-slate-200">{profile.label}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{profile.description}</div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Parameter Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel space-y-6"
      >
        <Slider
          label="Outdoor Temperature"
          value={params.outdoorTemp}
          min={10} max={50} unit=" °C"
          icon={<Thermometer size={14} />}
          onChange={(v) => setParams(p => ({ ...p, outdoorTemp: v }))}
        />
        <Slider
          label="Outdoor Humidity"
          value={params.outdoorRH}
          min={20} max={90} unit=" %"
          icon={<Droplets size={14} />}
          onChange={(v) => setParams(p => ({ ...p, outdoorRH: v }))}
        />
        <Slider
          label="Passenger / Thermal Load"
          value={params.thermalLoad}
          min={0} max={100} unit=" %"
          icon={<Users size={14} />}
          onChange={(v) => setParams(p => ({ ...p, thermalLoad: v }))}
        />
        <Slider
          label="Fresh-Air Rate"
          value={params.freshAirRate}
          min={0} max={100} unit=" %"
          icon={<Wind size={14} />}
          onChange={(v) => setParams(p => ({ ...p, freshAirRate: v }))}
        />
        <Slider
          label="Airflow"
          value={params.airflow}
          min={0} max={100} unit=" %"
          icon={<Gauge size={14} />}
          onChange={(v) => setParams(p => ({ ...p, airflow: v }))}
        />
      </motion.div>

      {/* Start Test */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center pt-2"
      >
        <button
          className="btn-primary px-10"
          onClick={handleStart}
          disabled={isRunning || isEmergency}
        >
          <Play size={16} /> Start Test
        </button>
      </motion.div>
    </div>
  );
}
