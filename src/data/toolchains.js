// Per-technology toolchain: for each protocol, the descent (layer by layer) with
// the tools/software/projects used at each step and the reasons to choose each.
// `tool` values are slugs in the tools collection. BLE is the pilot, filled in
// full; other protocols are structured and marked planned.
//
// status: 'complete' = curated; 'planned' = scaffold, toolchain to be filled.

export const toolchains = {
  BLE: {
    status: 'complete',
    reference: {
      name: 'BSAM (Tarlogic)',
      url: 'https://www.tarlogic.com/bsam/',
      note: 'RFSAM owns the spectrum and signal/PHY floors for BLE; at the link layer and above it defers to Tarlogic’s BSAM and adds only the RF-capture prerequisite. The BLE controls cite the specific BSAM controls they hand off to.',
    },
    layers: {
      IG: {
        note: 'Identify the SoC/controller and host stack (FCC ID, teardown, advertising fingerprint) and check them against the published Bluetooth CVE corpus. RFSAM defers this to the BSAM Information-Gathering controls.',
        tools: [],
      },
      SP: {
        tools: [
          { tool: 'hackrf-one', role: 'Wideband survey', why: 'Confirms 2.4 GHz activity and lets you eyeball advertising energy across the band.', caveat: '~20 MHz instantaneous bandwidth cannot cover the full 80 MHz BLE band at once.' },
        ],
      },
      PHY: {
        tools: [
          { tool: 'ice9-bluetooth-sniffer', role: 'SDR demodulation', why: 'Demodulates BLE across the band from a HackRF/bladeRF/USRP and can sniff already-established connections.', caveat: 'Needs an SDR plus CPU/GPU for channelisation.' },
          { tool: 'ubertooth-one', role: 'Dedicated-radio capture', why: 'Demodulates and follows BLE on a cheap dedicated radio without an SDR.', caveat: 'Pre-BT5; weaker on long-lived connections.' },
        ],
      },
      LL: {
        tools: [
          { tool: 'sniffle', role: 'Primary LL sniffer', why: 'Modern BT5/4.x capture incl. extended advertising and connection following; runs on a CatSniffer.' },
          { tool: 'ubertooth-one', role: 'Budget sniffer', why: 'Follows connections on a ~$120 radio.', caveat: 'Pre-BT5; weaker on long-lived links than CC1352 sniffers.' },
          { tool: 'nrf-sniffer', role: 'Vendor sniffer', why: 'Easiest to set up via the Wireshark plugin.', caveat: 'Follows a single connection; less suited to adversarial work.' },
          { tool: 'ice9-bluetooth-sniffer', role: 'Established-connection capture', why: 'Use when you could not catch the connection request.' },
          { tool: 'wireshark', role: 'Decode', why: 'Dissect the PCAP produced by any of the above.' },
        ],
      },
      CR: {
        tools: [
          { tool: 'crackle', role: 'Pairing crack / decrypt', why: 'Recovers keys from a captured LE Legacy pairing event and decrypts the session.', caveat: 'No effect on LE Secure Connections (ECDH).' },
        ],
      },
      AT: {
        tools: [
          { tool: 'btlejack', role: 'Jam & hijack', why: 'Takes over a live connection from low-cost hardware (micro:bit / nRF51822).' },
          { tool: 'injectable-firmware', role: 'Inject / MITM', why: 'Injects link-layer frames into an established connection (the InjectaBLE strategy).' },
          { tool: 'bettercap', role: 'Recon & enumeration', why: 'Discovers devices and enumerates GATT before/after takeover.' },
        ],
      },
      AP: {
        tools: [
          { tool: 'bleak', role: 'GATT interaction', why: 'Script reads/writes/subscriptions and replay learned commands cross-platform.' },
          { tool: 'bettercap', role: 'GATT enumeration', why: 'Enumerate services and characteristics interactively.' },
        ],
      },
    },
  },

  WIFI:   { status: 'planned', reference: null, layers: {} },
  LORA:   { status: 'planned', reference: null, layers: {} },
  LTE:    { status: 'planned', reference: null, layers: {} },
  RFID:   { status: 'planned', reference: null, layers: {} },
  SUBG:   { status: 'planned', reference: null, layers: {} },
  ZIGBEE: { status: 'planned', reference: null, layers: {} },
  ZWAVE:  { status: 'planned', reference: null, layers: {} },
  THREAD: { status: 'planned', reference: null, layers: {} },
  GNSS:   { status: 'planned', reference: null, layers: {} },
  ADSB:   { status: 'planned', reference: null, layers: {} },
  NR5G:   { status: 'planned', reference: null, layers: {} },
  GSM:    { status: 'planned', reference: null, layers: {} },
  UWB:    { status: 'planned', reference: null, layers: {} },
};
