---
id: RFSAM-LTE-PHY-01
title: OFDM capture with coherent timing
protocol: LTE
layer: PHY
criticality: info
applicability:
  - LTE
intro: >-
  LTE's OFDM physical layer is the wall that stops naive capture: 1200+
  subcarriers, tight timing, and a reference clock requirement. The control
  verifies the capture chain is coherent enough to demodulate the resource grid.
attacks: []
references: []
resources:
  - RFSAM-RES-08
  - RFSAM-RES-09
reviewStatus: stub
confidence: low
---
## Mechanism

LTE downlink is OFDMA — over a thousand subcarriers carrying QAM, with a cyclic prefix and strict frame/symbol timing (10 ms frame, 1 ms subframe, 0.5 ms slot). Demodulating the resource grid requires accurate frequency and timing reference; a free-running SDR clock drifts and corrupts the grid. A disciplined oscillator (GPSDO) provides the coherence. This control confirms the SDR locks to a stable reference and recovers the OFDM grid (PSS/SSS → MIB → grid) before attempting higher-layer decode.

## Procedure

1. Lock the SDR to a disciplined reference (GPSDO) and confirm clock rate.
2. Capture the target EARFCN and recover PSS/SSS timing.
3. Decode MIB from PBCH to obtain bandwidth and frame number.
4. Verify the resource grid demodulates cleanly (no timing-induced corruption).

## Field case

A 2× USRP B210 rig with GPSDO, clock locked at 23.04 MHz, passed register loopback and presented a coherent receiver ready to capture. With the reference disciplined, the OFDM grid demodulates reliably; without it, the same capture degrades into timing-corrupted symbols. (A documented field failure: MIB decode succeeded on a desktop host but failed on a NUC — a reminder that host I/O, not just the SDR, affects coherent capture.)

## Remediation

Auditor-side. Use a disciplined reference for any OFDM capture and validate the host can sustain the sample rate; otherwise report capture quality as a limiting factor.
