---
id: RFSAM-RES-19
title: GNSS signal-presence and interference survey
---
GNSS is a very weak spread-spectrum signal below the thermal-noise floor (GPS L1 C/A at 1575.42 MHz, around -130 dBm at the antenna). Use an *active* GNSS antenna and an RTL-SDR / HackRF to record L1 I/Q, then a software receiver (e.g. GNSS-SDR) to acquire satellites, read each one's carrier-to-noise (C/N0) and the navigation solution. A raised noise floor with no acquisition points to jamming; implausibly strong or uniform C/N0, a position/time jump, or many satellites at identical power are signatures of spoofing.
