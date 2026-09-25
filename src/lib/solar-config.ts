export type HybridInverter = {
  model: string;
  kva: number;
  voltage: number;
  maxWatts: number;
};

export type LithiumBattery = {
  model: string;
  kwh: number;
  voltage: number;
};

export type SolarConfig = {
  lossFactor: number;
  inverterDerating: number;
  inverterHeadroom: number;
  batteryDod: number;
  panelEfficiency: number;
  peakSunHours: number;
  defaultPanelWatts: number;
  minInverterIndex: number;
  tiers: {
    economy: { batteryMult: number; extraPanels: number; invSteps: number };
    standard: { batteryMult: number; extraPanels: number; invSteps: number };
    premium: { batteryMult: number; extraPanels: number; invSteps: number };
  };
  hybridInverters: HybridInverter[];
  lithiumBatteries: LithiumBattery[];
};

export const DEFAULT_SOLAR_CONFIG: SolarConfig = {
  lossFactor: 1.3,
  inverterDerating: 0.8,
  inverterHeadroom: 1.25,
  batteryDod: 0.85,
  panelEfficiency: 0.85,
  peakSunHours: 5,
  defaultPanelWatts: 450,
  minInverterIndex: 0,
  tiers: {
    economy:  { batteryMult: 1.0, extraPanels: 0, invSteps: 0 },
    standard: { batteryMult: 1.5, extraPanels: 2, invSteps: 1 },
    premium:  { batteryMult: 2.0, extraPanels: 4, invSteps: 2 },
  },
  hybridInverters: [
    { model: "Hybrid Inverter 1.2kVA 12V", kva: 1.2, voltage: 12, maxWatts: 960 },
    { model: "Hybrid Inverter 1.8kVA 12V", kva: 1.8, voltage: 12, maxWatts: 1440 },
    { model: "Hybrid Inverter 2kVA 12V",   kva: 2,   voltage: 12, maxWatts: 1600 },
    { model: "Hybrid Inverter 3kVA 24V",   kva: 3,   voltage: 24, maxWatts: 2400 },
    { model: "Hybrid Inverter 3.5kVA 24V", kva: 3.5, voltage: 24, maxWatts: 2800 },
    { model: "Hybrid Inverter 4kVA 24V",   kva: 4,   voltage: 24, maxWatts: 3200 },
    { model: "Hybrid Inverter 5kVA 48V",   kva: 5,   voltage: 48, maxWatts: 4000 },
    { model: "Hybrid Inverter 6kVA 48V",   kva: 6,   voltage: 48, maxWatts: 4800 },
    { model: "Hybrid Inverter 8kVA 48V",   kva: 8,   voltage: 48, maxWatts: 6400 },
    { model: "Hybrid Inverter 10kVA 48V",  kva: 10,  voltage: 48, maxWatts: 8000 },
    { model: "Hybrid Inverter 12kVA 48V",  kva: 12,  voltage: 48, maxWatts: 9600 },
    { model: "Hybrid Inverter 20kVA 48V",  kva: 20,  voltage: 48, maxWatts: 16000 },
  ],
  lithiumBatteries: [
    { model: "Lithium Battery 1.3kWh 12V",  kwh: 1.3,  voltage: 12 },
    { model: "Lithium Battery 2.5kWh 12V",  kwh: 2.5,  voltage: 12 },
    { model: "Lithium Battery 3kWh 12V",    kwh: 3,    voltage: 12 },
    { model: "Lithium Battery 3.8kWh 12V",  kwh: 3.8,  voltage: 12 },
    { model: "Lithium Battery 4kWh 12V",    kwh: 4,    voltage: 12 },
    { model: "Lithium Battery 2.5kWh 24V",  kwh: 2.5,  voltage: 24 },
    { model: "Lithium Battery 3kWh 24V",    kwh: 3,    voltage: 24 },
    { model: "Lithium Battery 3.8kWh 24V",  kwh: 3.8,  voltage: 24 },
    { model: "Lithium Battery 5kWh 24V",    kwh: 5,    voltage: 24 },
    { model: "Lithium Battery 7.5kWh 24V",  kwh: 7.5,  voltage: 24 },
    { model: "Lithium Battery 8kWh 24V",    kwh: 8,    voltage: 24 },
    { model: "Lithium Battery 5kWh 48V",    kwh: 5,    voltage: 48 },
    { model: "Lithium Battery 10kWh 48V",   kwh: 10,   voltage: 48 },
    { model: "Lithium Battery 15kWh 48V",   kwh: 15,   voltage: 48 },
    { model: "Lithium Battery 17.5kWh 48V", kwh: 17.5, voltage: 48 },
    { model: "Lithium Battery 20kWh 48V",   kwh: 20,   voltage: 48 },
    { model: "Lithium Battery 25kWh 48V",   kwh: 25,   voltage: 48 },
  ],
};
