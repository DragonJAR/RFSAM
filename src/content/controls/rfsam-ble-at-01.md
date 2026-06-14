---
id: RFSAM-BLE-AT-01
title: Live connection hijacking
protocol: BLE
layer: AT
criticality: critical
applicability:
  - BLE
intro: >-
  An unencrypted BLE connection can be taken over: the attacker follows the
  connection's channel hopping, then transmits as the master, evicting the
  legitimate central and gaining full control of the peripheral. RFSAM owns the
  PHY-layer prerequisite — following the hop sequence well enough to inject —
  while the link-layer injection and forced-disconnection findings are assessed
  under BSAM (BSAM-AP-06, BSAM-AU-03, BSAM-EN-01).
attacks:
  - name: InjectaBLE
    refs: []
    note: 'Cayre et al., 2021'
    summary: >-
      Injects malicious packets into an established BLE connection by exploiting
      the predictability of the connection event timing, leading to hijacking of
      either central or peripheral role. The canonical reference for connection
      injection.
  - name: BtleJack
    refs: []
    note: 'Cauquil, DEF CON 26'
    summary: >-
      Sniffs, jams and hijacks BLE connections using low-cost hardware;
      established the practical hijack-by-following-the-hop-sequence technique
      this control verifies.
  - name: BLESA
    refs: []
    note: CVE-2020-9770
    summary: >-
      Spoofing attack abusing the optional reconnection authentication: many
      stacks do not require re-authentication on reconnect, allowing a hijacker
      that forces a reconnect to impersonate the peer.
references: []
bsam:
  - BSAM-AP-06
  - BSAM-AU-03
  - BSAM-EN-01
resources:
  - RFSAM-RES-04
  - RFSAM-RES-06
reviewStatus: stub
confidence: low
---
## Mechanism

Connection hijacking follows the hop sequence of an established connection, stabilises over several connection events, then injects link-layer traffic as the master role. The original central desynchronises and is evicted; the peripheral now answers to the attacker. Because no pairing key is needed when the link is unencrypted, Just-Works/unencrypted devices have no cryptographic barrier to this. The clean operational pattern is hijack → terminate → reconnect: rather than fight the phone for the link, send LL_TERMINATE_IND as the new master, let the device re-advertise, and reconnect for full, uncontested GATT control.

## Procedure

1. Sniff the target connection and learn the control handle and command format from legitimate traffic (RFSAM-RES-04).
2. Stabilise following over N connection events, then hijack the master role (RFSAM-RES-06).
3. Verify takeover by writing the learned command and observing device response.
4. Optionally terminate (LL_TERMINATE_IND) and reconnect cleanly for full GATT access.
5. Document the desynchronisation of the original central.

## Field case

Against the ELK-BLEDOM LED controller: sniffing the vendor app setting a colour revealed handle 0x000E with format 7e 07 05 RR GG BB 10 ef. After hijacking the live connection (DATA→CENTRAL), writing `w 0x000e 7e 07 05 03 ff 00 00 10 ef` drove the strip to the attacker's colour. The same technique applies unchanged to locks and medical devices — the LED strip is merely the harmless, vivid demonstration. A real implementation detail: the decoder's current Access Address must be set to the connection AA only after reaching CENTRAL (with a flush first), because advertisements seen during INITIATING reset it to the advertising AA and silently break data-PDU decoding.

## Remediation

Encrypt the link with LE Secure Connections — this defeats following, injection, and hijacking. Add application-layer command authentication so a hijacked link still cannot issue trusted commands. Treat the link as untrusted by default.
