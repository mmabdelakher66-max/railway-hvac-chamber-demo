import { motion } from 'framer-motion';
import { ArrowDown, RotateCcw, MessageSquare, ArrowRight } from 'lucide-react';

const engineeringFlow = [
  { label: 'Requirements', desc: 'Performance targets from EOG' },
  { label: 'Environmental Conditions', desc: 'Temperature, humidity, solar load' },
  { label: 'Thermal / Airflow Loads', desc: 'Passenger, ventilation, leakage' },
  { label: 'HVAC Under Test', desc: 'Unit mounted in test chamber' },
  { label: 'Sensors', desc: 'T, RH, P, flow, power' },
  { label: 'Data Acquisition', desc: 'Signal conditioning, logging' },
  { label: 'Control & Monitoring', desc: 'Closed-loop regulation, HMI' },
  { label: 'Test Results', desc: 'Performance data, validation' },
];

const feedbackNodes = ['Sensors', 'DAQ', 'Controller', 'Actuators', 'Chamber'];

const eogNeeds = [
  'HVAC operating range',
  'Environmental test range',
  'Airflow requirements',
  'Physical interface',
  'Measurement requirements',
  'Safety requirements',
  'Validation criteria',
];

export function Architecture() {
  return (
    <div className="space-y-10 w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="section-title">Engineering Architecture</div>
        <p className="text-sm text-slate-500 font-mono font-medium">
          Proposed engineering methodology — conceptual
        </p>
      </motion.div>

      {/* Engineering Flow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel"
      >
        <div className="text-sm font-mono text-slate-400 mb-5 font-bold">Engineering Flow</div>
        <div className="flex flex-col items-stretch gap-1.5">
          {engineeringFlow.map((node, i) => (
            <div key={node.label}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-4 px-5 py-3 rounded-xl border border-slate-700/40 bg-slate-800/30 hover:bg-sky-400/[0.04] hover:border-sky-400/15 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-extrabold text-sky-400 bg-sky-400/[0.08] border border-sky-400/15 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono font-bold text-slate-200">{node.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">{node.desc}</div>
                </div>
              </motion.div>
              {i < engineeringFlow.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={12} className="text-sky-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feedback Loop */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel"
      >
        <div className="text-sm font-mono text-slate-400 mb-4 font-bold">Closed-Loop Control Concept</div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {feedbackNodes.map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-lg border border-sky-400/20 text-xs font-mono text-sky-400 bg-sky-400/[0.06] font-bold">
                {node}
              </span>
              {i < feedbackNodes.length - 1 && <ArrowRight size={12} className="text-sky-600" />}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <RotateCcw size={12} className="text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-bold">Feedback loop</span>
        </div>
      </motion.div>

      {/* What We Need from EOG */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={14} className="text-sky-400" />
          <span className="text-sm font-mono text-slate-200 font-bold">Information We Need from EOG</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {eogNeeds.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 + i * 0.04 }}
              className="flex items-center gap-2.5 text-sm text-slate-400 py-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span className="font-mono font-semibold">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-panel-sm text-center"
      >
        <div className="text-sm font-mono text-slate-400 mb-3 font-bold">Proposed Next Steps</div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['Client Interview', 'Requirements Definition', 'Detailed Engineering Design'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-lg border border-slate-700/40 text-sm font-mono text-slate-300 bg-slate-800/30 font-bold">
                {step}
              </span>
              {i < arr.length - 1 && <ArrowRight size={12} className="text-slate-600" />}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
