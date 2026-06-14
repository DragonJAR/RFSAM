---
id: RFSAM-SUBG-SP-01
title: Band sweep and signal discovery
protocol: SUBG
layer: SP
criticality: info
applicability:
  - 315 MHz
  - 433.92 MHz
  - 868 MHz
  - 915 MHz ISM
intro: >-
  Sub-GHz ISM is where most remotes, sensors, alarms and key fobs live. The
  first step is finding the carrier: which ISM band, what modulation, what burst
  structure — usually with a wideband SDR to discover, then a cheap CC1101-class
  transceiver to work it.
attacks: []
references: []
resources:
  - RFSAM-RES-01
  - RFSAM-RES-15
reviewStatus: stub
confidence: low
---
## Mechanism

Unlicensed ISM activity clusters at 315 MHz (North America remotes), 433.92 MHz (global remotes/sensors), 868 MHz (Europe) and 915 MHz (North America). Devices are typically simple: OOK/ASK or 2-FSK bursts keyed by a microcontroller, often with no carrier sense and no encryption. The discovery workflow Michael Ossmann formalised as 'Rapid Radio Reversing' is the model: use a wideband SDR (HackRF) to find and characterise the signal, then drop to a CC1101-based tool (YARD Stick One + rfcat) to receive and transmit at the right bitrate. This control locates the carrier, identifies the band/modulation, and records the burst timing so later controls can demodulate it.

## Procedure

1. Sweep the candidate ISM bands (315/433/868/915 MHz) with a wideband SDR while triggering the target device.
2. Capture the burst to I/Q; note centre frequency, bandwidth and on-off keying vs frequency-shift.
3. Estimate the symbol/bit rate from the shortest pulse.
4. Configure a CC1101-class radio (YARD Stick One/rfcat) with those layer-1 parameters to receive.

## Field case

Ossmann's own SimpliSafe work is the template: HackRF One to monitor the keypad transmissions and characterise the signal, then YARD Stick One with rfcat to receive and replay at the correct layer-1 settings — no vendor hardware, no physical proximity. The same discover-then-work-it flow applies to any garage remote, TPMS sensor, or 433 MHz weather station.

## Remediation

Discovery/capability baseline. The finding it sets up: any device transmitting unauthenticated OOK/FSK bursts in the clear (most cheap ISM remotes) is replayable or forgeable once characterised.
