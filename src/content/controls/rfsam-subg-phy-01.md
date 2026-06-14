---
id: RFSAM-SUBG-PHY-01
title: Demodulation and protocol reversing of an unknown signal
protocol: SUBG
layer: PHY
criticality: medium
applicability:
  - OOK/ASK
  - 2-FSK
  - Manchester
intro: >-
  Turning a captured Sub-GHz burst into bits — then into meaning — is the core
  reversing skill. Most ISM signals are OOK/ASK or 2-FSK with Manchester or PWM
  encoding, decodable with SDR tooling plus a CC1101 radio.
attacks: []
references: []
resources:
  - RFSAM-RES-15
reviewStatus: stub
confidence: low
---
## Mechanism

After capture, the signal must be demodulated (OOK: presence/absence of carrier; FSK: two tones) and the line coding recovered (Manchester, PWM, raw). Universal Radio Hacker (URH) provides an integrated workflow for this: visualise the burst, auto-detect modulation and bit rate, and extract the bitstream, then diff captures to find which bits change between button presses. The recovered frame typically splits into a preamble, a device/serial ID, a command field, and (for rolling systems) a counter. This control demodulates the signal and reverses the frame structure — the prerequisite for replay, forgery, or crypto analysis.

## Procedure

1. Load the I/Q capture into Universal Radio Hacker (or GNU Radio); identify modulation (OOK/ASK vs FSK) and bit rate.
2. Recover the line coding (Manchester/PWM/raw) and extract the bitstream.
3. Capture multiple transmissions and diff them to locate static (ID) vs changing (counter/command) fields.
4. Document the frame format: preamble, ID, command, counter, checksum.

## Field case

Universal Radio Hacker turns a raw 433 MHz garage-remote capture into a labelled bitstream in minutes: the fixed prefix is the device ID, a few bits flip per press (the command), and on rolling systems a multi-byte field increments — immediately telling you whether you're facing a fixed code (replayable) or a rolling code (needs RollJam-class technique).

## Remediation

Reversing is auditor-side. The defensive takeaway it produces: a frame whose only 'security' is an unchanging ID broadcast in the clear offers no protection — identification is not authentication.
