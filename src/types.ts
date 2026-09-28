export type HVACMode = 'cooling' | 'heating' | 'off';
export type SystemStatus = 'idle' | 'running' | 'shutdown' | 'emergency';
export type TestState = 'idle' | 'initializing' | 'approaching' | 'stable';
export type TestProfile = 'normal' | 'hot_day' | 'high_load';

export interface TestParameters {
  outdoorTemp: number;       // °C
  outdoorRH: number;         // %
  thermalLoad: number;       // %
  freshAirRate: number;      // %
  airflow: number;           // %
  hvacMode: HVACMode;
}

export interface LiveReadings {
  internalTemp: number;
  internalRH: number;
  airflow: number;
  pressure: number;
  power: number;
  hvacStatus: string;
  elapsed: number;
  testState: TestState;
}

export interface SafetyStatus {
  tempLimit: boolean;
  pressureLimit: boolean;
  fanFault: boolean;
  electricalFault: boolean;
  emergencyStop: boolean;
}

export interface ChartDataPoint {
  time: number;
  internalTemp: number;
  externalTemp: number;
}

export const TEST_PROFILES: Record<TestProfile, { label: string; description: string; params: Partial<TestParameters> }> = {
  normal: {
    label: 'Normal Day',
    description: '25 °C, moderate load',
    params: { outdoorTemp: 25, outdoorRH: 50, thermalLoad: 50, freshAirRate: 50, airflow: 60, hvacMode: 'cooling' },
  },
  hot_day: {
    label: 'Hot Day',
    description: '45 °C, high solar load',
    params: { outdoorTemp: 45, outdoorRH: 35, thermalLoad: 70, freshAirRate: 40, airflow: 80, hvacMode: 'cooling' },
  },
  high_load: {
    label: 'High Load',
    description: 'Full occupancy, high demand',
    params: { outdoorTemp: 35, outdoorRH: 60, thermalLoad: 100, freshAirRate: 80, airflow: 90, hvacMode: 'cooling' },
  },
};

export const DEFAULT_PARAMS: TestParameters = {
  outdoorTemp: 35,
  outdoorRH: 50,
  thermalLoad: 50,
  freshAirRate: 50,
  airflow: 60,
  hvacMode: 'cooling',
};

export const DEFAULT_SAFETY: SafetyStatus = {
  tempLimit: false,
  pressureLimit: false,
  fanFault: false,
  electricalFault: false,
  emergencyStop: false,
};
