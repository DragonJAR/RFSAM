---
id: RFSAM-RFID-SP-01
title: 'Frequency, technology and reader/tag identification'
protocol: RFID
layer: SP
criticality: info
applicability:
  - 125 kHz LF
  - 13.56 MHz HF
  - ISO 14443A/B
  - ISO 15693
intro: >-
  RFID/NFC splits into low-frequency (125 kHz) and high-frequency (13.56 MHz)
  families with very different security. The first step is identifying the
  frequency, protocol and chip so the correct attack path applies.
attacks: []
references: []
resources:
  - RFSAM-RES-13
reviewStatus: stub
confidence: low
---
## Mechanism

LF (125 kHz) covers EM4100/HID Prox — typically no cryptography, trivially cloned. HF (13.56 MHz) covers ISO 14443A/B (MIFARE Classic/DESFire, NXP), ISO 15693, and NFC Forum types. Security ranges from none (UID-only access control) to the broken Crypto1 (MIFARE Classic) to sound AES (DESFire EV2/EV3). This control identifies the operating frequency, the protocol/standard, and the specific chip — because the entire downstream attack tree depends on it (a Crypto1 attack is meaningless against DESFire, and vice-versa).

## Procedure

1. Determine operating frequency (LF 125 kHz vs HF 13.56 MHz) with a multi-frequency reader.
2. Identify the protocol/standard (ISO 14443A/B, 15693) and chip (MIFARE Classic / Ultralight / DESFire, HID Prox, EM4100).
3. For MIFARE Classic, read the PRNG/nonce behaviour to classify weak vs hardened vs static-encrypted-nonce.
4. Record whether access control relies on UID-only (cloneable) or on cryptographic authentication.

## Field case

A Proxmark3 'hf search' / 'lf search' identifies frequency, standard and chip in one step and reports the MIFARE PRNG strength (weak/hard). An Electronic Cats BomberCat (PN7150, ISO 14443A/B, NFC Forum T4T) reads and emulates HF cards and adds MagSpoof magnetic-stripe and NFC-relay capability; a Chameleon emulates HF cards for reader-side testing. Establishing 'UID-only access control' versus 'Crypto1' versus 'DESFire AES' is the fork that decides the whole assessment.

## Remediation

Capability/scoping baseline. The finding it enables: any system relying on UID-only identification (LF Prox, MIFARE UID) is cloneable regardless of frequency and should be flagged immediately.
