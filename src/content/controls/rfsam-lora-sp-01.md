---
id: RFSAM-LORA-SP-01
title: Sub-noise reception and band survey
protocol: LORA
layer: SP
criticality: info
applicability:
  - LoRa
  - LoRaWAN
intro: >-
  LoRa's chirp spread spectrum is designed to be received below the thermal
  noise floor. The auditor must confirm the toolchain can recover signals at
  strongly negative SNR before concluding a band is quiet.
attacks: []
references: []
resources:
  - RFSAM-RES-01
  - RFSAM-RES-07
reviewStatus: stub
confidence: low
---
## Mechanism

LoRa uses Chirp Spread Spectrum (CSS): a linear frequency sweep that the receiver de-chirps, integrating signal energy across the symbol and yielding processing gain. At SF12/BW125 the link closes around −148 dBm — roughly 20 dB below the thermal noise floor. A spectrum survey that only looks for energy above the noise floor will declare a busy LoRaWAN band empty. This control verifies that capture and de-chirping recover sub-noise transmissions, and surveys the ISM sub-band (US915 / EU868) for active channels.

## Procedure

1. Capture the relevant ISM sub-band (US915: 902–928 MHz; EU868) to raw I/Q.
2. Confirm the receiver's effective sensitivity reaches the SF/BW of interest (≈ −148 dBm at SF12/BW125).
3. De-chirp to recover symbols below the noise floor; verify against a known transmitter.
4. Map active channels and spreading factors present.

## Field case

Surveying US915, transmissions invisible on a plain FFT (sitting ~20–30 dB below the thermal floor) resolve cleanly after de-chirping. Establishing this processing-gain baseline is what lets a passive observer see an entire LoRaWAN deployment that a naive energy-detector would miss.

## Remediation

Auditor-capability baseline. Spread-spectrum reception is an inherent property; there is no device-side remediation — the point is to ensure the assessment does not produce false negatives.
