---
id: RFSAM-RES-03
title: GPU polyphase channelisation
---
Split a wide I/Q stream into many narrow channels using a polyphase filterbank + FFT offloaded to the GPU (OpenCL / VkFFT). This makes real-time multi-channel demodulation tractable where CPU channelisation throttles and drops samples. Reference: the ice9-bluetooth-sniffer approach for the BLE band.
