---
id: RFSAM-SUBG-CR-01
title: Rolling-code interception and replay (RollJam / RollBack)
protocol: SUBG
layer: CR
criticality: high
applicability:
  - rolling-code RKE
  - KeeLoq
  - HITAG2
  - garage/vehicle remotes
intro: >-
  Rolling codes defeat naive replay by using each code once. But jam-and-capture
  techniques, counter-resync weaknesses, and weak cipher implementations break
  them — and capturing several codes can recover the cryptographic key on some
  schemes.
attacks:
  - name: RollJam
    refs: []
    note: 'Samy Kamkar, DEF CON 23 (2015)'
    summary: >-
      Jams the receiver while capturing the fob transmission, replays an older
      captured code so the user notices nothing, and stores a still-valid fresh
      code for the attacker — defeats rolling codes on most cars, garages and
      alarms with ~$32 of hardware.
  - name: RollBack
    refs: []
    note: 'Csikor et al., USENIX/2022'
    summary: >-
      Time-agnostic replay: re-transmitting previously-captured signals in a
      specific order rolls the receiver counter back into accepting old codes,
      so captures remain usable without jamming.
  - name: KeeLoq / HITAG2 key recovery
    refs: []
    note: 'correlation attacks, multiple papers'
    summary: >-
      Capturing only a handful of rolling codes lets the cryptographic key be
      recovered on widely-deployed KeeLoq and HITAG2 schemes, allowing full
      key-fob cloning (affecting many VW Group and other vehicles).
references: []
resources:
  - RFSAM-RES-15
reviewStatus: stub
confidence: low
---
## Mechanism

Rolling-code systems (KeeLoq, HITAG2, vehicle RKE) increment a counter and authenticate each press, so a replayed old code is rejected. Three attack classes break this. RollJam (Kamkar, DEF CON 23) jams the receiver while capturing the fob's code, replays an earlier captured code to satisfy the user, and banks the fresh one for later use. RollBack (2022) is a time-agnostic replay: re-sending previously captured signals in a specific sequence rolls the counter back into an accepting state, so old captures work again — no jamming needed. And implementation-level cryptanalysis (KeeLoq correlation, the HITAG2 correlation attack) can recover the key from a handful of captured codes, fully cloning the fob. This control assesses which apply.

## Procedure

1. Reverse the frame (RFSAM-SUBG-PHY-01) and locate the rolling counter and fixed serial.
2. Test jam-and-capture (RollJam): confirm whether jamming the receiver while capturing yields a usable banked code.
3. Test sequential replay (RollBack): replay captured codes in sequence and check for counter resync acceptance.
4. Identify the cipher (KeeLoq/HITAG2) and assess key-recovery feasibility from captured codes.
5. Record any defence: tight counter windows, time bounding, challenge-response.

## Field case

RollJam is the definitive demonstration that 'rolling code' is not a synonym for 'secure': by jamming and banking codes, an attacker keeps a perpetually-fresh unlock no matter how many times the owner presses the fob. RollBack later showed many systems accept rolled-back counters via sequential replay alone. For an auditor, the key questions are whether the receiver jams-detectable, how tight its counter resync window is, and which cipher the fob uses.

## Remediation

Use authenticated challenge-response (bidirectional) rather than one-way rolling counters where possible. Enforce tight, non-resettable counter windows and detect jamming. Migrate off KeeLoq/HITAG2 to modern authenticated schemes; add time-bounding to defeat RollBack-style sequential replay.
