import { useState, useRef, useCallback, useEffect } from 'react';
import type { TestParameters, LiveReadings, ChartDataPoint, SafetyStatus, SystemStatus, TestState } from '../types';
import { DEFAULT_PARAMS, DEFAULT_SAFETY } from '../types';

const TICK_MS = 500;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function computeTargetInternal(params: TestParameters): number {
  if (params.hvacMode === 'off') return params.outdoorTemp;
  const comfort = params.hvacMode === 'cooling' ? 22 : 24;
  const loadOffset = (params.thermalLoad * 0.02);
  return comfort + loadOffset;
}

function computeTargetInternalRH(params: TestParameters): number {
  if (params.hvacMode === 'off') return params.outdoorRH;
  const base = 45;
  const offset = (params.outdoorRH - 50) * 0.1;
  return clamp(base + offset, 30, 65);
}

function deriveTestState(elapsed: number, tempError: number): TestState {
  if (elapsed < 3) return 'initializing';
  if (tempError > 2) return 'approaching';
  return 'stable';
}

export function useSimulation() {
  const [params, setParams] = useState<TestParameters>(DEFAULT_PARAMS);
  const [status, setStatus] = useState<SystemStatus>('idle');
  const [readings, setReadings] = useState<LiveReadings>({
    internalTemp: DEFAULT_PARAMS.outdoorTemp,
    internalRH: DEFAULT_PARAMS.outdoorRH,
    airflow: 0,
    pressure: 101325,
    power: 0,
    hvacStatus: 'OFF',
    elapsed: 0,
    testState: 'idle',
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [safety, setSafety] = useState<SafetyStatus>(DEFAULT_SAFETY);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readingsRef = useRef(readings);
  const paramsRef = useRef(params);

  useEffect(() => { readingsRef.current = readings; }, [readings]);
  useEffect(() => { paramsRef.current = params; }, [params]);

  const tick = useCallback(() => {
    const p = paramsRef.current;
    const prev = readingsRef.current;

    const targetInternal = computeTargetInternal(p);
    const targetInternalRH = computeTargetInternalRH(p);
    const rate = 0.035;

    const newInternalTemp = lerp(prev.internalTemp, targetInternal, rate);
    const newInternalRH = lerp(prev.internalRH, targetInternalRH, rate);
    const newAirflow = (p.airflow / 100) * 4200;
    const newPressure = 101325 + (p.airflow * 0.4);

    const basePower = p.hvacMode === 'off' ? 0.5 : 8;
    const tempDelta = Math.abs(p.outdoorTemp - targetInternal);
    const newPower = p.hvacMode === 'off' ? 0.5 : basePower * (1 + tempDelta / 60);

    const elapsed = prev.elapsed + TICK_MS / 1000;
    const tempError = Math.abs(newInternalTemp - targetInternal);
    const testState = deriveTestState(elapsed, tempError);

    const newReadings: LiveReadings = {
      internalTemp: newInternalTemp + (Math.random() - 0.5) * 0.08,
      internalRH: newInternalRH + (Math.random() - 0.5) * 0.2,
      airflow: newAirflow + (Math.random() - 0.5) * 10,
      pressure: newPressure + (Math.random() - 0.5) * 3,
      power: newPower + (Math.random() - 0.5) * 0.2,
      hvacStatus: p.hvacMode === 'off' ? 'OFF' : p.hvacMode === 'cooling' ? 'COOLING' : 'HEATING',
      elapsed,
      testState,
    };

    setReadings(newReadings);

    // Chart data every ~1 second
    if (Math.floor(elapsed * 2) % 2 === 0) {
      setChartData(prev => {
        const point: ChartDataPoint = {
          time: Math.round(elapsed),
          internalTemp: parseFloat(newReadings.internalTemp.toFixed(1)),
          externalTemp: parseFloat((p.outdoorTemp + (Math.random() - 0.5) * 0.15).toFixed(1)),
        };
        const next = [...prev, point];
        return next.length > 60 ? next.slice(-60) : next;
      });
    }
  }, []);

  const startTest = useCallback(() => {
    if (status === 'running') return;
    setStatus('running');
    setChartData([]);
    // Start internal temp at outdoor temp
    setReadings(prev => ({
      ...prev,
      elapsed: 0,
      testState: 'initializing',
      internalTemp: paramsRef.current.outdoorTemp,
      internalRH: paramsRef.current.outdoorRH,
    }));
    setSafety(DEFAULT_SAFETY);
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [status, tick]);

  const stopTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setReadings(prev => ({ ...prev, testState: 'idle' }));
  }, []);

  const resetTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setParams(DEFAULT_PARAMS);
    setChartData([]);
    setReadings({
      internalTemp: DEFAULT_PARAMS.outdoorTemp,
      internalRH: DEFAULT_PARAMS.outdoorRH,
      airflow: 0,
      pressure: 101325,
      power: 0,
      hvacStatus: 'OFF',
      elapsed: 0,
      testState: 'idle',
    });
    setSafety(DEFAULT_SAFETY);
  }, []);

  const emergencyStop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('emergency');
    setParams(prev => ({ ...prev, hvacMode: 'off' }));
    setSafety({
      tempLimit: false,
      pressureLimit: false,
      fanFault: false,
      electricalFault: false,
      emergencyStop: true,
    });
    setReadings(prev => ({
      ...prev,
      hvacStatus: 'EMERGENCY STOP',
      power: 0,
      airflow: 0,
      testState: 'idle',
    }));
  }, []);

  const clearEmergency = useCallback(() => {
    setStatus('idle');
    setSafety(DEFAULT_SAFETY);
    setReadings(prev => ({ ...prev, hvacStatus: 'OFF', testState: 'idle' }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    params, setParams,
    status,
    readings,
    chartData,
    safety,
    startTest, stopTest, resetTest,
    emergencyStop, clearEmergency,
  };
}
