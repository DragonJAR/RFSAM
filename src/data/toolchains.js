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
        note: 'Confirm the band is active and decide what you can observe before committing to a capture path.',
        hardware: [
          { tool: 'hackrf-one', role: 'Wideband survey', why: 'Gives a wideband view of the 2.4 GHz ISM band to confirm advertising activity.', caveat: '~20 MHz instantaneous bandwidth cannot cover the full 80 MHz BLE band at once.', software: ['universal-radio-hacker'] },
        ],
      },
      PHY: {
        note: 'BLE sniffers demodulate (PHY) and frame (LL) together — most capture happens at the Link layer below. For raw, all-channel SDR demodulation, use:',
        hardware: [
          { tool: 'hackrf-one', role: 'SDR demodulation', why: 'A wideband SDR running ice9 demodulates BLE across the band and can even capture already-established connections.', caveat: 'Needs CPU/GPU for channelisation.', software: ['ice9-bluetooth-sniffer'] },
          { tool: 'ubertooth-one', role: 'Dedicated-radio demod', why: 'Demodulates and follows BLE on a cheap dedicated radio without an SDR.', caveat: 'Pre-BT5; weaker on long-lived connections.' },
        ],
      },
      LL: {
        note: 'Capture and decode BLE frames. Pick the radio first; the host software runs on it.',
        hardware: [
          { tool: 'catsniffer', role: 'Primary sniffer', why: 'CC1352 board running Sniffle — modern BT5/4.x capture with extended advertising and connection following.', software: ['sniffle', 'wireshark'] },
          { tool: 'ubertooth-one', role: 'Budget sniffer', why: 'Follows connections on a ~$120 radio.', caveat: 'Pre-BT5; weaker on long-lived links than CC1352 sniffers.', software: ['wireshark'] },
          { tool: 'nrf52840-dongle', role: 'Vendor sniffer', why: 'Runs Nordic’s nRF Sniffer with a turnkey Wireshark plugin — the easiest path to a first capture.', caveat: 'Follows a single connection; less suited to adversarial work.', software: ['nrf-sniffer', 'wireshark'] },
          { tool: 'hackrf-one', role: 'Established-connection capture', why: 'Run ice9 to capture a connection you could not catch from its setup.', software: ['ice9-bluetooth-sniffer', 'wireshark'] },
        ],
      },
      CR: {
        note: 'Assess pairing and decrypt where the pairing was weak. Works on a host PC against a saved capture — no extra radio.',
        host: [
          { tool: 'crackle', role: 'Pairing crack / decrypt', why: 'Recovers keys from a captured LE Legacy pairing event and decrypts the session.', caveat: 'No effect on LE Secure Connections (ECDH).' },
        ],
      },
      AT: {
        note: 'Actively take over or inject. These need their own dedicated radios.',
        hardware: [
          { tool: 'bbc-microbit', role: 'Jam & hijack', why: 'Runs Btlejack to follow, jam and hijack a live connection from ~$15 hardware.', software: ['btlejack'] },
          { tool: 'nrf52840-dongle', role: 'Inject / MITM', why: 'Runs the InjectaBLE firmware to inject link-layer frames into an established connection.', software: ['injectable-firmware'] },
        ],
        host: [
          { tool: 'bettercap', role: 'Recon & enumeration', why: 'Discovers devices and enumerates GATT before/after takeover, on a plain host adapter.' },
        ],
      },
      AP: {
        note: 'Interact with what the device trusts above the link — runs on any host BLE adapter.',
        host: [
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
