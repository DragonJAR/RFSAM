---
id: RFSAM-RES-10
title: Passive LTE control-channel decode
---
From a recovered resource grid, blind-decode PDCCH: enumerate the search space, run Viterbi on each candidate, and validate by CRC masked with the candidate RNTI. Open-source tooling (LTESniffer / FALCON class) performs this passively; pair with SIB/paging decode for configuration and identity exposure.
