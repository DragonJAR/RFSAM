---
id: RFSAM-RES-04
title: Sniff and audit a BLE device
---
Drive a Sniffle-class sniffer (e.g. CatSniffer / CC1352) to passively scan advertising channels, then connect and enumerate GATT to audit for unencrypted readable/writable characteristics. Audit-on-discovery sweeps every connectable advertiser as it is found, classifying address type and recording writable handles without authentication.
