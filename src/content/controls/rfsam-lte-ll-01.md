---
id: RFSAM-LTE-LL-01
title: Passive control-channel decode and identifier exposure
protocol: LTE
layer: LL
criticality: high
applicability:
  - LTE
intro: >-
  LTE control channels (PDCCH) and broadcast information are decodable
  passively. Blind decoding reveals scheduling, RNTIs, and — depending on
  configuration — identity information, all without transmitting.
attacks:
  - name: IMSI catching / False Base Station
    refs: []
    note: 'Yu et al., ''LTE Phone Number Catcher'', 2019; NIST 2025'
    summary: >-
      A rogue eNodeB induces UEs to disclose IMSI (and via MSISDN translation,
      phone number) because identity is sent before ciphering and broadcast
      messages lack integrity protection. Built from COTS SDR.
  - name: aLTEr
    refs: []
    note: 'Rupprecht et al., IEEE S&P 2019'
    summary: >-
      User-plane data is encrypted with AES-CTR but not integrity-protected, so
      it is malleable: an active MITM redirects DNS by bit-flipping ciphertext
      without breaking encryption. Exploits the same integrity gap visible in
      passive analysis.
  - name: LTEInspector
    refs: []
    note: 'Hussain et al., NDSS 2018'
    summary: >-
      Systematic adversarial testing of LTE attach/paging/detach procedures,
      surfacing authentication-relay, paging-channel hijack and DoS flaws — the
      procedural attacks downstream of the passive view this control builds.
  - name: ReVoLTE
    refs: []
    note: 'Rupprecht et al., USENIX Security 2020'
    summary: >-
      Keystream reuse across VoLTE calls on the same radio bearer allows
      decryption of an encrypted call by capturing a subsequent call — a
      keystream-reuse flaw in the radio layer.
references: []
resources:
  - RFSAM-RES-08
  - RFSAM-RES-10
reviewStatus: stub
confidence: low
---
## Mechanism

The PDCCH carries downlink control information (DCI) addressed by RNTIs; decoding it is a blind search over candidate locations, validated by CRC masked with the RNTI. A passive receiver that recovers the grid (RFSAM-LTE-PHY-01) can follow scheduling and enumerate active RNTIs per cell, building a picture of cell load and activity. Combined with broadcast SIBs and paging, this exposes operational metadata and, in some conditions, subscriber-identity exposure paths. This control performs passive PDCCH/broadcast decode and inventories what identity and scheduling information is recoverable.

## Procedure

1. From the recovered grid, run blind PDCCH decode (search space → candidate → Viterbi → CRC⊕RNTI).
2. Enumerate active RNTIs and observed DCI per subframe.
3. Decode broadcast SIBs and paging for cell configuration and identity exposure.
4. Record which identifiers and scheduling data are recoverable purely passively.

## Field case

Following PSS → MIB → DCI → PDSCH in strict order, passive blind decode of the PDCCH typically searches up to ~44 candidates per subframe per active cell, validating each by CRC masked with the candidate RNTI. The result is a passive view of cell scheduling and active RNTIs — operational metadata extracted without transmitting, using only open-source tooling (LTESniffer / FALCON class) on a coherent SDR.

## Remediation

Largely an operator/standard concern: passive control-channel exposure is inherent to LTE. Mitigations live in the standard (identity protection, paging changes) and in 5G's improved identifier confidentiality; for assessment, the control documents the exposure rather than a device fix.
