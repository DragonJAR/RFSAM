---
id: RFSAM-WIFI-SP-01
title: 'Band, channel and monitor-mode capture feasibility'
protocol: WIFI
layer: SP
criticality: info
applicability:
  - 802.11 b/g/n
  - 802.11 ac/ax
intro: >-
  Wi-Fi assessment depends on a radio that can enter monitor mode and inject on
  the target band. 2.4 GHz is universally reachable; 5 and 6 GHz need a capable
  chipset. This control establishes which channels are observable and whether
  injection is possible before any attack.
attacks: []
references: []
resources:
  - RFSAM-RES-11
reviewStatus: stub
confidence: low
---
## Mechanism

802.11 spans 2.4 GHz (14 channels), 5 GHz (many channels, DFS-restricted), and 6 GHz (Wi-Fi 6E). Assessment requires an adapter whose chipset supports monitor mode (passive capture of all frames) and, for active controls, frame injection. Not every adapter does both on every band — the classic ALFA AWUS036ACH (RTL8812AU) covers 2.4/5 GHz with injection; many built-in cards cannot inject at all. This control records the adapter capability and the channel survey so later controls are scoped honestly: a 'not seen' on an unsupported band is a capability gap, not an all-clear.

## Procedure

1. Identify the adapter chipset and confirm monitor-mode + injection support (e.g. aireplay-ng --test).
2. Survey 2.4/5/6 GHz for APs and channels in scope.
3. Record which bands the hardware can capture and inject on.
4. Note DFS/regulatory channels that may be unobservable.

## Field case

An ALFA AWUS036ACH (RTL8812AU) in monitor mode covers 2.4 and 5 GHz with reliable injection — the de facto reference adapter. An Electronic Cats Minino (ESP32-C6) covers 2.4 GHz Wi-Fi alongside BLE/Zigbee/Thread and integrates GPS for wardriving, making it a compact survey-and-locate tool. Confirming injection up front avoids the common failure of reporting 'no handshake captured' when the adapter simply could not transmit the deauth.

## Remediation

Auditor-capability baseline, not a device finding. Document the adapter envelope so band coverage is interpreted correctly.
