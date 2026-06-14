---
id: RFSAM-LORA-CR-01
title: DevNonce reuse and join replay exposure
protocol: LORA
layer: CR
criticality: medium
applicability:
  - LoRaWAN
intro: >-
  LoRaWAN join security depends on DevNonce freshness. Devices that repeat
  DevNonce values across joins expose themselves to JoinRequest replay and, in
  weak implementations, session-key recovery paths.
attacks:
  - name: DevNonce birthday-paradox reuse
    refs: []
    note: 'LoRaWAN Security Survey, 2022'
    summary: >-
      In LoRaWAN 1.0.3 the DevNonce is a 16-bit device-generated value; over a
      10-year lifetime collision is near-certain (birthday paradox), and
      reboots/counter-resets cause outright reuse — enabling JoinRequest replay.
  - name: Weak RNG entropy (SX1272 RSSI-LSB)
    refs: []
    note: 'LoRaWAN Security Survey, 2022'
    summary: >-
      Low-cost nodes seed their RNG from RSSI least-significant bits with no
      health tests; the resulting DevNonce sequence is predictable and can be
      biased further by targeted RF jamming.
  - name: Join replay
    refs: []
    note: 'Na et al., ICOIN 2017'
    summary: >-
      Captured JoinRequest messages are replayed to force rejoin/denial
      conditions; cleartext joins (RFSAM-LORA-LL-01) make the capture trivial.
references: []
resources:
  - RFSAM-RES-07
reviewStatus: stub
confidence: low
---
## Mechanism

Each OTAA join should present a fresh DevNonce; the network rejects replays. Implementations that reuse or cycle DevNonce predictably (common on cheap or older stacks) allow an attacker to replay captured JoinRequests or to correlate sessions. Because JoinRequests are cleartext (RFSAM-LORA-LL-01), nonce behaviour is observable passively. This control analyses captured joins per DevEUI for nonce freshness and predictability.

## Procedure

1. Group captured JoinRequests by DevEUI.
2. Extract the DevNonce sequence per device.
3. Flag repeats, monotonic-but-predictable counters, or small nonce spaces.
4. Assess against the network's stated LoRaWAN version (1.0.x vs 1.1).

## Field case

Because the 51,304-frame capture was dominated by JoinRequests, DevNonce behaviour per device was directly observable in the clear — the prerequisite for spotting reuse. (Worked nonce-reuse case to be completed from the auditor's own per-DevEUI analysis of the capture.)

## Remediation

Use a cryptographically random or correctly monotonic DevNonce per the LoRaWAN spec; adopt 1.1 join-server protections where possible. Network-side, enforce strict DevNonce tracking and reject replays.
