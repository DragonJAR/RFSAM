---
id: RFSAM-BLE-SP-01
title: Channel map and capture feasibility
protocol: BLE
layer: SP
criticality: info
applicability:
  - BLE
intro: >-
  Before any analysis, establish whether the BLE channels of interest can
  actually be observed with the available hardware. BLE spreads across 40
  channels over 80 MHz with frequency hopping every 7.5 ms — wider than most
  affordable SDRs can capture at once.
attacks: []
references: []
resources:
  - RFSAM-RES-01
  - RFSAM-RES-02
reviewStatus: stub
confidence: low
---
## Mechanism

BLE occupies 2.400–2.480 GHz: 3 primary advertising channels (37, 38, 39 at 2402, 2426, 2480 MHz) and 37 data channels. Connections hop across the data channels following a map negotiated at connection time. A receiver that sees only a 20 MHz slice (e.g. a HackRF One) cannot observe all three advertising channels simultaneously, nor follow a hopping connection without either channel-following logic or full-band capture. This control records the observable bandwidth, the hopping interval, and therefore which later controls are reachable with the current setup.

## Procedure

1. Identify the receiver's usable instantaneous bandwidth (HackRF ≈ 20 MHz, USRP B210 ≈ 56 MHz, bladeRF 2.0 ≈ 61 MHz).
2. Confirm whether the full 80 MHz BLE band can be captured in one pass or must be tuned/channelised.
3. If full-band capture is not possible, determine whether the toolchain can follow the connection's hop sequence (see RFSAM-RES-02).
4. Record the gap: which advertising/data channels are observable simultaneously.

## Field case

With a HackRF One (20 MHz) only one advertising channel is visible at a time; the three advertising channels span 78 MHz, so simultaneous capture is impossible. Tuning to 2402 MHz still reliably catches channel 37 advertisements, which is enough for discovery (RFSAM-BLE-LL-01) but not for following a live connection. A USRP B210 or bladeRF covers ~56–61 MHz, enough to channelise most of the band with GPU assistance (RFSAM-RES-03).

## Remediation

Not a device finding — this is an auditor-capability baseline. Document the hardware envelope so later results are interpreted correctly (a 'not observed' is not a 'not present').
