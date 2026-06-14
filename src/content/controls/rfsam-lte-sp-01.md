---
id: RFSAM-LTE-SP-01
title: 'Operator, band and cell identification'
protocol: LTE
layer: SP
criticality: info
applicability:
  - LTE
intro: >-
  LTE assessment begins by identifying which operator, band and physical cell to
  observe. The correct EARFCN and PCI must be established before any capture is
  meaningful.
attacks: []
references: []
resources:
  - RFSAM-RES-08
reviewStatus: stub
confidence: low
---
## Mechanism

An LTE deployment is a grid of cells, each on a downlink EARFCN with a Physical Cell Identity (PCI, 0–503). Before capturing, the auditor must establish the operators present, their bands, and the EARFCNs/PCIs of nearby cells. This is doable with a scanning modem plus cell-search software, and it scopes every later LTE control. This control records the operator/band/EARFCN/PCI inventory of the environment.

## Procedure

1. Scan the cellular bands with a capable modem to list operators and EARFCNs.
2. Run cell search to recover PCI from PSS/SSS for each cell.
3. Record operator ↔ band ↔ EARFCN ↔ PCI mapping.
4. Select target cells and confirm they are within the SDR's capture envelope.

## Field case

A scan in Mexico surfaced 5 cells, 4 of them sniffable: Telcel on B4/B66/B5 and AT&T on B2, with real PCIs (58 / 287 / 301) and measured EARFCNs. Knowing operator, band and EARFCN is the prerequisite — without it, capture is aimed at nothing.

## Remediation

Environmental baseline, not a device finding. Documents scope and target selection for the LTE assessment.
