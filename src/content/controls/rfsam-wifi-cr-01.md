---
id: RFSAM-WIFI-CR-01
title: WPA/WPA2/WPA3 handshake capture and key recovery
protocol: WIFI
layer: CR
criticality: high
applicability:
  - WPA2-PSK
  - WPA3-SAE
  - WPS
intro: >-
  WPA2-PSK networks are exposed to offline cracking via 4-way-handshake or
  clientless PMKID capture; WPS adds an online PIN-recovery path; even WPA3 has
  downgrade and DoS exposure. This control captures the relevant material and
  assesses key-recovery feasibility.
attacks:
  - name: KRACK
    refs: []
    note: 'CVE-2017-13077 … 13088 (Vanhoef & Piessens, 2017)'
    summary: >-
      Key Reinstallation Attack: replaying handshake message 3 forces nonce
      reuse, breaking WPA2 packet confidentiality. Affected effectively all WPA
      implementations until patched.
  - name: Kr00k
    refs: []
    note: 'CVE-2019-15126 (ESET, 2020)'
    summary: >-
      Broadcom/Cypress chips encrypt buffered frames with an all-zero key after
      disassociation, letting an attacker decrypt them. Affected billions of
      devices (Echo, iPhone, RPi 3, Asus/Huawei APs).
  - name: PMKID clientless capture
    refs: []
    note: 'hashcat team, 2018'
    summary: >-
      RSN PMKID in the first handshake message lets the PSK hash be captured
      from the AP alone — no client, no deauth — then cracked offline (hashcat
      mode 22000).
  - name: WPS Pixie Dust
    refs: []
    note: 'Bongard, 2014'
    summary: >-
      Weak E-S1/E-S2 nonce generation on many chipsets lets the WPS PIN be
      recovered offline near-instantly, yielding the PSK.
  - name: Dragonblood
    refs: []
    note: 'Vanhoef & Ronen, 2019'
    summary: >-
      Side-channel and downgrade flaws in WPA3-SAE; combined with
      transitional-mode downgrade, reduces many 'WPA3' networks to WPA2 attack
      surface.
  - name: FragAttacks
    refs: []
    note: 'Vanhoef, 2021'
    summary: >-
      Design and implementation flaws in 802.11 frame aggregation/fragmentation
      allowing injection and exfiltration across WPA/WPA2/WPA3.
references: []
resources:
  - RFSAM-RES-11
  - RFSAM-RES-12
reviewStatus: stub
confidence: low
---
## Mechanism

WPA2-PSK security reduces to passphrase strength once a handshake is captured — and since 2018 the PMKID attack lets an auditor capture the needed material from the AP alone, with no connected client and no deauth noise. WPS, still widely enabled, validates its 8-digit PIN in two halves with no lockout on many APs, cutting brute-force to ~11,000 guesses; Pixie Dust recovers the PIN almost instantly on chipsets with weak E-S1/E-S2 nonces. WPA3-SAE resists offline cracking, but transitional/mixed-mode networks downgrade to WPA2 for legacy clients, and Dragonblood-class flaws plus Dragon-Drain DoS apply. This control captures handshake/PMKID/WPS data and assesses each path.

## Procedure

1. Attempt clientless PMKID capture from the AP (RFSAM-RES-12).
2. If a client is present, capture the 4-way handshake (optionally forcing it via deauth where authorised).
3. Check WPS status; test Pixie Dust and PIN brute-force feasibility.
4. For WPA3, check for transitional mode and MFP enforcement (downgrade exposure).
5. Run offline cracking against captured material to assess passphrase strength.

## Field case

On a target WPA2-PSK AP, a clientless PMKID capture with an ALFA adapter takes under a minute walking past, with the crack run later at the desk — no deauth, no client needed. Where WPS is left enabled (common on consumer routers), Pixie Dust often recovers the PIN, and thus the PSK, in seconds regardless of passphrase strength. A 'WPA3' network in transitional mode still presents the full WPA2 surface to any legacy client.

## Remediation

Use a long, high-entropy passphrase (defeats offline cracking). Disable WPS entirely. Deploy WPA3 in non-transitional mode with PMF enforced. Patch APs and clients against KRACK/Kr00k/FragAttacks; prefer enterprise (802.1X) auth for sensitive networks.
