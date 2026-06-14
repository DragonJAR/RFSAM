---
id: RFSAM-BLE-CR-01
title: Unencrypted / Just-Works access to GATT
protocol: BLE
layer: CR
criticality: high
applicability:
  - BLE
intro: >-
  If a peripheral exposes its GATT services without requiring pairing or
  encryption, any nearby device can read and write characteristics. 'Just-Works'
  pairing provides no MITM protection and is, for assessment purposes,
  equivalent to no barrier. The pairing/encryption/service-access controls
  themselves are BSAM's (BSAM-PA, BSAM-EN, BSAM-SE); RFSAM reaches them once the
  device is captured and connected, and adds the cross-layer observation that
  link encryption does not imply per-characteristic authorisation.
attacks:
  - name: KNOB
    refs: []
    note: CVE-2019-9506
    summary: >-
      Forces encryption-key negotiation down to 1 byte of entropy, making the
      link brute-forceable. Assessed in depth under BSAM-EN-03.
  - name: BIAS
    refs: []
    note: 'Antonioli et al., IEEE S&P 2020'
    summary: >-
      Impersonation during authentication: the attacker poses as a
      previously-paired device without the link key, exploiting role-switch and
      legacy authentication. Tests the 'authenticated pairing' assumption.
  - name: SweynTooth — Zero LTK Installation
    refs: []
    note: CVE-2019-19194
    summary: >-
      Forces an encryption setup with a zero-filled Long Term Key, fully
      bypassing LE Secure Connections on affected Telink/other SoCs. Directly
      attacks the barrier this control checks for.
references: []
bsam:
  - BSAM-PA-01
  - BSAM-PA-04
  - BSAM-PA-05
  - BSAM-EN-02
  - BSAM-SE-03
resources:
  - RFSAM-RES-04
  - RFSAM-RES-05
reviewStatus: stub
confidence: low
---
## Mechanism

The strongest practical barrier in BLE is LE Secure Connections with authenticated pairing. Devices that accept connections and serve readable/writable GATT characteristics without encryption — or that only offer Just-Works (numeric association with no out-of-band or passkey check) — expose their entire attack surface to any peer. Crucially, link-layer encryption alone is insufficient: a device may negotiate LESC yet still leave individual characteristics writable without authentication. This control connects, enumerates GATT, and records which characteristics are accessible without a cryptographic barrier.

## Procedure

1. Connect to the peripheral without initiating pairing.
2. Enumerate the GATT table; attempt reads on all readable characteristics.
3. Identify writable characteristics reachable without encryption/authentication.
4. Record whether the device rejects, permits, or only offers Just-Works pairing.
5. Note any device that negotiates LESC but still exposes unauthenticated writable handles.

## Field case

An audit-on-discovery sweep of 85 devices flagged 6 as VULNERABLE: GATT readable and writable with no pairing or encryption. Writable-handle counts ranged from 1 to 16 per device. One device (5D:C4:...:17) had negotiated LE Secure Connections with MITM and still left 4 characteristics writable without authentication — proving that link encryption ≠ application authorisation, and echoing the SweynTooth Zero-LTK class where 'secure' pairing is bypassable. The ELK-BLEDOM LED controller exposed control handle 0x000E directly, making it the safe demonstration target.

## Remediation

Require LE Secure Connections with authenticated pairing AND enforce a minimum encryption key size (defeats KNOB). Verify the SoC is patched against SweynTooth Zero-LTK. Enforce per-characteristic authorisation independently of link encryption. Reject legacy and Just-Works pairing for any device exposing control surfaces.
