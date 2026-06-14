---
id: RFSAM-LTE-IG-01
title: Known vulnerabilities of the baseband and RAN/core stack
protocol: LTE
layer: IG
criticality: high
applicability:
  - LTE
  - 5G NSA
intro: >-
  LTE has two distinct vulnerable software surfaces, both heavily CVE-tracked:
  the device-side baseband (the modem SoC running its own RTOS) and the
  network-side RAN/core stack (eNodeB + EPC). Before behavioural testing,
  identify both and cross-reference the published corpora. Unlike BLE, BSAM does
  not cover cellular — RFSAM owns this control end to end.
attacks:
  - name: RANsacked
    refs: []
    note: 'Univ. Florida / NC State, 2025 — 97 CVEs'
    summary: >-
      Domain-informed fuzzing of LTE/5G RAN-core interfaces found 119
      vulnerabilities across srsRAN, Open5GS, Magma, OpenAirInterface, NextEPC,
      Athonet and SD-Core. A single unauthenticated packet can persistently
      crash the MME/AMF — city-wide outage, no SIM required.
  - name: UNISOC NAS stack overflow
    refs: []
    note: CVE-2022-20210
    summary: >-
      Missing bounds checks in NAS message parsing (mirrored in srsRAN's
      liblte_mme unpack functions) overflow fixed-size buffers from a malicious
      ATTACH_ACCEPT, crashing or corrupting the modem. Check Point, 2022.
  - name: Qualcomm FastRPC use-after-free
    refs: []
    note: 'CVE-2024-43047 (CVSS 7.8, exploited)'
    summary: >-
      Actively-exploited baseband-adjacent use-after-free flagged by Google TAG
      and Amnesty Security Lab — illustrates that baseband/DSP bugs reach real
      targeted-surveillance use.
  - name: LLFuzz baseband L2 bugs
    refs: []
    note: 'KAIST, 2025 — 7 CVEs'
    summary: >-
      Over-the-air fuzzing of cellular Layer-2 across 15 commercial phones
      (Apple, Samsung, Google, Xiaomi) found 11 memory-corruption bugs in
      PDCP/RLC/MAC/RRC; e.g. Exynos RLC DoS crashing the modem with a malformed
      radio packet.
  - name: Baseband remote RCE (Shannon/Weinmann)
    refs: []
    note: 'Weinmann, WOOT 2012; Tencent KeenLab, 2021'
    summary: >-
      Foundational and modern demonstrations of remote code execution in
      baseband firmware (Samsung Shannon among them) by exploiting memory
      corruption in over-the-air message handling.
references: []
resources:
  - RFSAM-RES-08
reviewStatus: stub
confidence: low
---
## Mechanism

The baseband is a second computer in every phone, running a real-time OS on its own core with firmware reachable over the air. Memory-corruption bugs there yield remote code execution below the application processor — demonstrated repeatedly across Qualcomm, Samsung Shannon/Exynos, MediaTek and UNISOC chipsets. Symmetrically, the network side (eNodeB/EPC, increasingly open-source) parses attacker-influenced NAS/RRC messages and has been shown to crash or be exploited by a single unauthenticated packet — city-wide denial of service with no SIM required. This control inventories the device baseband vendor/version and (where the eNodeB/EPC is in scope) the RAN/core implementation, then cross-references both against the corpora below. It is the LTE analogue of RFSAM-BLE-IG-01.

## Procedure

1. Identify the device baseband vendor and firmware (Qualcomm / Shannon-Exynos / MediaTek / UNISOC) from device data or modem.bin teardown.
2. Where the network is in scope, identify the eNodeB/EPC stack (srsRAN, Open5GS, OpenAirInterface, Magma, NextEPC, Athonet, SD-Core) and version.
3. Cross-reference the baseband against vendor security bulletins and the LLFuzz/Weinmann L2 corpus.
4. Cross-reference the RAN/core stack against RANsacked (97 CVEs) and the srsRAN/UNISOC NAS-parsing CVEs.
5. Record patch status; flag end-of-life basebands and unpatched open-source cores as high-risk.

## Field case

Identifying the stack first reframes the LTE engagement exactly as it does for BLE. If the in-scope eNodeB/EPC is an unpatched srsRAN or Open5GS build, the RANsacked corpus already lists single-packet MME-crash CVEs before any custom fuzzing — the finding may be decisive on inventory alone. On the device side, a baseband on an unpatched Qualcomm/Exynos/UNISOC release carries known RCE/DoS exposure independent of how the cell is configured.

## Remediation

Network side: patch the RAN/core stack against RANsacked and NAS-parsing CVEs; never expose an unauthenticated MME/AMF to attacker-reachable packets. Device side: keep baseband firmware current via OEM updates; treat end-of-life basebands with no patch path as high-risk. There is no BSAM equivalent to defer to — cellular is RFSAM's domain.
