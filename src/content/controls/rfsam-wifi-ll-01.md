---
id: RFSAM-WIFI-LL-01
title: Management-frame exposure and deauthentication
protocol: WIFI
layer: LL
criticality: medium
applicability:
  - '802.11'
intro: >-
  Unless Management Frame Protection (802.11w) is enforced, 802.11 management
  frames are unauthenticated. Deauthentication frames can be forged to
  disconnect clients at will — enabling DoS and forcing handshake captures.
attacks:
  - name: Deauthentication DoS
    refs: []
    note: 802.11 management-frame design; mitigated by 802.11w
    summary: >-
      Forged deauth frames disconnect clients arbitrarily. Used both as DoS and
      to force handshake capture. Defeated only by enforced PMF.
  - name: Evil Twin / KARMA
    refs: []
    note: well-established AP-impersonation class
    summary: >-
      A rogue AP cloning a known SSID lures clients whose probe lists reveal
      remembered networks — the WiFi Pineapple's signature capability.
references: []
resources:
  - RFSAM-RES-11
  - RFSAM-RES-12
reviewStatus: stub
confidence: low
---
## Mechanism

Beacons, probe requests/responses, association and deauthentication frames are sent in the clear and, without 802.11w (PMF), are unauthenticated. An attacker forges deauth frames to evict clients (DoS) or to force a reconnection whose 4-way handshake can be captured for offline cracking. Probe requests also leak the SSIDs a client has previously joined, enabling tracking and evil-twin targeting. This control captures management frames, tests deauth susceptibility, and inventories the SSID/identity leakage.

## Procedure

1. Capture beacons and probe requests; inventory broadcast SSIDs and client probe lists.
2. Check whether the AP advertises/enforces 802.11w (PMF).
3. If PMF is absent, test a targeted deauth and confirm client disconnection (authorised scope only).
4. Record SSID leakage usable for evil-twin / tracking.

## Field case

A passive capture inventories every broadcast SSID and the probe-request history of nearby clients (the networks each device remembers). With a WiFi Pineapple this directly seeds an evil-twin AP; with an ALFA adapter a single forged deauth (where PMF is absent) evicts a client and forces the 4-way handshake needed for RFSAM-WIFI-CR-01. A Minino with GPS logs the same survey geographically for wardriving.

## Remediation

Enforce 802.11w (Protected Management Frames). Disable SSID auto-join on clients where feasible and avoid hidden-SSID 'security by obscurity', which worsens probe leakage.
