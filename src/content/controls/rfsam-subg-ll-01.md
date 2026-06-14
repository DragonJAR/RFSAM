---
id: RFSAM-SUBG-LL-01
title: Fixed-code replay and brute force
protocol: SUBG
layer: LL
criticality: high
applicability:
  - fixed-code remotes
  - gates
  - garages
  - alarms
intro: >-
  Fixed-code devices transmit the same code every time. Once captured it can be
  replayed indefinitely, and because the keyspace is often tiny, it can
  frequently be brute-forced outright — no capture needed.
attacks:
  - name: OpenSesame
    refs: []
    note: 'Samy Kamkar, DEF CON 23 (2015)'
    summary: >-
      Brute-forces fixed-code garages/gates in seconds by emitting a De Bruijn
      sequence that overlaps every possible code, slashing the bits needed
      versus naive brute force. Built on a $12 Mattel IM-ME toy (CC1110).
  - name: Fixed-code replay
    refs: []
    note: general ISM practice
    summary: >-
      Capturing and re-transmitting the single static code opens the device
      indefinitely — the baseline failure of non-rolling remotes.
references: []
resources:
  - RFSAM-RES-15
reviewStatus: stub
confidence: low
---
## Mechanism

A large installed base of gates, garages, barriers and cheap alarms uses fixed codes set by DIP switches or a one-time-programmed ID. Capturing one transmission and replaying it opens the device forever. Worse, the keyspace is often small (8–12 DIP switches), and Ossmann's OpenSesame work showed the brute-force time can be collapsed dramatically using a De Bruijn sequence — sending overlapping codes so every possible code is emitted in the shortest possible bitstream, opening 'virtually any fixed-code garage in seconds.' This control tests for replayability and brute-force feasibility.

## Procedure

1. Capture one transmission and replay it (YARD Stick One/rfcat or HackRF) to confirm the device accepts replays.
2. Determine the code length / keyspace (DIP switches, ID bits).
3. Where the keyspace is small, test a De Bruijn-sequence brute force (OpenSesame technique) and measure time-to-open.
4. Record whether the device has any replay or rate-limiting defence.

## Field case

Kamkar's OpenSesame opened virtually any fixed-code garage in seconds using a De Bruijn sequence on a child's toy — the canonical demonstration that a fixed-code remote's small keyspace is its undoing. In an audit, confirming a single captured code replays, then measuring brute-force time against the keyspace, quantifies exactly how exposed the device is.

## Remediation

Replace fixed-code remotes with rolling/hopping-code systems (Security+, Intellicode) at minimum. Better, move to authenticated, cryptographically rolling schemes. Add receiver-side rate limiting to slow brute force.
