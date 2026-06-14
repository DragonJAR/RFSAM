---
id: RFSAM-LORA-PHY-01
title: Soft-decision demodulation of LoRa symbols
protocol: LORA
layer: PHY
criticality: info
applicability:
  - LoRa
  - LoRaWAN
intro: >-
  Recovering LoRa bits reliably at low SNR requires soft-decision demodulation.
  Hard-decision (nearest-bin) decoding throws away confidence information and
  loses frames at the edge of the link budget.
attacks: []
references: []
resources:
  - RFSAM-RES-07
reviewStatus: stub
confidence: low
---
## Mechanism

After de-chirping, each symbol maps to a frequency bin. Hard-decision decoding picks the strongest bin and emits 1/0; near the noise floor this is brittle. Soft-decision decoding keeps the per-bin likelihoods and feeds them to error correction, recovering frames a hard decoder drops — measurably better BER at the same SNR. This control confirms the demodulation path is soft-decision so that link-layer capture (RFSAM-LORA-LL-01) is not silently lossy.

## Procedure

1. Demodulate a captured channel with hard-decision decoding; record frame yield.
2. Repeat with soft-decision decoding (e.g. gr-lora_sdr).
3. Compare frame yield / BER at equal SNR.
4. Adopt soft-decision for all subsequent LoRaWAN capture.

## Field case

On the same captured LoRa channel, soft-decision decoding (gr-lora_sdr) recovers roughly 25% more bits at equivalent BER than hard-decision — frames that a nearest-bin decoder silently loses at the edge of the link budget. For a passive survey aiming to enumerate a network, that 25% is the difference between seeing a device and missing it.

## Remediation

Auditor-side. Use a soft-decision LoRa demodulator for assessment; treat hard-decision-only yields as a lower bound, not a complete picture.
