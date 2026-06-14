---
id: RFSAM-SUBG-AT-01
title: Jamming and denial of service
protocol: SUBG
layer: AT
criticality: high
applicability:
  - alarms
  - sensors
  - remotes
  - ISM links
intro: >-
  Because most ISM devices have no carrier-sense and no jamming detection, a
  continuous or targeted transmission on their frequency silences them —
  suppressing alarm sensors, blocking remotes, or enabling the jam half of
  jam-and-replay.
attacks:
  - name: Sensor/alarm jamming
    refs: []
    note: well-documented ISM weakness
    summary: >-
      Suppressing an unauthenticated sensor's transmission prevents alarm events
      from reaching the panel; many systems lack jam/supervision detection, so
      the suppression is silent.
  - name: Jam-and-replay enabler
    refs: []
    note: RollJam primitive
    summary: >-
      Targeted jamming of the receiver is the prerequisite half of
      jam-and-capture attacks against rolling-code remotes (RFSAM-SUBG-CR-01).
references: []
resources:
  - RFSAM-RES-15
reviewStatus: stub
confidence: low
---
## Mechanism

Sub-GHz ISM links are typically simplex and unauthenticated, with no listen-before-talk. A transmitter on the target frequency drowns the legitimate signal: a door/window alarm sensor's 'open' event never reaches the panel, a remote's command never lands, a TPMS or telemetry link goes dark. Jamming is also the enabling primitive for RollJam-class attacks (jam the receiver, capture the fob). This control tests whether the target detects or tolerates jamming and what the security impact of suppression is. Note: transmitting to jam is legally restricted in most jurisdictions and must be confined to a shielded/authorised environment.

## Procedure

1. Identify the exact operating frequency and bandwidth (RFSAM-SUBG-SP-01).
2. In an authorised/shielded setup, transmit narrowband noise on the frequency and observe device behaviour.
3. Determine whether the receiver detects jamming or supervises link health (e.g. alarm 'tamper'/'supervision' signalling).
4. Assess security impact: can a sensor event be suppressed without alerting the panel?

## Field case

An alarm contact sensor that fires a one-way 433 MHz 'opened' burst with no acknowledgement and no supervision can be silenced by jamming its frequency during entry — the panel simply never hears the event. Whether the system raises a 'supervision lost' condition is the dividing line between a robust and a defeatable installation.

## Remediation

Use supervised links that alarm on loss of periodic check-in and on detected jamming. Prefer frequency-agile or spread-spectrum links over single-frequency OOK. Treat any safety-critical sensor on an unauthenticated simplex ISM link as suppressible.
