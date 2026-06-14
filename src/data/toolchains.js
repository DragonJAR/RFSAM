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
    reference: {
      name: 'BSAM (Tarlogic)',
      url: 'https://www.tarlogic.com/bsam/',
      note: 'RFSAM owns the spectrum and signal/PHY floors for BLE; at the link layer and above it defers to Tarlogic’s BSAM and adds only the RF-capture prerequisite. The BLE controls cite the specific BSAM controls they hand off to.',
    },
    layers: {
      IG: {
        note: 'Identify the SoC/controller and host stack (FCC ID, teardown, advertising fingerprint) and check them against the published Bluetooth CVE corpus. RFSAM defers this to the BSAM Information-Gathering controls — no RF capture yet.',
      },
      SP: {
        note: 'Capture feasibility, not a separate toolset. BLE spreads 40 channels across 80 MHz (2.402–2.480 GHz) and hops every few ms. The capture radio’s instantaneous bandwidth (chosen at the Capture step) decides how much you see at once — even the widest SDR here (bladeRF in its 122.88 MHz oversampling mode) only just covers the 80 MHz. RTL-SDR is out entirely: it stops near 1.766 GHz, below the 2.4 GHz band.',
      },
      PHY: {
        note: 'No standalone BLE demodulator. Every BLE capture tool demodulates (PHY) and frames (LL) in one step, so they live together at the Capture step. The SDR path channelises the raw 80 MHz band with ice9.',
      },
      // Capture is SOFTWARE-LED: you pick the sniffer/technique; the hardware is what it needs.
      LL: {
        note: 'Capture and decode BLE frames — the demodulate-and-frame work. Choose the sniffer technique first; each names the radio it runs on. Dedicated sniffers are simplest; the SDR path (ice9) trades setup for wider bandwidth and the ability to grab already-established connections.',
        tools: [
          { tool: 'sniffle', role: 'Primary sniffer', why: 'Modern BT5/4.x capture with extended advertising and connection following — the default choice today. Runs on any CC1352 board.', deps: ['catsniffer'] },
          { tool: 'ice9-bluetooth-sniffer', role: 'SDR capture', why: 'All-channel capture that can also grab already-established connections. Runs on an SDR — pick it by how much of the 80 MHz band you need at once (bandwidth shown on each radio).', caveat: 'Needs CPU/GPU for channelisation.', deps: ['hackrf-one', 'bladerf-2-micro', 'usrp-b210', 'signalsdr-pro'] },
          { tool: 'nrf-sniffer', role: 'Vendor sniffer', why: 'Easiest first capture, with a turnkey Wireshark plugin.', caveat: 'Follows a single connection; less suited to adversarial work.', deps: ['nrf52840-dongle'] },
          { tool: 'ubertooth-one', role: 'Budget dedicated sniffer', why: 'Follows connections on a ~$120 radio with no SDR (the radio is the tool here).', caveat: 'Pre-BT5; weaker on long-lived links than CC1352 sniffers.' },
          { tool: 'wireshark', role: 'Decode', why: 'Dissect the PCAP produced by any capture above.' },
        ],
      },
      CR: {
        note: 'Assess pairing and decrypt where the pairing was weak. No live radio of its own — it works on a capture from the Capture step.',
        tools: [
          { tool: 'crackle', role: 'Pairing crack / decrypt', why: 'Recovers keys from a captured LE Legacy pairing event and decrypts the session.', caveat: 'No effect on LE Secure Connections (ECDH).', needs: 'A PCAP of the pairing exchange from a sniffer at the Capture step.' },
        ],
      },
      // Attack is SOFTWARE-LED: you pick the technique; it names the radio it needs.
      AT: {
        note: 'Actively take over or inject. Pick the technique; each names the dedicated radio it runs on. Recon/enumeration runs on a plain host adapter.',
        tools: [
          { tool: 'btlejack', role: 'Jam & hijack', why: 'Follow, jam and hijack a live connection. Runs on ~$15 hardware.', deps: ['bbc-microbit'] },
          { tool: 'injectable-firmware', role: 'Inject / MITM', why: 'Inject link-layer frames into an established connection (the InjectaBLE strategy).', deps: ['nrf52840-dongle'] },
          { tool: 'bettercap', role: 'Recon & enumeration', why: 'Discover devices and enumerate GATT before/after takeover.', needs: 'A host Bluetooth LE adapter (Linux/BlueZ for the BLE module).' },
        ],
      },
      AP: {
        note: 'Interact with what the device trusts above the link. These run on the host’s own Bluetooth adapter — not a special radio, but they still need a working BLE controller.',
        tools: [
          { tool: 'bleak', role: 'GATT interaction', why: 'Script reads/writes/subscriptions and replay learned commands, cross-platform.', needs: 'Any host Bluetooth LE adapter — built-in, a USB BLE dongle, or an nRF52840 in HCI mode (BlueZ / CoreBluetooth / WinRT).' },
          { tool: 'bettercap', role: 'GATT enumeration', why: 'Enumerate services and characteristics interactively.', needs: 'A host Bluetooth LE adapter (Linux/BlueZ for the BLE module).' },
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
