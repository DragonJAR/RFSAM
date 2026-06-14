// Per-technology toolchain: for each protocol, the descent (layer by layer).
// Each layer is HARDWARE-FIRST: a list of hardware, each with the software/projects
// that run ON it for that step nested underneath. `host` lists software that runs
// on a plain host adapter (no special radio). All `tool`/`software` values are slugs
// in the tools collection. BLE is the pilot; other protocols are scaffolds.
//
// layer shape: { note?, hardware?: [{ tool, role, why, caveat?, software?:[slugs] }],
//                host?: [{ tool, role, why, caveat? }] }
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
        note: 'Capture feasibility, not a separate toolset. BLE spreads 40 channels across 80 MHz (2.402–2.480 GHz) and hops every few ms. Your capture radio’s instantaneous bandwidth (see the radios at the Link layer) decides how much you see at once. Most SDRs here see only part of the band per pass; the exception is the bladeRF 2.0 in its 122.88 MHz oversampling mode, which covers the full 80 MHz in one pass (at 8-bit depth). RTL-SDR is out entirely: it stops near 1.766 GHz, below the 2.4 GHz band.',
      },
      PHY: {
        note: 'No standalone BLE demodulator. Every BLE capture tool demodulates (PHY) and frames (LL) in one step, so they all live together at the Link layer below. The all-channel SDR path simply channelises the raw 80 MHz band with ice9.',
      },
      LL: {
        note: 'Capture and decode BLE frames — this is where the demodulate-and-frame work actually happens. Pick the radio first; the host software runs on it. Dedicated sniffers are simplest; SDRs + ice9 trade setup for wider bandwidth and the ability to grab already-established connections.',
        hardware: [
          { tool: 'catsniffer', role: 'Primary sniffer', why: 'CC1352 board running Sniffle — modern BT5/4.x capture with extended advertising and connection following. The default choice today.', software: ['sniffle', 'wireshark'] },
          { tool: 'ubertooth-one', role: 'Budget dedicated sniffer', why: 'Follows connections on a ~$120 radio with no SDR.', caveat: 'Pre-BT5; weaker on long-lived links than CC1352 sniffers.', software: ['wireshark'] },
          { tool: 'nrf52840-dongle', role: 'Vendor sniffer', why: 'Runs Nordic’s nRF Sniffer with a turnkey Wireshark plugin — the easiest path to a first capture.', caveat: 'Follows a single connection; less suited to adversarial work.', software: ['nrf-sniffer', 'wireshark'] },
          { tool: 'hackrf-one', role: 'SDR capture (narrow)', why: 'Runs ice9 for all-channel capture and can grab already-established connections.', caveat: '~20 MHz IBW sees only a slice of the 80 MHz band; needs CPU/GPU for channelisation.', software: ['ice9-bluetooth-sniffer', 'wireshark'] },
          { tool: 'bladerf-2-micro', role: 'SDR capture (full-band)', why: 'Runs ice9; in 2023.02+ oversampling mode it reaches 122.88 MHz — enough to capture the entire 80 MHz BLE band in a single pass.', caveat: 'Oversampling runs at 8-bit depth and needs USB 3.0.', software: ['ice9-bluetooth-sniffer', 'wireshark'] },
          { tool: 'usrp-b210', role: 'SDR capture (lab-grade)', why: 'Runs ice9 with ~56 MHz bandwidth and a disciplined-clock option for coherent work.', caveat: 'Bandwidth halves to ~30.72 MHz in 2×2 MIMO.', software: ['ice9-bluetooth-sniffer', 'wireshark'] },
          { tool: 'signalsdr-pro', role: 'SDR capture (widest IBW)', why: 'Widest instantaneous bandwidth here at 61.44 MHz; emulates a USRP B210, so the ice9 USRP path should bind.', caveat: 'Emerging product — verify ice9 support and availability first.', software: ['ice9-bluetooth-sniffer', 'wireshark'] },
        ],
      },
      CR: {
        note: 'Assess pairing and decrypt where the pairing was weak. No live radio of its own — it works on a capture from the sniffers above.',
        host: [
          { tool: 'crackle', role: 'Pairing crack / decrypt', why: 'Recovers keys from a captured LE Legacy pairing event and decrypts the session.', caveat: 'No effect on LE Secure Connections (ECDH).', needs: 'A PCAP of the pairing exchange from any BLE sniffer above (e.g. Ubertooth or Sniffle).' },
        ],
      },
      AT: {
        note: 'Actively take over or inject. The takeover tools need their own dedicated radios; the recon tool runs on a host adapter.',
        hardware: [
          { tool: 'bbc-microbit', role: 'Jam & hijack', why: 'Runs Btlejack to follow, jam and hijack a live connection from ~$15 hardware.', software: ['btlejack'] },
          { tool: 'nrf52840-dongle', role: 'Inject / MITM', why: 'Runs the InjectaBLE firmware to inject link-layer frames into an established connection.', software: ['injectable-firmware'] },
        ],
        host: [
          { tool: 'bettercap', role: 'Recon & enumeration', why: 'Discovers devices and enumerates GATT before/after takeover.', needs: 'A host Bluetooth LE adapter (built-in or USB BLE dongle; the BLE module runs on Linux/BlueZ).' },
        ],
      },
      AP: {
        note: 'Interact with what the device trusts above the link. These run on the host’s own Bluetooth adapter — not a special radio, but they still need a working BLE controller.',
        host: [
          { tool: 'bleak', role: 'GATT interaction', why: 'Script reads/writes/subscriptions and replay learned commands cross-platform.', needs: 'Any host Bluetooth LE adapter — built-in, a USB BLE dongle, or an nRF52840 in HCI mode (BlueZ / CoreBluetooth / WinRT).' },
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
