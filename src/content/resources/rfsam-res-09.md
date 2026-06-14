---
id: RFSAM-RES-09
title: Coherent capture with a disciplined reference
---
Lock the SDR to a GPSDO; confirm clock rate and register loopback. Validate the host can sustain the sample rate (host I/O can cause MIB-decode failures even when the SDR is fine). Coherence is mandatory for OFDM grid recovery.
