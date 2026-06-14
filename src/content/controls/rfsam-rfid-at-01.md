---
id: RFSAM-RFID-AT-01
title: 'Cloning, emulation and relay attacks'
protocol: RFID
layer: AT
criticality: high
applicability:
  - LF Prox
  - MIFARE
  - NFC payment
  - access control
intro: >-
  Once identity or keys are recovered, the credential can be cloned to a blank,
  emulated by a device, or relayed in real time between a genuine card and a
  distant reader — defeating proximity as a security assumption.
attacks:
  - name: UID/credential cloning
    refs: []
    note: standard LF/HF practice
    summary: >-
      UID-only and cloned-key credentials are written to blanks or magic cards
      and used directly — the baseline failure of non-cryptographic access
      control.
  - name: Card emulation
    refs: []
    note: Chameleon / Proxmark / BomberCat
    summary: >-
      A device presents the credential without a physical card, enabling rapid
      testing and real-world impersonation.
  - name: NFC relay attack
    refs: []
    note: 'BomberCat RelayNFC, DEF CON 30'
    summary: >-
      Host reads a genuine card while a remote client presents it to the target
      reader in real time, defeating proximity. Demonstrated against bank
      terminals.
  - name: MagSpoof magstripe emulation
    refs: []
    note: Electronic Cats MagSpoof / BomberCat
    summary: >-
      Emulates magnetic-stripe data wirelessly to standard magstripe readers,
      extending the attack to legacy payment/access infrastructure.
references: []
resources:
  - RFSAM-RES-13
  - RFSAM-RES-14
reviewStatus: stub
confidence: low
---
## Mechanism

Three escalations follow key/identity recovery. Cloning writes the recovered data to a blank card (or 'magic' UID-changeable card). Emulation has a device present the credential directly — a Chameleon or Proxmark emulating an HF card, or BomberCat emulating NFC/MagSpoof magstripe. Relay is the strongest: a host device reads a genuine card while a client device, anywhere with connectivity, presents it to the target reader in real time — defeating physical-proximity assumptions entirely. BomberCat was purpose-built for NFC relay against bank terminals (its RelayNFC host/client, demonstrated at DEF CON 30). This control verifies which of clone/emulate/relay the target is susceptible to.

## Procedure

1. Clone recovered LF/HF credentials to a blank or magic card; test against the reader.
2. Emulate the credential with a Chameleon/Proxmark/BomberCat; confirm reader acceptance.
3. For relay, set up host (reads card) + client (presents to reader) and test acceptance versus any timing checks.
4. Record whether the reader enforces timing/anti-relay or distance bounding.

## Field case

After Crypto1 recovery (RFSAM-RFID-CR-01), a Proxmark or Chameleon emulates the card to the reader; a magic card clones it physically. For payment/banking, BomberCat's RelayNFC relays a live card from a host to a client at the terminal — the DEF CON 30 demonstration — while MagSpoof covers the magstripe fallback. The control's key question for the defender: does the reader enforce any timing/anti-relay check, or is presence alone trusted?

## Remediation

Use cryptographically authenticated credentials (DESFire AES) so cloned/emulated data is useless. For payment/high-value access, enforce timing constraints or distance bounding to defeat relay. Never trust UID or magstripe data as proof of presence.
