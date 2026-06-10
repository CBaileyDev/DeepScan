/**
 * Comprehensive manufacturer-specific DTC (Diagnostic Trouble Code) meanings.
 *
 * Each code includes: the code itself, a make-specific or generic description,
 * optional systems affected, common causes, and a likelihood indicator.
 *
 * Structure: { make: { code: DtcMeaning } }
 * Generic P0xxx codes go under "GENERIC" for fallback.
 *
 * Data sourced from NHTSA OBD specs (SAE J2012), service bulletins, and
 * community databases (obd-codes.com, forums). Only high-confidence meanings
 * included; manufacturer-specific behavior is hand-curated.
 */

export type DtcMeaning = {
  code: string;
  description: string;
  systems?: string[];
  commonCauses?: string[];
  likelihood?: 'common' | 'rare';
};

/**
 * Comprehensive DTC meanings by manufacturer.
 * Covers top 10 makes: Toyota, Honda, Ford, GM, Chevrolet, BMW, Audi, Volkswagen, Subaru, Nissan.
 */
export const DTC_MEANINGS: Record<string, Record<string, DtcMeaning>> = {
  GENERIC: {
    // P0100 range: Air metering
    P0100: {
      code: 'P0100',
      description: 'Mass or Volume Air Flow Circuit Malfunction',
      systems: ['fuel', 'air'],
      commonCauses: ['MAF sensor dirty', 'Air leak', 'Wiring issue'],
      likelihood: 'common',
    },
    P0101: {
      code: 'P0101',
      description: 'Mass or Volume Air Flow Circuit Range/Performance Problem',
      systems: ['fuel', 'air'],
      commonCauses: ['MAF sensor out of range', 'Air filter restricted', 'Intake leak'],
      likelihood: 'common',
    },
    P0102: {
      code: 'P0102',
      description: 'Mass or Volume Air Flow Circuit Low Input',
      systems: ['fuel'],
      commonCauses: ['MAF sensor failure', 'Open circuit', 'Connector issue'],
      likelihood: 'common',
    },
    P0103: {
      code: 'P0103',
      description: 'Mass or Volume Air Flow Circuit High Input',
      systems: ['fuel'],
      commonCauses: ['MAF sensor contamination', 'PCM issue', 'Short to voltage'],
      likelihood: 'common',
    },

    // P0120 range: Throttle/Pedal Position
    P0120: {
      code: 'P0120',
      description: 'Throttle/Pedal Position Sensor/Switch A Circuit',
      systems: ['air'],
      commonCauses: ['TPS sensor failure', 'Throttle cable stuck', 'Wiring fault'],
      likelihood: 'common',
    },
    P0121: {
      code: 'P0121',
      description: 'Throttle/Pedal Position Sensor/Switch A Circuit Range/Performance',
      systems: ['air'],
      commonCauses: ['TPS sensor out of spec', 'Dirty throttle body', 'PCM calibration'],
      likelihood: 'common',
    },

    // P0130 range: O2 sensor
    P0130: {
      code: 'P0130',
      description: 'O2 Sensor Circuit (Bank 1)',
      systems: ['fuel', 'emissions'],
      commonCauses: ['O2 sensor failure', 'Wiring fault', 'Exhaust leak'],
      likelihood: 'common',
    },
    P0131: {
      code: 'P0131',
      description: 'O2 Sensor Circuit Low Voltage (Bank 1, Sensor 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor aged', 'Exhaust leak', 'PCM issue'],
      likelihood: 'common',
    },
    P0132: {
      code: 'P0132',
      description: 'O2 Sensor Circuit High Voltage (Bank 1, Sensor 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor contaminated', 'Short to voltage', 'Heater issue'],
      likelihood: 'common',
    },
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      systems: ['fuel', 'emissions'],
      commonCauses: ['O2 sensor aging', 'Exhaust leak', 'Catalyst deteriorating'],
      likelihood: 'common',
    },
    P0134: {
      code: 'P0134',
      description: 'O2 Sensor Circuit No Activity (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor failure', 'Open or short circuit', 'PCM not cycling'],
      likelihood: 'common',
    },

    // P0150 range: O2 sensor Bank 2
    P0150: {
      code: 'P0150',
      description: 'O2 Sensor Circuit (Bank 2)',
      systems: ['fuel', 'emissions'],
      commonCauses: ['O2 sensor failure', 'Wiring fault', 'Exhaust leak'],
      likelihood: 'common',
    },
    P0151: {
      code: 'P0151',
      description: 'O2 Sensor Circuit Low Voltage (Bank 2, Sensor 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor aged', 'Exhaust leak', 'PCM issue'],
      likelihood: 'common',
    },
    P0152: {
      code: 'P0152',
      description: 'O2 Sensor Circuit High Voltage (Bank 2, Sensor 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor contaminated', 'Short to voltage', 'Heater issue'],
      likelihood: 'common',
    },
    P0153: {
      code: 'P0153',
      description: 'O2 Sensor Circuit Slow Response (Bank 2, Sensor 1)',
      systems: ['fuel', 'emissions'],
      commonCauses: ['O2 sensor aging', 'Exhaust leak', 'Catalyst deteriorating'],
      likelihood: 'common',
    },

    // P0170 range: Fuel trim
    P0171: {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Vacuum leak',
        'Fuel pressure low',
        'MAF sensor dirty',
        'Fuel injector stuck open',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure high', 'Injector stuck closed', 'O2 sensor fail', 'Air leak'],
      likelihood: 'common',
    },
    P0173: {
      code: 'P0173',
      description: 'Fuel Trim Malfunction (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['O2 sensor failure', 'Fuel pressure issue', 'Vacuum leak'],
      likelihood: 'common',
    },
    P0174: {
      code: 'P0174',
      description: 'System Too Lean (Bank 2)',
      systems: ['fuel'],
      commonCauses: ['Vacuum leak', 'Fuel pressure low', 'MAF sensor dirty'],
      likelihood: 'common',
    },
    P0175: {
      code: 'P0175',
      description: 'System Too Rich (Bank 2)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure high', 'Injector leak', 'O2 sensor fail'],
      likelihood: 'common',
    },

    // P0200 range: Fuel injector
    P0201: {
      code: 'P0201',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 1',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },
    P0202: {
      code: 'P0202',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 2',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },
    P0203: {
      code: 'P0203',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 3',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },
    P0204: {
      code: 'P0204',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 4',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },
    P0205: {
      code: 'P0205',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 5',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },
    P0206: {
      code: 'P0206',
      description: 'Fuel Injector Circuit Malfunction — Cylinder 6',
      systems: ['fuel'],
      commonCauses: ['Fuel injector stuck', 'Wiring fault', 'PCM driver failure'],
      likelihood: 'common',
    },

    // P0300 range: Misfire
    P0300: {
      code: 'P0300',
      description: 'Random/Multiple Cylinder Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: [
        'Spark plugs worn',
        'Ignition coils failing',
        'Fuel pressure low',
        'Vacuum leak',
      ],
      likelihood: 'common',
    },
    P0301: {
      code: 'P0301',
      description: 'Cylinder 1 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },
    P0302: {
      code: 'P0302',
      description: 'Cylinder 2 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },
    P0303: {
      code: 'P0303',
      description: 'Cylinder 3 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },
    P0304: {
      code: 'P0304',
      description: 'Cylinder 4 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },
    P0305: {
      code: 'P0305',
      description: 'Cylinder 5 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },
    P0306: {
      code: 'P0306',
      description: 'Cylinder 6 Misfire Detected',
      systems: ['ignition', 'fuel'],
      commonCauses: ['Spark plug fouled', 'Coil pack failure', 'Fuel injector issue'],
      likelihood: 'common',
    },

    // P0400 range: Emissions
    P0400: {
      code: 'P0400',
      description: 'Exhaust Gas Recirculation Flow Malfunction',
      systems: ['emissions'],
      commonCauses: ['EGR valve stuck', 'Carbon buildup', 'EGR solenoid failure'],
      likelihood: 'common',
    },
    P0401: {
      code: 'P0401',
      description: 'Exhaust Gas Recirculation Flow Insufficient',
      systems: ['emissions'],
      commonCauses: ['EGR valve stuck closed', 'Carbon blockage', 'EGR passage clogged'],
      likelihood: 'common',
    },
    P0402: {
      code: 'P0402',
      description: 'Exhaust Gas Recirculation Flow Excessive',
      systems: ['emissions'],
      commonCauses: ['EGR valve stuck open', 'EGR solenoid fault', 'Vacuum leak'],
      likelihood: 'common',
    },

    // P0420 range: Catalyst
    P0420: {
      code: 'P0420',
      description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
      systems: ['emissions'],
      commonCauses: ['Catalytic converter failing', 'O2 sensor aged', 'Engine running rich'],
      likelihood: 'common',
    },
    P0421: {
      code: 'P0421',
      description: 'Warm Up Catalyst System Efficiency Below Threshold (Bank 1)',
      systems: ['emissions'],
      commonCauses: ['Catalyst damage', 'O2 sensor failure', 'Fuel trim issue'],
      likelihood: 'common',
    },
    P0430: {
      code: 'P0430',
      description: 'Catalyst System Efficiency Below Threshold (Bank 2)',
      systems: ['emissions'],
      commonCauses: ['Catalytic converter failing', 'O2 sensor aged', 'Engine running rich'],
      likelihood: 'common',
    },

    // P0500 range: Speed/Idle
    P0500: {
      code: 'P0500',
      description: 'Vehicle Speed Sensor Malfunction',
      systems: ['speed control'],
      commonCauses: ['VSS sensor failure', 'Wiring fault', 'Transmission issue'],
      likelihood: 'common',
    },
    P0505: {
      code: 'P0505',
      description: 'Idle Air Control System Malfunction',
      systems: ['air', 'idle control'],
      commonCauses: ['Idle speed too high', 'Vacuum leak', 'IAC valve stuck'],
      likelihood: 'common',
    },
    P0506: {
      code: 'P0506',
      description: 'Idle Air Control System RPM Lower Than Expected',
      systems: ['idle control'],
      commonCauses: ['Vacuum leak', 'IAC valve stuck closed', 'Air leak'],
      likelihood: 'common',
    },
    P0507: {
      code: 'P0507',
      description: 'Idle Air Control System RPM Higher Than Expected',
      systems: ['idle control'],
      commonCauses: ['Vacuum leak', 'IAC valve stuck open', 'Throttle cable stuck'],
      likelihood: 'common',
    },

    // P0600 range: PCM/Electrical
    P0600: {
      code: 'P0600',
      description: 'Serial Communication Link Error',
      systems: ['electrical', 'communication'],
      commonCauses: ['PCM fault', 'Battery voltage low', 'Wiring issue'],
      likelihood: 'rare',
    },
    P0606: {
      code: 'P0606',
      description: 'PCM/ECM Processor Fault',
      systems: ['computer'],
      commonCauses: ['PCM failure', 'Corrupted memory', 'Voltage fluctuation'],
      likelihood: 'rare',
    },

    // P0700 range: Transmission
    P0700: {
      code: 'P0700',
      description: 'Transmission Control System Malfunction',
      systems: ['transmission'],
      commonCauses: ['Transmission fluid low', 'Solenoid fault', 'Wiring issue'],
      likelihood: 'common',
    },
    P0710: {
      code: 'P0710',
      description: 'Transmission Fluid Temperature Sensor Circuit',
      systems: ['transmission'],
      commonCauses: ['Temp sensor failure', 'Wiring fault', 'Transmission issue'],
      likelihood: 'common',
    },

    // P0800 range: Transmission control
    P0800: {
      code: 'P0800',
      description: 'Transmission Control System Malfunction',
      systems: ['transmission'],
      commonCauses: ['TCM fault', 'Transmission issue', 'Wiring problem'],
      likelihood: 'common',
    },

    // P0900 range: Cruise control
    P0900: {
      code: 'P0900',
      description: 'Clutch Pedal Position Switch/Circuit',
      systems: ['transmission'],
      commonCauses: ['Clutch switch failure', 'Wiring fault', 'Pedal position issue'],
      likelihood: 'rare',
    },

    // P1000 range: Manufacturer-specific (not included; falls back to structural)
    // Reserved for make-specific codes
  },

  Toyota: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: [
        'O2 sensor aging',
        'Exhaust leak before sensor',
        'Catalyst efficiency declining',
      ],
      likelihood: 'common',
    },
    P0155: {
      code: 'P0155',
      description: 'O2 Sensor Heater Circuit (Bank 2, Sensor 1)',
      systems: ['fuel', 'electrical'],
      commonCauses: ['O2 sensor heater fault', 'Wiring issue', 'Fuse blown'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel Trim System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Vacuum leak',
        'Fuel pressure low',
        'MAF sensor dirty',
        'Fuel injector stuck open',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel Trim System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure too high', 'Fuel injector stuck closed', 'O2 sensor failing'],
      likelihood: 'common',
    },
    P1128: {
      code: 'P1128',
      description: 'Fuel Pressure Too High or Too Low',
      systems: ['fuel'],
      commonCauses: ['Fuel pump failing', 'Fuel pressure regulator stuck', 'Clogged filter'],
      likelihood: 'common',
    },
    P1135: {
      code: 'P1135',
      description: 'Front O2 Sensor Lean (Bank 1, Sensor 1)',
      systems: ['fuel'],
      commonCauses: ['Vacuum leak', 'Fuel pressure low', 'O2 sensor degraded'],
      likelihood: 'common',
    },
    P1155: {
      code: 'P1155',
      description: 'Fuel Pump Relay Control Defect',
      systems: ['fuel', 'electrical'],
      commonCauses: ['Fuel pump relay failure', 'Wiring open', 'PCM fuel pump driver'],
      likelihood: 'rare',
    },
    P1604: {
      code: 'P1604',
      description: 'A/T Check Engine Light Comes on Early',
      systems: ['transmission'],
      commonCauses: ['Transmission shift solenoid', 'Wiring fault', 'TCM issue'],
      likelihood: 'rare',
    },
  },

  Honda: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Response Slow (Bank 1, Sensor 1)',
      commonCauses: ['O2 sensor end-of-life', 'Short between wires', 'PCM issue'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'System Too Lean — Fuel Trim at Limit (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Vacuum leak',
        'Fuel pressure low',
        'MAF sensor dirty',
        'Leaking fuel injector',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'System Too Rich — Fuel Trim at Limit (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Fuel pressure too high',
        'Injector stuck open',
        'O2 sensor failing',
        'Air intake leak',
      ],
      likelihood: 'common',
    },
    P1128: {
      code: 'P1128',
      description: 'Fuel Pressure Regulator Control Error',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure regulator stuck', 'Fuel pump issue', 'Pressure line clog'],
      likelihood: 'rare',
    },
    P1361: {
      code: 'P1361',
      description: 'EGR Valve Lift Solenoid Circuit',
      systems: ['emissions'],
      commonCauses: ['EGR solenoid fault', 'Wiring open', 'EGR valve stuck'],
      likelihood: 'common',
    },
    P1457: {
      code: 'P1457',
      description: 'Evaporative Emission Control System Leak Detected',
      systems: ['emissions'],
      commonCauses: ['Charcoal canister leak', 'Fuel cap loose', 'Hose cracked'],
      likelihood: 'common',
    },
  },

  Ford: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['O2 sensor replacement needed', 'Exhaust manifold leak', 'Catalyst aging'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Vacuum leak',
        'Fuel filter clogged',
        'MAF sensor contaminated',
        'O2 sensor failure',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Fuel pressure too high',
        'Injector leaking',
        'MAF sensor failure',
        'O2 sensor stuck',
      ],
      likelihood: 'common',
    },
    P1000: {
      code: 'P1000',
      description: 'KOER Test Not Completed — Engine Running Time Too Short',
      systems: ['computer'],
      commonCauses: ['Engine not run long enough', 'Previous clear codes', 'Cold start condition'],
      likelihood: 'rare',
    },
    P1409: {
      code: 'P1409',
      description: 'EGR Valve Control Solenoid Circuit Malfunction',
      systems: ['emissions'],
      commonCauses: ['EGR solenoid failure', 'Wiring fault', 'PCM driver fault'],
      likelihood: 'common',
    },
  },

  GM: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: [
        'O2 sensor degradation',
        'Exhaust temperature too low',
        'Catalyst deterioration',
      ],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Air leak', 'Fuel pressure insufficient', 'MAF sensor issue', 'Vacuum leak'],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['High fuel pressure', 'Injector fault', 'O2 sensor aged', 'PCM issue'],
      likelihood: 'common',
    },
    P1516: {
      code: 'P1516',
      description: 'EGR Valve Position Feedback Voltage Out of Range',
      systems: ['emissions'],
      commonCauses: ['EGR valve stuck', 'EGR position sensor failure', 'Wiring fault'],
      likelihood: 'common',
    },
  },

  Chevrolet: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['O2 sensor aging', 'Low exhaust temperature', 'Catalyst efficiency declining'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Intake leak', 'Low fuel pressure', 'MAF sensor dirty', 'Faulty injector'],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Elevated fuel pressure', 'Stuck injector', 'Bad O2 sensor', 'PCM issue'],
      likelihood: 'common',
    },
  },

  BMW: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Lambda Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['Lambda sensor aging', 'Exhaust leak', 'Catalyst efficiency declining'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel Mixture Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Vacuum leak',
        'Fuel pressure too low',
        'MAF sensor fault',
        'Fuel filter clogged',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel Mixture Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure too high', 'Injector stuck open', 'Lambda sensor failure'],
      likelihood: 'common',
    },
    P0016: {
      code: 'P0016',
      description: 'Crankshaft/Camshaft Position Correlation',
      systems: ['ignition'],
      commonCauses: ['Timing chain slack', 'Camshaft timing off', 'Sensor sync issue'],
      likelihood: 'rare',
    },
  },

  Audi: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Lambda Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['Lambda sensor aging', 'Exhaust system leak', 'Catalyst deteriorating'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: [
        'Air leak in intake',
        'Fuel pressure low',
        'MAF sensor fault',
        'Fuel filter clogged',
      ],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure high', 'Injector leaking', 'Lambda sensor failure'],
      likelihood: 'common',
    },
  },

  Volkswagen: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Lambda Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['Lambda sensor wear', 'Exhaust leak', 'Catalyst aging'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel Trim Bank 1 System Too Lean',
      systems: ['fuel'],
      commonCauses: ['Vacuum leak', 'Low fuel pressure', 'MAF sensor issue', 'Fuel filter clogged'],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel Trim Bank 1 System Too Rich',
      systems: ['fuel'],
      commonCauses: ['High fuel pressure', 'Injector stuck', 'O2 sensor failed'],
      likelihood: 'common',
    },
  },

  Subaru: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: ['O2 sensor degradation', 'Exhaust manifold leak', 'Catalyst efficiency low'],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel Trim System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Vacuum leak', 'Fuel pressure low', 'MAF sensor dirty', 'Fuel injector stuck'],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel Trim System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure high', 'Injector leaking', 'O2 sensor bad', 'Air intake leak'],
      likelihood: 'common',
    },
    P0420: {
      code: 'P0420',
      description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
      systems: ['emissions'],
      commonCauses: ['Catalyst converter failing', 'O2 sensor aging', 'Engine running rich'],
      likelihood: 'common',
    },
  },

  Nissan: {
    P0133: {
      code: 'P0133',
      description: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
      commonCauses: [
        'O2 sensor end-of-life',
        'Exhaust leak before sensor',
        'Catalyst efficiency declining',
      ],
      likelihood: 'common',
    },
    P0171: {
      code: 'P0171',
      description: 'Fuel Trim System Too Lean (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Intake vacuum leak', 'Fuel pressure insufficient', 'MAF sensor contaminated'],
      likelihood: 'common',
    },
    P0172: {
      code: 'P0172',
      description: 'Fuel Trim System Too Rich (Bank 1)',
      systems: ['fuel'],
      commonCauses: ['Fuel pressure excessive', 'Fuel injector stuck open', 'O2 sensor degraded'],
      likelihood: 'common',
    },
    P0500: {
      code: 'P0500',
      description: 'Vehicle Speed Sensor Malfunction',
      systems: ['speed control'],
      commonCauses: ['VSS sensor failure', 'Wiring fault', 'Transmission pickup issue'],
      likelihood: 'common',
    },
  },
};

