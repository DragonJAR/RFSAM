// Per-technology toolchain: for each protocol, the descent (layer by layer).
// Uniform model — each layer is a list of capabilities, each with a PRIMARY tool
// (the thing you choose) plus what it depends on:
//   { tool, deps?:[slugs], role?, why?, caveat?, needs? }
// The primary `tool` is the graph bubble (coloured by its own type: hardware /
// software / project). `deps` are the tools it pairs with — for a software tool
// that's the hardware it runs on; for a hardware tool that's the software it runs.
// `needs` is a free-text dependency (e.g. "a host BLE adapter", "a pairing PCAP").
// All `tool`/`deps` values are slugs in the tools collection.
//
// layer shape: { note?, tools?: [{ tool, deps?, role?, why?, caveat?, needs? }] }
// status: 'complete' = curated; 'planned' = scaffold, toolchain to be filled.

export const toolchains = {
  BLE: {
    status: 'complete',
    facts: [
      { k: 'Band', v: '2.402–2.480 GHz (2.4 GHz ISM)' },
      { k: 'Channels', v: '40 × 2 MHz — 3 advertising (37/38/39) + 37 data; a connection hops every event' },
      { k: 'Modulation', v: 'GFSK · PHYs: LE 1M (1 Mbps), LE 2M (BLE 5), LE Coded (long range, BLE 5)' },
      { k: 'Range', v: '~10 m typical indoors; up to ~100 m+ with BLE 5 Coded PHY or higher TX power' },
      { k: 'Versions', v: '4.0 (2010) · 4.2 LE Secure Connections (2014) · 5.0 2M/Coded (2016) · 5.1–5.4' },
    ],
    reference: {
      name: 'BSAM (Tarlogic)',
      url: 'https://www.tarlogic.com/bsam/',
      note: 'RFSAM owns the spectrum and signal/PHY floors for BLE; at the link layer and above it defers to Tarlogic’s BSAM and adds only the RF-capture prerequisite. The BLE controls cite the specific BSAM controls they hand off to.',
    },
    layers: {
      IG: {
        note: 'Identify the device and its stack before any RF work — no capture yet. RFSAM defers the formal SoC/host-stack vulnerability check to the BSAM Information-Gathering controls.',
        lookFor: [
          'Chipset / SoC and host stack (FCC ID, teardown, advertising fingerprint) — cross-reference known Bluetooth CVEs (KNOB, SweynTooth, BLESA…).',
          'BLE version it speaks (4.x vs 5.x): sets which PHYs (1M / 2M / Coded) and security features are in play.',
          'Advertising data: device name, advertised service UUIDs, manufacturer-specific data.',
          'Address type: public vs random, and whether it rotates a Resolvable Private Address (RPA) or exposes a fixed, trackable one.',
          'Pairing / security mode: Just Works vs Passkey vs OOB, and LE Legacy vs LE Secure Connections.',
          'GATT services and characteristics reachable without authentication.',
        ],
      },
      SP: {
        note: 'How much of the band can you see at once? BLE spreads 40 channels over 80 MHz (2.402–2.480 GHz) and hops fast, so the radio is a visibility trade-off: a HackRF shows ~20 MHz — a slice of the band; a bladeRF in its 122.88 MHz oversampling mode shows the full 80 MHz in one pass; or camp a single channel and pick up the packets that land on it as the hopping connection passes through — cheaper and simpler, but you miss whatever is on the other channels. RTL-SDR is out: it stops near 1.766 GHz, below the 2.4 GHz band.',
        tools: [
          { tool: 'gqrx', role: 'Spectrum / waterfall view', why: 'See the live spectrum and pick channels — ~20 MHz at a time on a HackRF, the full 80 MHz on a bladeRF (oversampling).', deps: ['hackrf-one', 'bladerf-2-micro'] },
        ],
      },
      PHY: {
        note: 'No standalone BLE demodulator. Every BLE capture tool demodulates (PHY) and frames (LL) in one step, so they live together at the Capture step. The SDR path channelises the raw 80 MHz band with ice9.',
      },
      // Capture is SOFTWARE-LED: you pick the sniffer/technique; the hardware is what it needs.
      // Hardware → sniffer software → Wireshark (the shared decoder).
      LL: {
        note: 'Capture and decode BLE frames. Pick a sniffer technique; each runs on its radio and exports a PCAP you dissect in Wireshark. Dedicated sniffers are simplest; the SDR path (ice9) trades setup for wider bandwidth and the ability to grab already-established connections.',
        decoder: 'wireshark',
        tools: [
          { tool: 'sniffle', role: 'Primary sniffer', why: 'Modern BT5/4.x capture with extended advertising and connection following — the default choice today. Runs on any CC1352 board.', deps: ['catsniffer'] },
          { tool: 'ice9-bluetooth-sniffer', role: 'SDR capture', why: 'All-channel capture that can also grab already-established connections. Runs on an SDR — pick it by how much of the 80 MHz band you need at once (bandwidth shown on each radio).', caveat: 'Needs CPU/GPU for channelisation.', deps: ['hackrf-one', 'bladerf-2-micro', 'usrp-b210', 'signalsdr-pro'] },
          { tool: 'nrf-sniffer', role: 'Vendor sniffer', why: 'Easiest first capture, with a turnkey Wireshark plugin.', caveat: 'Follows a single connection; less suited to adversarial work.', deps: ['nrf52840-dongle'] },
          { tool: 'ubertooth-tools', role: 'Budget sniffer', why: 'Drives an Ubertooth One to follow connections on a ~$120 radio with no SDR.', caveat: 'Pre-BT5; weaker on long-lived links than CC1352 sniffers.', deps: ['ubertooth-one'] },
        ],
      },
      CR: {
        note: 'Assess pairing and decrypt where the pairing was weak. No live radio of its own — it consumes a capture from the Capture step.',
        tools: [
          { tool: 'crackle', role: 'Pairing crack / decrypt', why: 'Brute-forces the LE Legacy TK from a captured pairing event and decrypts the session.', caveat: 'No effect on LE Secure Connections (ECDH).', deps: ['wireshark'], needs: 'A PCAP of the pairing exchange: capture it at the Capture step (Sniffle / ice9 / nRF Sniffer / Ubertooth), save it from Wireshark, then feed that file to crackle.' },
        ],
      },
      // Attack is SOFTWARE-LED: you pick the technique; it names the radio it needs.
      AT: {
        note: 'Actively take over or inject. Pick the technique; each names the dedicated radio it runs on. Recon/enumeration runs on a plain host adapter.',
        tools: [
          { tool: 'btlejack', role: 'Jam & hijack', why: 'Follow, jam and hijack a live connection. Runs on ~$15 hardware.', deps: ['bbc-microbit'] },
          { tool: 'injectable-firmware', role: 'Inject / MITM', why: 'Inject link-layer frames into an established connection (the InjectaBLE strategy).', deps: ['nrf52840-dongle'] },
          { tool: 'bettercap', role: 'Recon & enumeration', why: 'Discover devices and enumerate GATT before/after takeover.', deps: ['usb-bt-dongle', 'catsniffer'], needs: 'A host Bluetooth LE adapter over HCI (Linux/BlueZ for the BLE module).' },
        ],
      },
      AP: {
        note: 'Interact with what the device trusts above the link, over the host’s own HCI controller.',
        tools: [
          { tool: 'bleak', role: 'GATT interaction', why: 'Script reads/writes/subscriptions and replay learned commands, cross-platform.', deps: ['usb-bt-dongle', 'catsniffer'], needs: 'A host BLE controller over HCI — a standard USB Bluetooth adapter, or a CatSniffer presented as a virtual HCI on Linux via the catnip tool.' },
          { tool: 'bettercap', role: 'GATT enumeration', why: 'Enumerate services and characteristics interactively.', deps: ['usb-bt-dongle', 'catsniffer'], needs: 'A host Bluetooth LE adapter over HCI (Linux/BlueZ for the BLE module).' },
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
