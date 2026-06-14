---
id: RFSAM-BLE-PHY-01
title: Wideband channelisation under hardware limits
protocol: BLE
layer: PHY
criticality: info
applicability:
  - BLE
intro: >-
  When the band is wider than the SDR's bandwidth, the auditor must channelise:
  split a wide I/Q stream into per-channel streams. Done naively on CPU this
  collapses; the control verifies a viable channelisation path exists so that
  connection-following and full-band sniffing become possible.
attacks: []
references: []
resources:
  - RFSAM-RES-03
reviewStatus: stub
confidence: low
---
## Mechanism

Following a BLE connection across 37 data channels ideally needs the whole 80 MHz band demodulated in parallel. Splitting 80 MHz of I/Q into ~40 channels of 2 MHz melts a commodity CPU — thermal throttling and dropped samples produce silent failure (you think you are capturing, but frames are missing). A polyphase channeliser offloaded to the GPU (OpenCL / VkFFT) makes this tractable in real time. This control checks that the toolchain channelises without sample loss, because every link-layer and attack control for BLE depends on clean per-channel bits.

## Procedure

1. Capture a known advertiser while logging dropped-sample / overflow counters.
2. Run the channeliser (CPU first) and confirm whether overflows occur at full band.
3. Move channelisation to GPU (polyphase + VkFFT) and re-check counters at sustained real-time rate.
4. Validate by decoding a known advertisement on a non-primary channel.

## Field case

Dividing the 80 MHz BLE band into 40× 2 MHz channels on CPU drops samples within seconds (thermal throttling, no error raised). Offloading the polyphase channeliser to a GPU via OpenCL/VkFFT — the approach used by the ice9-bluetooth-sniffer project — sustains real-time capture of dozens of BLE channels simultaneously, moving the bottleneck from silicon to software and recovering signal ~30 dB below where a naive setup fails.

## Remediation

Auditor-side capability. If GPU channelisation is unavailable, restrict scope to advertising-channel work and declare connection-following out of scope rather than reporting false negatives.
