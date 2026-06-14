---
id: RFSAM-BLE-LL-02
title: Persistent (non-rotating) device address
protocol: BLE
layer: LL
criticality: low
applicability:
  - BLE
intro: >-
  BLE supports private resolvable addresses (RPA) that rotate to prevent
  tracking. Devices using a fixed public or static address can be followed
  across time and locations by any passive observer. The control judgement here
  is BSAM-DI-06's; RFSAM captures the advertisements that let you classify the
  address.
attacks: []
references: []
bsam:
  - BSAM-DI-06
resources:
  - RFSAM-RES-04
reviewStatus: stub
confidence: low
---
## Mechanism

A device's advertising address is either Public, Random Static, Random Private Resolvable (RPA), or Random Private Non-resolvable (NRPA). Public and Static addresses do not rotate; an observer can correlate a device's presence across sessions and physical locations purely passively. RPA/NRPA rotate and break that correlation (good hygiene). This control classifies the address type for every discovered device and flags persistent ones.

## Procedure

1. Capture advertisements and record the address and its type bits.
2. Classify each as Public / Static / RPA / NRPA.
3. Flag Public and Static as persistently trackable.
4. Note that 'rotating' protects privacy only — it does not protect against control (see attack controls).

## Field case

In the same room sweep, 33 of 85 devices advertised with non-rotating Public or Static addresses — persistently trackable across time and place. The remainder used RPA/NRPA and rotated correctly. Address hygiene and exploitability are independent: several rotating-address devices were still fully controllable (RFSAM-BLE-AT-01), and several fixed-address devices exposed nothing writable.

## Remediation

Use Random Private Resolvable addresses with a sensible rotation interval. Reserve Public addresses for devices where tracking is not a concern.