/**
 * Normalize make names to canonical form.
 * Handles aliases, case-insensitivity, trimming.
 */
export const MAKE_ALIASES: Record<string, string> = {
  // Chevrolet aliases
  chevy: 'Chevrolet',
  chevrolet: 'Chevrolet',
  gmc: 'GM',

  // Volkswagen aliases
  vw: 'Volkswagen',
  volkswagen: 'Volkswagen',

  // General Motors
  gm: 'GM',
  'general motors': 'GM',
  cadillac: 'GM', // Cadillac is GM brand
  oldsmobile: 'GM', // Oldsmobile (historic GM)

  // Japanese
  toyota: 'Toyota',
  honda: 'Honda',
  nissan: 'Nissan',
  mazda: 'Nissan', // Often shares platforms; fallback to Nissan codes
  datsun: 'Nissan',
  subaru: 'Subaru',
  mitsubishi: 'Honda', // Similar platforms to Honda

  // European
  ford: 'Ford',
  bmw: 'BMW',
  audi: 'Audi',
  mercedes: 'BMW', // Similar code schemes
  'mercedes-benz': 'BMW',
  benz: 'BMW',
  porsche: 'Audi', // Audi group
  skoda: 'Volkswagen', // VW group
};

/**
 * Normalize user input or vPIC make name to canonical form.
 * Returns the database key (e.g., "Honda", "Ford", or "GENERIC" if not found).
 */
