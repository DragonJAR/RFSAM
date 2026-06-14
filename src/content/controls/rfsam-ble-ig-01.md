---
id: RFSAM-BLE-IG-01
title: Known vulnerabilities of the SoC and host stack
protocol: BLE
layer: IG
criticality: high
applicability:
  - BLE
  - BR/EDR
deferred: true
intro: >-
  Identifying the silicon and stack and checking them against the published
  Bluetooth vulnerability corpus is BSAM's territory and BSAM does it
  thoroughly. RFSAM defers to the BSAM Information Gathering controls here and
  does not duplicate them.
attacks:
  - name: SweynTooth
    refs: []
    note: 'Garbelini et al., 2020 — 18 vulns, e.g. CVE-2019-19194 (Zero LTK)'
    summary: >-
      Family of link-layer flaws across NXP, Cypress, Telink, Dialog, Microchip,
      STM SoCs: deadlocks, crashes, buffer overflows, and a full
      Secure-Connections bypass. Catalogued in detail by BSAM-IG-02.
  - name: KNOB
    refs: []
    note: CVE-2019-9506
    summary: >-
      Key-entropy downgrade in BR/EDR encryption negotiation. Assessed under
      BSAM-EN-03 (minimum key size) and BSAM-IG-04.
  - name: BLEEDINGBIT
    refs: []
    note: CVE-2018-16986 / CVE-2018-7080
    summary: >-
      RCE and OTA-backdoor in TI CC2640/CC2650 chips. A controller-vulnerability
      case under BSAM-IG-02.
  - name: BleedingTooth
    refs: []
    note: CVE-2020-12351 et al.
    summary: >-
      Zero-click RCE in the Linux BlueZ stack. A host-stack-vulnerability case
      under BSAM-IG-03.
references: []
bsam:
  - BSAM-IG-01
  - BSAM-IG-02
  - BSAM-IG-03
  - BSAM-IG-04
resources:
  - RFSAM-RES-04
reviewStatus: stub
confidence: low
---
## Mechanism

A large share of real-world BLE compromise is an unpatched SoC or host stack with a known, named, CVE-tracked flaw — KNOB, BIAS, the SweynTooth family (incl. the Zero-LTK Secure-Connections bypass), BLEEDINGBIT, BLURtooth, BleedingTooth. BSAM already provides mature controls for exactly this: controller lifecycle status, controller vulnerabilities, host-stack vulnerabilities, and standard vulnerabilities. RFSAM does not re-derive them. This control exists only to place that step in the RF assessment flow and route the auditor to BSAM. The named-attack corpus below is provided as orientation, not as a substitute for the BSAM controls.

## Procedure

1. Identify the SoC/controller and host stack (FCC ID, advertising fingerprint, teardown).
2. Run the BSAM Information Gathering controls (see cross-reference) against the identified components.
3. Record patch status and known-CVE exposure per the BSAM procedure.
4. Carry the result forward as scoping input to the RFSAM SP/PHY capture controls.

## Field case

Because BSAM already maps SoC and stack to their known-CVE exposure, the RFSAM flow simply runs the BSAM-IG controls at this stage and records the outcome. The value RFSAM adds is sequencing: the component inventory from this step scopes which SP/PHY capture controls are worth running (e.g. an end-of-life, unpatchable SoC may make dynamic RF testing moot — the finding is already decisive).

## Remediation

Follow the remediation of the cited BSAM-IG controls: keep firmware/stack patched, track SoC-vendor advisories and the Bluetooth SIG erratum feed, and treat end-of-life controllers with no patch path as high-risk.
