import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Gauge, Sun } from 'lucide-react';
import type { SystemStatus } from '../types';

interface OverviewProps {
  status: SystemStatus;
  onNavigate: (tab: string) => void;
}

function FlowDots({ count = 3, delay = 0 }: { count?: number; delay?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flow-particle absolute"
          style={{
            left: `${30 + i * 20}%`,
            animationDelay: `${delay + i * 0.5}s`,
          }}
        >
          <div className="w-1 h-1 rounded-full bg-sky-400/40" />
        </div>
      ))}
    </>
  );
}

export function Overview({ status, onNavigate }: OverviewProps) {
  const isRunning = status === 'running';

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-100">
          Railway HVAC Environmental
          <br />
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Test Chamber</span>
        </h1>
        <p className="text-base text-slate-400 max-w-lg mx-auto font-medium">
          Controlled environment for repeatable railway HVAC performance testing.
        </p>
        <div className="flex justify-center">
          <span className="concept-badge">
            Conceptual Design — Requirements to be defined with EOG
          </span>
        </div>
      </motion.div>

      {/* Central Chamber Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="glass-panel w-full max-w-4xl mx-auto"
      >
        <div className="flex flex-col gap-3">
          {/* External Environment */}
          <div className="relative border border-amber-400/20 rounded-xl px-6 py-5 bg-amber-500/[0.04]">
            <div className="absolute -top-2.5 left-5 px-2 text-xs font-mono text-amber-400 bg-[var(--bg-primary)] leading-none font-bold">
              External Environment
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400 font-mono font-semibold">
              <span>Temperature · Humidity · Solar Radiation</span>
              <span className="text-amber-400/60 text-[11px] font-bold">ZONE A</span>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center relative h-7 overflow-hidden">
            <div className="flex flex-col items-center">
              <div className="w-px h-2.5 bg-sky-400/30" />
              <Wind size={12} className="text-sky-400" />
              <div className="w-px h-2.5 bg-sky-400/30" />
            </div>
            <FlowDots count={2} />
          </div>

          {/* HVAC Unit Under Test */}
          <div className="relative border border-sky-400/20 rounded-xl px-6 py-5 bg-sky-500/[0.04]">
            <div className="absolute -top-2.5 left-5 px-2 text-xs font-mono text-sky-400 bg-[var(--bg-primary)] leading-none font-bold">
              HVAC Unit Under Test
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400 font-mono font-semibold">
              <span>Cooling · Heating · Ventilation</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot ${isRunning ? 'active' : 'idle'}`} />
                <span className="text-[11px] font-bold">{isRunning ? 'ACTIVE' : 'STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center relative h-7 overflow-hidden">
            <div className="flex flex-col items-center">
              <div className="w-px h-2.5 bg-sky-400/30" />
              <Wind size={12} className="text-sky-400" />
              <div className="w-px h-2.5 bg-sky-400/30" />
            </div>
            <FlowDots count={2} delay={0.6} />
          </div>

          {/* Passenger Coach Zone */}
          <div className="relative border border-emerald-400/20 rounded-xl px-6 py-5 bg-emerald-500/[0.04]">
            <div className="absolute -top-2.5 left-5 px-2 text-xs font-mono text-emerald-400 bg-[var(--bg-primary)] leading-none font-bold">
              Passenger Coach Zone
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400 font-mono font-semibold">
              <span>Temperature · Humidity · Comfort Conditions</span>
              <span className="text-emerald-400/60 text-[11px] font-bold">ZONE B</span>
            </div>
          </div>
        </div>

        {/* Parameters Strip */}
        <div className="mt-6 pt-5 border-t border-slate-700/30">
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { icon: <Thermometer size={14} />, label: 'Temperature' },
              { icon: <Droplets size={14} />, label: 'Humidity' },
              { icon: <Wind size={14} />, label: 'Airflow' },
              { icon: <Sun size={14} />, label: 'Thermal Loads' },
              { icon: <Gauge size={14} />, label: 'Instrumentation' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-2 text-sm text-slate-400"
              >
                <span className="text-sky-400">{item.icon}</span>
                <span className="font-mono text-xs font-semibold">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Logic Flow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel-sm w-full max-w-4xl mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
          {['Controlled', 'Measured', 'Repeatable', 'Validated'].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-3">
              <span className="px-5 py-2.5 rounded-lg border border-sky-400/20 text-sky-400 bg-sky-400/[0.05] text-sm font-mono font-bold">
                {step}
              </span>
              {i < arr.length - 1 && <span className="text-sky-600 text-sm">→</span>}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          Our proposed chamber is designed to transform environmental conditions
          into measurable HVAC performance data.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="flex justify-center"
      >
        <button className="btn-primary" onClick={() => onNavigate('setup')}>
          Configure Test
        </button>
      </motion.div>
    </div>
  );
}
