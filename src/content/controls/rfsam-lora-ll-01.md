---
id: RFSAM-LORA-LL-01
title: Cleartext join metadata and identity harvesting
protocol: LORA
layer: LL
criticality: high
applicability:
  - LoRaWAN
intro: >-
  LoRaWAN encrypts application payloads (AES-128) but transmits join-procedure
  metadata and frame headers in the clear. A passive observer can harvest device
  and application identifiers across an entire deployment without transmitting.
attacks:
  - name: ABP replay attack
    refs: []
    note: 'van Es et al., ''Security Vulnerabilities in LoRaWAN'', IoTDI 2018'
    summary: >-
      ABP session keys persist across counter resets; replaying captured frames
      after a device reboot is accepted because the frame counter restarts.
      Harvested cleartext headers identify replayable targets.
  - name: Keystream-reuse eavesdropping
    refs: []
    note: 'van Es et al., IoTDI 2018'
    summary: >-
      LoRaWAN encrypts with AES in CTR-like mode keyed by the frame counter. On
      counter reset with a static key, identical keystream recurs — classic
      two-time-pad, recoverable by XORing ciphertexts seen passively.
  - name: Bit-flipping (NS to AS leg)
    refs: []
    note: 'Trend Micro, 2021; Lee et al., ICOIN 2017'
    summary: >-
      The MIC protects the device-to-network-server leg, but the decrypted
      payload forwarded network-server-to-application-server is unprotected and
      tamperable. Passive capture of frame structure is the first step to
      scoping it.
references: []
resources:
  - RFSAM-RES-07
reviewStatus: stub
confidence: low
---
## Mechanism

In LoRaWAN OTAA, the JoinRequest carries AppEUI, DevEUI, and DevNonce in cleartext. Data frames expose the MAC header (MHDR) and DevAddr in clear even though the payload is AES-128 encrypted. A passive receiver therefore maps the network — which devices exist, which join, how often — and harvests stable identifiers fleet-wide. A high proportion of JoinRequests relative to data frames is itself a finding: it indicates devices repeatedly failing to join (lost downlinks, bad coverage, mis-provisioned keys), and a network broadcasting its own poor health. This control captures and classifies frame types and inventories the cleartext identity fields.

## Procedure

1. Passively capture the target channels (RFSAM-RES-07) and decode frame structure.
2. Classify by MType (JoinRequest, JoinAccept, Un/ConfirmedDataUp/Down, etc.).
3. Extract cleartext AppEUI / DevEUI / DevNonce from JoinRequests and DevAddr from data frames.
4. Compute the JoinRequest-to-data ratio as a network-health and attack-surface indicator.
5. Flag repeated DevNonce values (replay exposure).

## Field case

A passive US915 capture of 51,304 LoRaWAN frames showed 45,815 (89.3%) were JoinRequests — nine of every ten frames were devices trying, and failing, to join. The structure read entirely in the clear (MHDR + DevAddr; AppEUI/DevEUI/DevNonce in the join), letting an attacker harvest the fleet's identities and map the network without ever transmitting. The payloads stayed AES-protected — but the metadata alone profiled the deployment and exposed it as misconfigured.

## Remediation

Minimise join churn through correct provisioning and downlink coverage (reduces harvestable JoinRequests). Treat DevEUI/AppEUI as non-secret but rotate DevNonce correctly to prevent replay. Where the threat model allows, prefer ABP with managed counters or LoRaWAN 1.1 join-server protections.
