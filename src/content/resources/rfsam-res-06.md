---
id: RFSAM-RES-06
title: Hijack a live BLE connection
---
Follow an established connection's hop sequence, stabilise over several connection events, then transmit as master to evict the original central. The clean pattern is hijack → LL_TERMINATE_IND → reconnect. Implementation note: set the decoder's current Access Address to the connection AA only after reaching CENTRAL (flush first); advertisements during INITIATING reset it to the advertising AA and break data-PDU decoding.
