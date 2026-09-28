import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Square } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { LiveReadings, ChartDataPoint, SystemStatus, TestParameters } from '../types';

interface LiveTestProps {
  readings: LiveReadings;
  chartData: ChartDataPoint[];
  status: SystemStatus;
  params: TestParameters;
  onStop: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function TestStateLabel({ state }: { state: string }) {
  const config: Record<string, { label: string; color: string; dot: string }> = {
    idle: { label: 'Standby', color: 'text-slate-500', dot: 'idle' },
    initializing: { label: 'Initializing', color: 'text-amber-400', dot: 'warning' },
    approaching: { label: 'Approaching Steady State', color: 'text-sky-400', dot: 'active' },
    stable: { label: 'Stable', color: 'text-emerald-400', dot: 'active' },
  };
  const c = config[state] || config.idle;
  return (
    <div className="flex items-center gap-2">
      <span className={`status-dot ${c.dot}`} />
      <span className={`text-sm font-mono font-bold ${c.color}`}>{c.label}</span>
    </div>
  );
}

function Metric({ label, value, unit }: {
  label: string; value: React.ReactNode; unit: string;
}) {
  return (
    <div className="glass-panel-sm">
      <div className="metric-label mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="metric-value">{value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
    </div>
  );
}

export function LiveTest({ readings, chartData, status, params, onStop }: LiveTestProps) {
  const isRunning = status === 'running';
  const isEmergency = status === 'emergency';

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <div className="section-title">Live Test</div>
          <p className="text-sm text-slate-500 font-mono font-medium">
            Conceptual test response — illustrative data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TestStateLabel state={readings.testState} />
          {isRunning && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400/[0.06] border border-sky-400/15">
              <Clock size={12} className="text-sky-400" />
              <span className="text-base font-mono text-sky-400 font-extrabold tabular-nums">
                {formatTime(readings.elapsed)}
              </span>
            </div>
          )}
          {isRunning && (
            <button className="btn-secondary text-xs !py-2 !px-4" onClick={onStop}>
              <Square size={12} /> Stop
            </button>
          )}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        <Metric
          label="Internal Temp"
          value={isRunning || isEmergency ? <AnimatedNumber value={readings.internalTemp} /> : '—'}
          unit="°C"
        />
        <Metric
          label="Internal RH"
          value={isRunning || isEmergency ? <AnimatedNumber value={readings.internalRH} /> : '—'}
          unit="%"
        />
        <Metric
          label="Airflow"
          value={isRunning || isEmergency ? <AnimatedNumber value={readings.airflow} decimals={0} /> : '—'}
          unit="m³/h"
        />
        <Metric
          label="Pressure"
          value={isRunning || isEmergency ? <AnimatedNumber value={readings.pressure} decimals={0} /> : '—'}
          unit="Pa"
        />
        <Metric
          label="Elec. Power"
          value={isRunning || isEmergency ? <AnimatedNumber value={readings.power} /> : '—'}
          unit="kW"
        />
        <Metric
          label="HVAC Status"
          value={
            <span className={`text-lg font-mono font-bold ${
              isEmergency ? 'text-red-400' : readings.hvacStatus === 'OFF' ? 'text-slate-500' : 'text-emerald-400'
            }`}>
              {readings.hvacStatus}
            </span>
          }
          unit=""
        />
      </motion.div>

      {/* Temperature Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="section-title !mb-0">Conceptual Test Response</div>
          <div className="flex items-center gap-5 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-amber-400" />
              <span className="text-slate-400 font-semibold">External Temp ({params.outdoorTemp} °C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-cyan-400" />
              <span className="text-slate-400 font-semibold">Internal Temp</span>
            </div>
          </div>
        </div>
        <div className="h-52">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={['auto', 'auto']}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: 10,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: '#e2e8f0',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="externalTemp" name="External" stroke="#fbbf24" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="internalTemp" name="Internal" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-500 font-mono font-medium">
              Start a test to see the response
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
