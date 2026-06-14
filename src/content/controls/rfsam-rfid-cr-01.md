---
id: RFSAM-RFID-CR-01
title: MIFARE Classic Crypto1 key recovery
protocol: RFID
layer: CR
criticality: high
applicability:
  - MIFARE Classic
  - MIFARE Plus (SL1)
intro: >-
  MIFARE Classic's proprietary Crypto1 cipher (48-bit key) is fundamentally
  broken. Depending on the card's nonce behaviour, keys are recoverable
  card-only (no reader) or with one known key — making most MIFARE Classic
  access systems clonable.
attacks:
  - name: Darkside attack
    refs: []
    note: 'Courtois, 2009'
    summary: >-
      Card-only key recovery exploiting the Crypto1 NACK leak and nonce
      repetition — needs no prior key and no reader.
  - name: Nested attack
    refs: []
    note: 'Garcia et al., 2008'
    summary: >-
      Given one known key and a predictable PRNG, recovers remaining sector keys
      by triggering nested authentications and filtering nonce guesses via the
      parity leak.
  - name: Hardnested attack
    refs: []
    note: 'Meijer & Verdult, 2015'
    summary: >-
      Defeats hardened MIFARE Classic EV1 (truly-random nonces) using
      statistical cryptanalysis on thousands of nonces with SIMD acceleration;
      needs one known key.
  - name: FM11RF08S static-encrypted-nonce + backdoor
    refs: []
    note: 'Teuwen / Quarkslab, 2024'
    summary: >-
      Breaks the most-hardened 'static encrypted nonce' Crypto1 clones and
      documents a hardware backdoor key affecting a range of MIFARE-compatible
      cards.
  - name: mfkey32 reader-key extraction
    refs: []
    note: Proxmark/Flipper tooling
    summary: >-
      Recovers sector keys from a captured reader↔card authentication, attacking
      the reader side rather than the card.
references: []
resources:
  - RFSAM-RES-13
reviewStatus: stub
confidence: low
---
## Mechanism

Crypto1 has intrinsic, unpatchable weaknesses: a 48-bit key, an LFSR-based PRNG, a parity-bit keystream leak, and (on many cards) a NACK leak. The attack path depends on the card: the Darkside attack recovers a key card-only by exploiting NACK + nonce-repeat leaks; the Nested attack recovers further keys given one known key and a predictable PRNG; the Hardnested attack handles hardened cards (MIFARE Classic EV1) with truly-random nonces via statistical cryptanalysis. The 2024 Quarkslab research broke even the 'static encrypted nonce' variant (Fudan FM11RF08S) and found a hardware backdoor. Reader-side, mfkey32 recovers keys from a captured reader↔card exchange. This control determines the applicable attack and recovers the sector keys.

## Procedure

1. Classify PRNG/nonce behaviour (weak → darkside/nested; hard → hardnested; static-encrypted → FM11RF08S techniques).
2. Run dictionary/default-key check first (many deployments never change keys).
3. Apply the attack matching the nonce class to recover sector keys.
4. Where a reader is available, capture an authentication and recover keys with mfkey32.
5. Dump all sectors; assess whether access data (UID, sector contents) enables cloning.

## Field case

A Proxmark3 classifies the card's PRNG, runs a default-key check, then applies darkside (weak PRNG, card-only) or hardnested (EV1, one known key) to recover all sector keys — after which the card is fully dumped and clonable. Against a hardened FM11RF08S, the 2024 Quarkslab techniques (and the discovered backdoor key) still recover keys. Where only the reader is reachable, capturing one authentication and running mfkey32 yields the keys instead.

## Remediation

Migrate off MIFARE Classic to MIFARE DESFire EV2/EV3 (AES) or other audited cryptographic credentials. Never rely on UID-only checks. Where migration is impossible, add backend anti-passback/anomaly detection — but treat any Crypto1 deployment as effectively cloneable.
