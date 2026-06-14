---
id: RFSAM-RES-18
title: Capture and decode Z-Wave (G.9959)
---
Z-Wave is a sub-GHz (G)FSK protocol on a regional frequency (908.42 MHz in the US, 868.42 MHz in the EU, with other regional bands). Tune an RTL-SDR or HackRF to the region's frequency and demodulate the ITU-T G.9959 frames with an SDR decoder (rtl-zwave or waving-z) to recover the Home ID, Node IDs and command classes; a Silicon Labs Zniffer on a UZB stick is the vendor path. Capture a device *inclusion* to assess S0 key transport (the network key is sent under a fixed all-zero temporary key during inclusion); S2 (Curve25519 ECDH) resists capture-the-join.
