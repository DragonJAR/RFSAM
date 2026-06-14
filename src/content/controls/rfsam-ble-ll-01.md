---
id: RFSAM-BLE-LL-01
title: Sensitive data in advertising packets
protocol: BLE
layer: LL
criticality: medium
applicability:
  - BLE
intro: >-
  BLE advertising packets are transmitted in the clear and readable by any
  passive observer. Manufacturer-specific data, device names, and service UUIDs
  frequently leak product identity, user identity, or trackable identifiers. The
  link-layer judgement of what counts as over-exposure is BSAM's
  (BSAM-DI-03/04); RFSAM adds the SP-layer capture that produces the beacons to
  inspect.
attacks:
  - name: BLE device fingerprinting / tracking
    refs: []
    note: 'Becker et al., PETS 2019'
    summary: >-
      Even with address randomisation, identifying information in advertising
      payloads (manufacturer data, GATT signatures) allows passive tracking —
      the leak this control inventories.
references: []
bsam:
  - BSAM-DI-04
  - BSAM-DI-03
resources:
  - RFSAM-RES-04
reviewStatus: stub
confidence: low
---
## Mechanism

Advertising data (AdvData) carries AD structures including the complete/shortened local name, service UUIDs, and Manufacturer Specific Data (type 0xFF). None of this requires a connection or pairing to read. Device names often embed product model or even user-chosen labels; manufacturer data may embed serial numbers or rotating-but-linkable tokens. This control captures advertisements and inventories every field for sensitive or identity-bearing content.

## Procedure

1. Passively capture advertisements on channels 37/38/39 (see RFSAM-RES-04).
2. Parse all AD structures: local name, service UUIDs, Manufacturer Specific Data (0xFF).
3. Flag human-meaningful names, embedded serials, and non-rotating identifiers.
4. Cross-reference manufacturer ID against the Bluetooth Assigned Numbers list.

## Field case

In a passive sweep of an ordinary room, advertisers surfaced human-readable names exposing device class and ownership directly in the clear: a pet tracker advertising as 'PwnPet_C81F', an asset tracker as 'TRKM_608015814_7795', and several earbuds/wearables broadcasting model strings. No connection was made — the identity leak is in discovery alone.

## Remediation

Use generic, non-identifying device names. Move model/serial data behind an authenticated connection. Avoid placing any stable identifier in Manufacturer Specific Data.