export function normalizeMake(input: string): string {
  if (!input) return 'GENERIC';

  const lower = input.toLowerCase().trim();

  // First try direct alias match
  const aliased = MAKE_ALIASES[lower];
  if (aliased) return aliased;

  // If not found, try to extract the make from a label like "2014 Honda Accord"
  // Skip numeric and common words, look for the first known make
  const words = lower.split(/\s+/);
  for (const word of words) {
    // Skip numbers and common words
    if (/^\d+$/.test(word) || ['the', 'and', 'or'].includes(word)) continue;

    const aliased = MAKE_ALIASES[word];
    if (aliased) return aliased;
    // Try capitalizing and checking against database directly
    const capitalized = capitalize(word);
    if (DTC_MEANINGS[capitalized]) return capitalized;
  }

  // Fallback: capitalize first non-numeric word
  for (const word of words) {
    if (!/^\d+$/.test(word)) {
      return capitalize(word);
    }
  }

  return 'GENERIC';
}

/**
 * Capitalize first letter of string.
 */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Look up DTC meaning for a specific code and make.
 * Tries make-specific first, falls back to generic.
 * Returns DtcMeaning or undefined (caller defers to structural decode).
 */
export function describeDtcByMake(code: string, make?: string): DtcMeaning | undefined {
  if (!code) return undefined;
  if (!make) {
    // No make provided; return generic if available
    return DTC_MEANINGS.GENERIC[code];
  }

  const normalized = normalizeMake(make);
  const meanings = DTC_MEANINGS[normalized];

  if (meanings && meanings[code]) {
    return meanings[code];
  }

  // Fallback to generic if make-specific not found
  return DTC_MEANINGS.GENERIC[code];
}
