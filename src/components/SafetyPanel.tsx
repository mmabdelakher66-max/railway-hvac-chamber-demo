import { motion } from 'framer-motion';
import { Thermometer, Gauge, Fan, Zap, OctagonX, ShieldCheck, ShieldAlert, Target, BarChart3, CheckCircle2, Award } from 'lucide-react';
import type { SafetyStatus, SystemStatus } from '../types';

interface SafetyValidationProps {
  safety: SafetyStatus;
  status: SystemStatus;
  onEmergencyStop: () => void;
  onClearEmergency: () => void;
}

const safetyItems = [
  { key: 'tempLimit' as const, label: 'Temperature Limit', icon: <Thermometer size={16} /> },
  { key: 'pressureLimit' as const, label: 'Pressure Limit', icon: <Gauge size={16} /> },
  { key: 'fanFault' as const, label: 'Fan Fault', icon: <Fan size={16} /> },
  { key: 'electricalFault' as const, label: 'Electrical Fault', icon: <Zap size={16} /> },
  { key: 'emergencyStop' as const, label: 'Emergency Stop', icon: <OctagonX size={16} /> },
];

const validationItems = [
  { icon: <Target size={22} />, title: 'Stability', desc: 'Steady-state temperature and humidity control' },
  { icon: <BarChart3 size={22} />, title: 'Accuracy', desc: 'Measurement precision and calibration' },
  { icon: <CheckCircle2 size={22} />, title: 'Repeatability', desc: 'Consistent results across test runs' },
  { icon: <Award size={22} />, title: 'Performance', desc: 'HVAC capacity and efficiency metrics' },
];

export function SafetyValidation({ safety, status, onEmergencyStop, onClearEmergency }: SafetyValidationProps) {
  const isEmergency = status === 'emergency';
  const allClear = !Object.values(safety).some(v => v);

  return (
    <div className="space-y-10 w-full">
      {/* ─── Safety Section ─── */}
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="section-title">Safety Interlocks</div>
          <p className="text-sm text-slate-500 font-mono font-medium">
            Conceptual safety architecture — final design per applicable standards
          </p>
        </motion.div>

        {/* Emergency Banner */}
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-xl border border-red-500/30 bg-red-500/[0.08] flex items-center gap-4"
          >
            <ShieldAlert className="text-red-400 shrink-0" size={24} />
            <div className="flex-1">
              <div className="text-base font-mono font-extrabold text-red-400">
                Safe Shutdown — Emergency Stop Activated
              </div>
              <div className="text-sm text-red-400/70 mt-1 font-medium">
                HVAC: OFF · Actuators: OFF · All outputs de-energised
              </div>
            </div>
            <button className="btn-secondary text-sm !border-red-400/30 !text-red-400 !py-2 !px-4" onClick={onClearEmergency}>
              Clear
            </button>
          </motion.div>
        )}

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-panel text-center py-5 ${allClear ? '!border-emerald-400/15' : '!border-red-400/15'}`}
        >
          <div className="flex items-center justify-center gap-3">
            {allClear ? (
              <ShieldCheck size={24} className="text-emerald-400" />
            ) : (
              <ShieldAlert size={24} className="text-red-400" />
            )}
            <span className={`text-base font-mono font-extrabold tracking-wider ${allClear ? 'text-emerald-400' : 'text-red-400'}`}>
              {allClear ? 'All Systems Normal' : 'Fault Detected'}
            </span>
          </div>
        </motion.div>

        {/* Safety Items */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {safetyItems.map((item) => {
            const isFault = safety[item.key];
            return (
              <div
                key={item.key}
                className={`glass-panel-sm flex items-center gap-3 transition-colors duration-200 ${
                  isFault ? '!border-red-400/20 !bg-red-500/[0.06]' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isFault ? 'bg-red-500/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-sm font-mono text-slate-300 font-bold">{item.label}</div>
                <span className={`text-xs font-mono font-extrabold ${isFault ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isFault ? 'FAULT' : 'NORMAL'}
                </span>
              </div>
            );
          })}

          {/* E-Stop Button */}
          <button
            className="btn-danger w-full justify-center rounded-xl"
            onClick={onEmergencyStop}
            disabled={isEmergency}
          >
            <OctagonX size={16} />
            Emergency Stop
          </button>
        </motion.div>
      </div>

      {/* ─── Validation Section ─── */}
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-title">Validation Criteria</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {validationItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="glass-panel text-center"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 bg-sky-400/[0.08] text-sky-400 border border-sky-400/15">
                {item.icon}
              </div>
              <h3 className="text-sm font-mono font-extrabold text-slate-200 tracking-wider mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-center"
        >
          <span className="concept-badge">
            Validation criteria and acceptable error limits will be defined with EOG
          </span>
        </motion.div>
      </div>
    </div>
  );
}
