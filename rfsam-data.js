// RFSAM control catalog — real controls, grounded in Electronic Cats field work.
// Schema mirrors BSAM (id, title, applicability, criticality, description,
// procedure, related resources, example case, remediation) plus an RF-native
// "layer" dimension (SP spectrum / PHY signal / LL link / CR crypto / AT attack / AP app).

const RFSAM = {
  meta: {
    title: "RFSAM",
    subtitle: "Radio Frequency Security Assessment Methodology",
    org: "Electronic Cats",
    version: "0.1 — draft",
    blurb: "RF research and auditing have plenty of tools and scattered knowledge, but no single map. Faced with an unknown signal or device, where do you start — and how do you know what you've missed? RFSAM is meant to be that north: an open, structured reference that walks you from the spectrum up through the signal, link, crypto, attack and application layers, per protocol, with a verification procedure and a real worked example at each step. It doesn't claim to invent RF security — OSSTMM, BSAM and a deep body of research came first. It aims to organise that landscape into something you can navigate by, whether you're auditing a device or learning the field."
  },

  // Relationship to BSAM. RFSAM owns the RF-native layers (spectrum, signal/PHY)
  // and the protocols BSAM does not cover (LoRa, LTE). For Bluetooth at the link
  // layer and above, RFSAM defers to BSAM rather than duplicating it.
  bsamRelation: {
    summary: "RFSAM is complementary to Tarlogic's BSAM, not a replacement. BSAM is an excellent, mature methodology for Bluetooth — but it begins at the link layer and is Bluetooth-only. RFSAM owns the two floors below that (Spectrum and Signal/PHY) for every protocol, and extends to LoRa/LoRaWAN and LTE which BSAM does not cover. For Bluetooth at the link layer and above — discovery data, pairing, authentication, encryption, services, application — RFSAM defers to BSAM: its RFSAM-BLE controls at those layers describe only the RF-capture prerequisite needed to reach the point where the corresponding BSAM control applies, then cite it directly.",
    ownership: [
      { rfsam: "Spectrum (SP) + Signal/PHY", note: "RFSAM-owned for all protocols. BSAM has no coverage here." },
      { rfsam: "BLE link layer and above", note: "Inherited from BSAM. RFSAM adds only the RF prerequisite and cross-references BSAM-xx." },
      { rfsam: "LoRa / LoRaWAN, LTE", note: "RFSAM-owned end to end. BSAM is Bluetooth-only." }
    ],
    priorArt: "RFSAM isn't a claim to have invented RF security — OSSTMM defines a spectrum-security channel, BSAM (Tarlogic) is the mature Bluetooth reference, the SDR-pentest lineage (Ossmann, Black Hat 2008; Picod et al., Black Hat 2014) built the practical tooling, and a deep body of academic RF threat taxonomies exists. What's missing is a single oriented reference that ties that landscape together into something a practitioner can navigate by, end to end, across protocols. RFSAM's purpose is to be that north: structured, numbered controls with verification procedures and real examples, so someone facing an unknown signal has a place to start and a way to know what they've covered.",
    url: "https://www.tarlogic.com/bsam/"
  },

  // BSAM controls RFSAM references (real IDs from tarlogic.com/bsam).
  bsam: {
    "BSAM-IG-01": { title: "Bluetooth controller lifecycle status", url: "https://www.tarlogic.com/bsam/controls/bluetooth-controller-lifecycle-status/" },
    "BSAM-IG-02": { title: "Bluetooth controller vulnerabilities", url: "https://www.tarlogic.com/bsam/controls/bluetooth-controller-vulnerabilities/" },
    "BSAM-IG-03": { title: "Host stack vulnerabilities", url: "https://www.tarlogic.com/bsam/controls/bluetooth-host-stack-vulnerabilities/" },
    "BSAM-IG-04": { title: "Standard vulnerabilities", url: "https://www.tarlogic.com/bsam/controls/bluetooth-standard-vulnerabilities/" },
    "BSAM-DI-03": { title: "Generic device naming", url: "https://www.tarlogic.com/bsam/controls/bluetooth-device-name/" },
    "BSAM-DI-04": { title: "Sensitive data exposure", url: "https://www.tarlogic.com/bsam/controls/bluetooth-data-exposure/" },
    "BSAM-DI-06": { title: "Use random MAC address", url: "https://www.tarlogic.com/bsam/controls/bluetooth-random-mac/" },
    "BSAM-PA-01": { title: "Device pairing mode", url: "https://www.tarlogic.com/bsam/controls/bluetooth-device-pairing-mode/" },
    "BSAM-PA-04": { title: "Rejection of legacy pairing", url: "https://www.tarlogic.com/bsam/controls/bluetooth-rejection-legacy-pairing/" },
    "BSAM-PA-05": { title: "Pairing without interaction", url: "https://www.tarlogic.com/bsam/controls/bluetooth-pairing-without-interaction/" },
    "BSAM-AU-03": { title: "Forced disconnection", url: "https://www.tarlogic.com/bsam/controls/bluetooth-forced-disconnection/" },
    "BSAM-EN-01": { title: "Role switch before encryption", url: "https://www.tarlogic.com/bsam/controls/role-switch-before-bluetooth-encryption/" },
    "BSAM-EN-02": { title: "Force use of encryption", url: "https://www.tarlogic.com/bsam/controls/force-use-encryption-bluetooth/" },
    "BSAM-EN-03": { title: "Minimum encryption key size", url: "https://www.tarlogic.com/bsam/controls/minimum-size-bluetooth-encryption-key/" },
    "BSAM-SE-03": { title: "Service access control", url: "https://www.tarlogic.com/bsam/controls/bluetooth-service-access-control/" },
    "BSAM-AP-05": { title: "Replay attacks", url: "https://www.tarlogic.com/bsam/controls/bluetooth-replay-attacks/" },
    "BSAM-AP-06": { title: "Packet injection", url: "https://www.tarlogic.com/bsam/controls/bluetooth-packet-injection/" }
  },

  // The RF-native layers, in descent order. This is the axis BSAM does not have.
  // IG (Information Gathering) sits before the descent: identify components and
  // check them against known-vulnerability corpora.
  layers: [
    { id: "IG",  name: "Info Gathering", color: "#C9D4E0", note: "Identify the components and cross-reference known CVEs before any RF work." },
    { id: "SP",  name: "Spectrum",   color: "#2FB8E0", note: "What is transmitting, where, and whether you can see it at all." },
    { id: "PHY", name: "Signal / PHY", color: "#3FD17C", note: "From waveform to bits: modulation, demodulation, channelisation." },
    { id: "LL",  name: "Link / Protocol", color: "#9B8CFF", note: "Frame structure, addressing, identifiers, discovery data." },
    { id: "CR",  name: "Crypto",     color: "#FFC24B", note: "Pairing, key exchange, confidentiality and integrity of the link." },
    { id: "AT",  name: "Attack",     color: "#FF7A1A", note: "Active interaction: injection, replay, hijack, rogue infrastructure." },
    { id: "AP",  name: "Application", color: "#FF5A5F", note: "What the device trusts above the link: auth, signing, updates." }
  ],

  criticality: {
    info:     { label: "Info",     color: "#8B9AAB" },
    low:      { label: "Low",      color: "#3FD17C" },
    medium:   { label: "Medium",   color: "#FFC24B" },
    high:     { label: "High",     color: "#FF7A1A" },
    critical: { label: "Critical", color: "#FF5A5F" }
  },

  protocols: [
    { id: "BLE",  name: "Bluetooth Low Energy", band: "2.400–2.480 GHz", prefix: "RFSAM-BLE" },
    { id: "WIFI", name: "Wi-Fi (802.11)",        band: "2.4 / 5 / 6 GHz", prefix: "RFSAM-WIFI" },
    { id: "LORA", name: "LoRa / LoRaWAN",        band: "ISM sub-GHz (US915 / EU868)", prefix: "RFSAM-LORA" },
    { id: "LTE",  name: "LTE / 4G",              band: "Licensed cellular", prefix: "RFSAM-LTE" },
    { id: "RFID", name: "RFID / NFC",            band: "125 kHz LF / 13.56 MHz HF", prefix: "RFSAM-RFID" },
    { id: "SUBG", name: "Sub-GHz ISM / Remotes", band: "315 / 433 / 868 / 915 MHz", prefix: "RFSAM-SUBG" }
  ],

  controls: [
    // ============ BLE vertical slice ============
    {
      id: "RFSAM-BLE-IG-01", protocol: "BLE", layer: "IG", criticality: "high",
      title: "Known vulnerabilities of the SoC and host stack",
      applicability: ["BLE", "BR/EDR"],
      deferred: true,
      intro: "Identifying the silicon and stack and checking them against the published Bluetooth vulnerability corpus is BSAM's territory and BSAM does it thoroughly. RFSAM defers to the BSAM Information Gathering controls here and does not duplicate them.",
      description:
        "A large share of real-world BLE compromise is an unpatched SoC or host stack with a known, named, CVE-tracked flaw — KNOB, BIAS, the SweynTooth family (incl. the Zero-LTK Secure-Connections bypass), BLEEDINGBIT, BLURtooth, BleedingTooth. BSAM already provides mature controls for exactly this: controller lifecycle status, controller vulnerabilities, host-stack vulnerabilities, and standard vulnerabilities. RFSAM does not re-derive them. This control exists only to place that step in the RF assessment flow and route the auditor to BSAM. The named-attack corpus below is provided as orientation, not as a substitute for the BSAM controls.",
      procedure: [
        "Identify the SoC/controller and host stack (FCC ID, advertising fingerprint, teardown).",
        "Run the BSAM Information Gathering controls (see cross-reference) against the identified components.",
        "Record patch status and known-CVE exposure per the BSAM procedure.",
        "Carry the result forward as scoping input to the RFSAM SP/PHY capture controls."
      ],
      bsam: ["BSAM-IG-01", "BSAM-IG-02", "BSAM-IG-03", "BSAM-IG-04"],
      resources: ["RFSAM-RES-04"],
      attacks: [
        { name: "SweynTooth", ref: "Garbelini et al., 2020 — 18 vulns, e.g. CVE-2019-19194 (Zero LTK)", what: "Family of link-layer flaws across NXP, Cypress, Telink, Dialog, Microchip, STM SoCs: deadlocks, crashes, buffer overflows, and a full Secure-Connections bypass. Catalogued in detail by BSAM-IG-02." },
        { name: "KNOB", ref: "CVE-2019-9506", what: "Key-entropy downgrade in BR/EDR encryption negotiation. Assessed under BSAM-EN-03 (minimum key size) and BSAM-IG-04." },
        { name: "BLEEDINGBIT", ref: "CVE-2018-16986 / CVE-2018-7080", what: "RCE and OTA-backdoor in TI CC2640/CC2650 chips. A controller-vulnerability case under BSAM-IG-02." },
        { name: "BleedingTooth", ref: "CVE-2020-12351 et al.", what: "Zero-click RCE in the Linux BlueZ stack. A host-stack-vulnerability case under BSAM-IG-03." }
      ],
      example:
        "Because BSAM already maps SoC and stack to their known-CVE exposure, the RFSAM flow simply runs the BSAM-IG controls at this stage and records the outcome. The value RFSAM adds is sequencing: the component inventory from this step scopes which SP/PHY capture controls are worth running (e.g. an end-of-life, unpatchable SoC may make dynamic RF testing moot — the finding is already decisive).",
      remediation: "Follow the remediation of the cited BSAM-IG controls: keep firmware/stack patched, track SoC-vendor advisories and the Bluetooth SIG erratum feed, and treat end-of-life controllers with no patch path as high-risk."
    },
    {
      id: "RFSAM-BLE-SP-01", protocol: "BLE", layer: "SP", criticality: "info",
      title: "Channel map and capture feasibility",
      applicability: ["BLE"],
      intro: "Before any analysis, establish whether the BLE channels of interest can actually be observed with the available hardware. BLE spreads across 40 channels over 80 MHz with frequency hopping every 7.5 ms — wider than most affordable SDRs can capture at once.",
      description:
        "BLE occupies 2.400–2.480 GHz: 3 primary advertising channels (37, 38, 39 at 2402, 2426, 2480 MHz) and 37 data channels. Connections hop across the data channels following a map negotiated at connection time. A receiver that sees only a 20 MHz slice (e.g. a HackRF One) cannot observe all three advertising channels simultaneously, nor follow a hopping connection without either channel-following logic or full-band capture. This control records the observable bandwidth, the hopping interval, and therefore which later controls are reachable with the current setup.",
      procedure: [
        "Identify the receiver's usable instantaneous bandwidth (HackRF ≈ 20 MHz, USRP B210 ≈ 56 MHz, bladeRF 2.0 ≈ 61 MHz).",
        "Confirm whether the full 80 MHz BLE band can be captured in one pass or must be tuned/channelised.",
        "If full-band capture is not possible, determine whether the toolchain can follow the connection's hop sequence (see RFSAM-RES-02).",
        "Record the gap: which advertising/data channels are observable simultaneously."
      ],
      resources: ["RFSAM-RES-01", "RFSAM-RES-02"],
      example:
        "With a HackRF One (20 MHz) only one advertising channel is visible at a time; the three advertising channels span 78 MHz, so simultaneous capture is impossible. Tuning to 2402 MHz still reliably catches channel 37 advertisements, which is enough for discovery (RFSAM-BLE-LL-01) but not for following a live connection. A USRP B210 or bladeRF covers ~56–61 MHz, enough to channelise most of the band with GPU assistance (RFSAM-RES-03).",
      remediation: "Not a device finding — this is an auditor-capability baseline. Document the hardware envelope so later results are interpreted correctly (a 'not observed' is not a 'not present')."
    },
    {
      id: "RFSAM-BLE-PHY-01", protocol: "BLE", layer: "PHY", criticality: "info",
      title: "Wideband channelisation under hardware limits",
      applicability: ["BLE"],
      intro: "When the band is wider than the SDR's bandwidth, the auditor must channelise: split a wide I/Q stream into per-channel streams. Done naively on CPU this collapses; the control verifies a viable channelisation path exists so that connection-following and full-band sniffing become possible.",
      description:
        "Following a BLE connection across 37 data channels ideally needs the whole 80 MHz band demodulated in parallel. Splitting 80 MHz of I/Q into ~40 channels of 2 MHz melts a commodity CPU — thermal throttling and dropped samples produce silent failure (you think you are capturing, but frames are missing). A polyphase channeliser offloaded to the GPU (OpenCL / VkFFT) makes this tractable in real time. This control checks that the toolchain channelises without sample loss, because every link-layer and attack control for BLE depends on clean per-channel bits.",
      procedure: [
        "Capture a known advertiser while logging dropped-sample / overflow counters.",
        "Run the channeliser (CPU first) and confirm whether overflows occur at full band.",
        "Move channelisation to GPU (polyphase + VkFFT) and re-check counters at sustained real-time rate.",
        "Validate by decoding a known advertisement on a non-primary channel."
      ],
      resources: ["RFSAM-RES-03"],
      example:
        "Dividing the 80 MHz BLE band into 40× 2 MHz channels on CPU drops samples within seconds (thermal throttling, no error raised). Offloading the polyphase channeliser to a GPU via OpenCL/VkFFT — the approach used by the ice9-bluetooth-sniffer project — sustains real-time capture of dozens of BLE channels simultaneously, moving the bottleneck from silicon to software and recovering signal ~30 dB below where a naive setup fails.",
      remediation: "Auditor-side capability. If GPU channelisation is unavailable, restrict scope to advertising-channel work and declare connection-following out of scope rather than reporting false negatives."
    },
    {
      id: "RFSAM-BLE-LL-01", protocol: "BLE", layer: "LL", criticality: "medium",
      title: "Sensitive data in advertising packets",
      applicability: ["BLE"],
      intro: "BLE advertising packets are transmitted in the clear and readable by any passive observer. Manufacturer-specific data, device names, and service UUIDs frequently leak product identity, user identity, or trackable identifiers. The link-layer judgement of what counts as over-exposure is BSAM's (BSAM-DI-03/04); RFSAM adds the SP-layer capture that produces the beacons to inspect.",
      description:
        "Advertising data (AdvData) carries AD structures including the complete/shortened local name, service UUIDs, and Manufacturer Specific Data (type 0xFF). None of this requires a connection or pairing to read. Device names often embed product model or even user-chosen labels; manufacturer data may embed serial numbers or rotating-but-linkable tokens. This control captures advertisements and inventories every field for sensitive or identity-bearing content.",
      procedure: [
        "Passively capture advertisements on channels 37/38/39 (see RFSAM-RES-04).",
        "Parse all AD structures: local name, service UUIDs, Manufacturer Specific Data (0xFF).",
        "Flag human-meaningful names, embedded serials, and non-rotating identifiers.",
        "Cross-reference manufacturer ID against the Bluetooth Assigned Numbers list."
      ],
      resources: ["RFSAM-RES-04"],
      bsam: ["BSAM-DI-04", "BSAM-DI-03"],
      attacks: [
        { name: "BLE device fingerprinting / tracking", ref: "Becker et al., PETS 2019", what: "Even with address randomisation, identifying information in advertising payloads (manufacturer data, GATT signatures) allows passive tracking — the leak this control inventories." }
      ],
      example:
        "In a passive sweep of an ordinary room, advertisers surfaced human-readable names exposing device class and ownership directly in the clear: a pet tracker advertising as 'PwnPet_C81F', an asset tracker as 'TRKM_608015814_7795', and several earbuds/wearables broadcasting model strings. No connection was made — the identity leak is in discovery alone.",
      remediation: "Use generic, non-identifying device names. Move model/serial data behind an authenticated connection. Avoid placing any stable identifier in Manufacturer Specific Data."
    },
    {
      id: "RFSAM-BLE-LL-02", protocol: "BLE", layer: "LL", criticality: "low",
      title: "Persistent (non-rotating) device address",
      applicability: ["BLE"],
      intro: "BLE supports private resolvable addresses (RPA) that rotate to prevent tracking. Devices using a fixed public or static address can be followed across time and locations by any passive observer. The control judgement here is BSAM-DI-06's; RFSAM captures the advertisements that let you classify the address.",
      description:
        "A device's advertising address is either Public, Random Static, Random Private Resolvable (RPA), or Random Private Non-resolvable (NRPA). Public and Static addresses do not rotate; an observer can correlate a device's presence across sessions and physical locations purely passively. RPA/NRPA rotate and break that correlation (good hygiene). This control classifies the address type for every discovered device and flags persistent ones.",
      procedure: [
        "Capture advertisements and record the address and its type bits.",
        "Classify each as Public / Static / RPA / NRPA.",
        "Flag Public and Static as persistently trackable.",
        "Note that 'rotating' protects privacy only — it does not protect against control (see attack controls)."
      ],
      resources: ["RFSAM-RES-04"],
      bsam: ["BSAM-DI-06"],
      example:
        "In the same room sweep, 33 of 85 devices advertised with non-rotating Public or Static addresses — persistently trackable across time and place. The remainder used RPA/NRPA and rotated correctly. Address hygiene and exploitability are independent: several rotating-address devices were still fully controllable (RFSAM-BLE-AT-01), and several fixed-address devices exposed nothing writable.",
      remediation: "Use Random Private Resolvable addresses with a sensible rotation interval. Reserve Public addresses for devices where tracking is not a concern."
    },
    {
      id: "RFSAM-BLE-CR-01", protocol: "BLE", layer: "CR", criticality: "high",
      title: "Unencrypted / Just-Works access to GATT",
      applicability: ["BLE"],
      intro: "If a peripheral exposes its GATT services without requiring pairing or encryption, any nearby device can read and write characteristics. 'Just-Works' pairing provides no MITM protection and is, for assessment purposes, equivalent to no barrier. The pairing/encryption/service-access controls themselves are BSAM's (BSAM-PA, BSAM-EN, BSAM-SE); RFSAM reaches them once the device is captured and connected, and adds the cross-layer observation that link encryption does not imply per-characteristic authorisation.",
      description:
        "The strongest practical barrier in BLE is LE Secure Connections with authenticated pairing. Devices that accept connections and serve readable/writable GATT characteristics without encryption — or that only offer Just-Works (numeric association with no out-of-band or passkey check) — expose their entire attack surface to any peer. Crucially, link-layer encryption alone is insufficient: a device may negotiate LESC yet still leave individual characteristics writable without authentication. This control connects, enumerates GATT, and records which characteristics are accessible without a cryptographic barrier.",
      procedure: [
        "Connect to the peripheral without initiating pairing.",
        "Enumerate the GATT table; attempt reads on all readable characteristics.",
        "Identify writable characteristics reachable without encryption/authentication.",
        "Record whether the device rejects, permits, or only offers Just-Works pairing.",
        "Note any device that negotiates LESC but still exposes unauthenticated writable handles."
      ],
      resources: ["RFSAM-RES-04", "RFSAM-RES-05"],
      bsam: ["BSAM-PA-01", "BSAM-PA-04", "BSAM-PA-05", "BSAM-EN-02", "BSAM-SE-03"],
      attacks: [
        { name: "KNOB", ref: "CVE-2019-9506", what: "Forces encryption-key negotiation down to 1 byte of entropy, making the link brute-forceable. Assessed in depth under BSAM-EN-03." },
        { name: "BIAS", ref: "Antonioli et al., IEEE S&P 2020", what: "Impersonation during authentication: the attacker poses as a previously-paired device without the link key, exploiting role-switch and legacy authentication. Tests the 'authenticated pairing' assumption." },
        { name: "SweynTooth — Zero LTK Installation", ref: "CVE-2019-19194", what: "Forces an encryption setup with a zero-filled Long Term Key, fully bypassing LE Secure Connections on affected Telink/other SoCs. Directly attacks the barrier this control checks for." }
      ],
      example:
        "An audit-on-discovery sweep of 85 devices flagged 6 as VULNERABLE: GATT readable and writable with no pairing or encryption. Writable-handle counts ranged from 1 to 16 per device. One device (5D:C4:...:17) had negotiated LE Secure Connections with MITM and still left 4 characteristics writable without authentication — proving that link encryption ≠ application authorisation, and echoing the SweynTooth Zero-LTK class where 'secure' pairing is bypassable. The ELK-BLEDOM LED controller exposed control handle 0x000E directly, making it the safe demonstration target.",
      remediation: "Require LE Secure Connections with authenticated pairing AND enforce a minimum encryption key size (defeats KNOB). Verify the SoC is patched against SweynTooth Zero-LTK. Enforce per-characteristic authorisation independently of link encryption. Reject legacy and Just-Works pairing for any device exposing control surfaces."
    },
    {
      id: "RFSAM-BLE-AT-01", protocol: "BLE", layer: "AT", criticality: "critical",
      title: "Live connection hijacking",
      applicability: ["BLE"],
      intro: "An unencrypted BLE connection can be taken over: the attacker follows the connection's channel hopping, then transmits as the master, evicting the legitimate central and gaining full control of the peripheral. RFSAM owns the PHY-layer prerequisite — following the hop sequence well enough to inject — while the link-layer injection and forced-disconnection findings are assessed under BSAM (BSAM-AP-06, BSAM-AU-03, BSAM-EN-01).",
      description:
        "Connection hijacking follows the hop sequence of an established connection, stabilises over several connection events, then injects link-layer traffic as the master role. The original central desynchronises and is evicted; the peripheral now answers to the attacker. Because no pairing key is needed when the link is unencrypted, Just-Works/unencrypted devices have no cryptographic barrier to this. The clean operational pattern is hijack → terminate → reconnect: rather than fight the phone for the link, send LL_TERMINATE_IND as the new master, let the device re-advertise, and reconnect for full, uncontested GATT control.",
      procedure: [
        "Sniff the target connection and learn the control handle and command format from legitimate traffic (RFSAM-RES-04).",
        "Stabilise following over N connection events, then hijack the master role (RFSAM-RES-06).",
        "Verify takeover by writing the learned command and observing device response.",
        "Optionally terminate (LL_TERMINATE_IND) and reconnect cleanly for full GATT access.",
        "Document the desynchronisation of the original central."
      ],
      resources: ["RFSAM-RES-04", "RFSAM-RES-06"],
      bsam: ["BSAM-AP-06", "BSAM-AU-03", "BSAM-EN-01"],
      attacks: [
        { name: "InjectaBLE", ref: "Cayre et al., 2021", what: "Injects malicious packets into an established BLE connection by exploiting the predictability of the connection event timing, leading to hijacking of either central or peripheral role. The canonical reference for connection injection." },
        { name: "BtleJack", ref: "Cauquil, DEF CON 26", what: "Sniffs, jams and hijacks BLE connections using low-cost hardware; established the practical hijack-by-following-the-hop-sequence technique this control verifies." },
        { name: "BLESA", ref: "CVE-2020-9770", what: "Spoofing attack abusing the optional reconnection authentication: many stacks do not require re-authentication on reconnect, allowing a hijacker that forces a reconnect to impersonate the peer." }
      ],
      example:
        "Against the ELK-BLEDOM LED controller: sniffing the vendor app setting a colour revealed handle 0x000E with format 7e 07 05 RR GG BB 10 ef. After hijacking the live connection (DATA→CENTRAL), writing `w 0x000e 7e 07 05 03 ff 00 00 10 ef` drove the strip to the attacker's colour. The same technique applies unchanged to locks and medical devices — the LED strip is merely the harmless, vivid demonstration. A real implementation detail: the decoder's current Access Address must be set to the connection AA only after reaching CENTRAL (with a flush first), because advertisements seen during INITIATING reset it to the advertising AA and silently break data-PDU decoding.",
      remediation: "Encrypt the link with LE Secure Connections — this defeats following, injection, and hijacking. Add application-layer command authentication so a hijacked link still cannot issue trusted commands. Treat the link as untrusted by default."
    },

    // ============ LoRa / LoRaWAN vertical slice ============
    {
      id: "RFSAM-LORA-SP-01", protocol: "LORA", layer: "SP", criticality: "info",
      title: "Sub-noise reception and band survey",
      applicability: ["LoRa", "LoRaWAN"],
      intro: "LoRa's chirp spread spectrum is designed to be received below the thermal noise floor. The auditor must confirm the toolchain can recover signals at strongly negative SNR before concluding a band is quiet.",
      description:
        "LoRa uses Chirp Spread Spectrum (CSS): a linear frequency sweep that the receiver de-chirps, integrating signal energy across the symbol and yielding processing gain. At SF12/BW125 the link closes around −148 dBm — roughly 20 dB below the thermal noise floor. A spectrum survey that only looks for energy above the noise floor will declare a busy LoRaWAN band empty. This control verifies that capture and de-chirping recover sub-noise transmissions, and surveys the ISM sub-band (US915 / EU868) for active channels.",
      procedure: [
        "Capture the relevant ISM sub-band (US915: 902–928 MHz; EU868) to raw I/Q.",
        "Confirm the receiver's effective sensitivity reaches the SF/BW of interest (≈ −148 dBm at SF12/BW125).",
        "De-chirp to recover symbols below the noise floor; verify against a known transmitter.",
        "Map active channels and spreading factors present."
      ],
      resources: ["RFSAM-RES-01", "RFSAM-RES-07"],
      example:
        "Surveying US915, transmissions invisible on a plain FFT (sitting ~20–30 dB below the thermal floor) resolve cleanly after de-chirping. Establishing this processing-gain baseline is what lets a passive observer see an entire LoRaWAN deployment that a naive energy-detector would miss.",
      remediation: "Auditor-capability baseline. Spread-spectrum reception is an inherent property; there is no device-side remediation — the point is to ensure the assessment does not produce false negatives."
    },
    {
      id: "RFSAM-LORA-PHY-01", protocol: "LORA", layer: "PHY", criticality: "info",
      title: "Soft-decision demodulation of LoRa symbols",
      applicability: ["LoRa", "LoRaWAN"],
      intro: "Recovering LoRa bits reliably at low SNR requires soft-decision demodulation. Hard-decision (nearest-bin) decoding throws away confidence information and loses frames at the edge of the link budget.",
      description:
        "After de-chirping, each symbol maps to a frequency bin. Hard-decision decoding picks the strongest bin and emits 1/0; near the noise floor this is brittle. Soft-decision decoding keeps the per-bin likelihoods and feeds them to error correction, recovering frames a hard decoder drops — measurably better BER at the same SNR. This control confirms the demodulation path is soft-decision so that link-layer capture (RFSAM-LORA-LL-01) is not silently lossy.",
      procedure: [
        "Demodulate a captured channel with hard-decision decoding; record frame yield.",
        "Repeat with soft-decision decoding (e.g. gr-lora_sdr).",
        "Compare frame yield / BER at equal SNR.",
        "Adopt soft-decision for all subsequent LoRaWAN capture."
      ],
      resources: ["RFSAM-RES-07"],
      example:
        "On the same captured LoRa channel, soft-decision decoding (gr-lora_sdr) recovers roughly 25% more bits at equivalent BER than hard-decision — frames that a nearest-bin decoder silently loses at the edge of the link budget. For a passive survey aiming to enumerate a network, that 25% is the difference between seeing a device and missing it.",
      remediation: "Auditor-side. Use a soft-decision LoRa demodulator for assessment; treat hard-decision-only yields as a lower bound, not a complete picture."
    },
    {
      id: "RFSAM-LORA-LL-01", protocol: "LORA", layer: "LL", criticality: "high",
      title: "Cleartext join metadata and identity harvesting",
      applicability: ["LoRaWAN"],
      intro: "LoRaWAN encrypts application payloads (AES-128) but transmits join-procedure metadata and frame headers in the clear. A passive observer can harvest device and application identifiers across an entire deployment without transmitting.",
      description:
        "In LoRaWAN OTAA, the JoinRequest carries AppEUI, DevEUI, and DevNonce in cleartext. Data frames expose the MAC header (MHDR) and DevAddr in clear even though the payload is AES-128 encrypted. A passive receiver therefore maps the network — which devices exist, which join, how often — and harvests stable identifiers fleet-wide. A high proportion of JoinRequests relative to data frames is itself a finding: it indicates devices repeatedly failing to join (lost downlinks, bad coverage, mis-provisioned keys), and a network broadcasting its own poor health. This control captures and classifies frame types and inventories the cleartext identity fields.",
      procedure: [
        "Passively capture the target channels (RFSAM-RES-07) and decode frame structure.",
        "Classify by MType (JoinRequest, JoinAccept, Un/ConfirmedDataUp/Down, etc.).",
        "Extract cleartext AppEUI / DevEUI / DevNonce from JoinRequests and DevAddr from data frames.",
        "Compute the JoinRequest-to-data ratio as a network-health and attack-surface indicator.",
        "Flag repeated DevNonce values (replay exposure)."
      ],
      resources: ["RFSAM-RES-07"],
      attacks: [
        { name: "ABP replay attack", ref: "van Es et al., 'Security Vulnerabilities in LoRaWAN', IoTDI 2018", what: "ABP session keys persist across counter resets; replaying captured frames after a device reboot is accepted because the frame counter restarts. Harvested cleartext headers identify replayable targets." },
        { name: "Keystream-reuse eavesdropping", ref: "van Es et al., IoTDI 2018", what: "LoRaWAN encrypts with AES in CTR-like mode keyed by the frame counter. On counter reset with a static key, identical keystream recurs — classic two-time-pad, recoverable by XORing ciphertexts seen passively." },
        { name: "Bit-flipping (NS to AS leg)", ref: "Trend Micro, 2021; Lee et al., ICOIN 2017", what: "The MIC protects the device-to-network-server leg, but the decrypted payload forwarded network-server-to-application-server is unprotected and tamperable. Passive capture of frame structure is the first step to scoping it." }
      ],
      example:
        "A passive US915 capture of 51,304 LoRaWAN frames showed 45,815 (89.3%) were JoinRequests — nine of every ten frames were devices trying, and failing, to join. The structure read entirely in the clear (MHDR + DevAddr; AppEUI/DevEUI/DevNonce in the join), letting an attacker harvest the fleet's identities and map the network without ever transmitting. The payloads stayed AES-protected — but the metadata alone profiled the deployment and exposed it as misconfigured.",
      remediation: "Minimise join churn through correct provisioning and downlink coverage (reduces harvestable JoinRequests). Treat DevEUI/AppEUI as non-secret but rotate DevNonce correctly to prevent replay. Where the threat model allows, prefer ABP with managed counters or LoRaWAN 1.1 join-server protections."
    },
    {
      id: "RFSAM-LORA-CR-01", protocol: "LORA", layer: "CR", criticality: "medium",
      title: "DevNonce reuse and join replay exposure",
      applicability: ["LoRaWAN"],
      intro: "LoRaWAN join security depends on DevNonce freshness. Devices that repeat DevNonce values across joins expose themselves to JoinRequest replay and, in weak implementations, session-key recovery paths.",
      description:
        "Each OTAA join should present a fresh DevNonce; the network rejects replays. Implementations that reuse or cycle DevNonce predictably (common on cheap or older stacks) allow an attacker to replay captured JoinRequests or to correlate sessions. Because JoinRequests are cleartext (RFSAM-LORA-LL-01), nonce behaviour is observable passively. This control analyses captured joins per DevEUI for nonce freshness and predictability.",
      procedure: [
        "Group captured JoinRequests by DevEUI.",
        "Extract the DevNonce sequence per device.",
        "Flag repeats, monotonic-but-predictable counters, or small nonce spaces.",
        "Assess against the network's stated LoRaWAN version (1.0.x vs 1.1)."
      ],
      resources: ["RFSAM-RES-07"],
      attacks: [
        { name: "DevNonce birthday-paradox reuse", ref: "LoRaWAN Security Survey, 2022", what: "In LoRaWAN 1.0.3 the DevNonce is a 16-bit device-generated value; over a 10-year lifetime collision is near-certain (birthday paradox), and reboots/counter-resets cause outright reuse — enabling JoinRequest replay." },
        { name: "Weak RNG entropy (SX1272 RSSI-LSB)", ref: "LoRaWAN Security Survey, 2022", what: "Low-cost nodes seed their RNG from RSSI least-significant bits with no health tests; the resulting DevNonce sequence is predictable and can be biased further by targeted RF jamming." },
        { name: "Join replay", ref: "Na et al., ICOIN 2017", what: "Captured JoinRequest messages are replayed to force rejoin/denial conditions; cleartext joins (RFSAM-LORA-LL-01) make the capture trivial." }
      ],
      example:
        "Because the 51,304-frame capture was dominated by JoinRequests, DevNonce behaviour per device was directly observable in the clear — the prerequisite for spotting reuse. (Worked nonce-reuse case to be completed from the auditor's own per-DevEUI analysis of the capture.)",
      remediation: "Use a cryptographically random or correctly monotonic DevNonce per the LoRaWAN spec; adopt 1.1 join-server protections where possible. Network-side, enforce strict DevNonce tracking and reject replays."
    },

    // ============ LTE vertical slice ============
    {
      id: "RFSAM-LTE-IG-01", protocol: "LTE", layer: "IG", criticality: "high",
      title: "Known vulnerabilities of the baseband and RAN/core stack",
      applicability: ["LTE", "5G NSA"],
      intro: "LTE has two distinct vulnerable software surfaces, both heavily CVE-tracked: the device-side baseband (the modem SoC running its own RTOS) and the network-side RAN/core stack (eNodeB + EPC). Before behavioural testing, identify both and cross-reference the published corpora. Unlike BLE, BSAM does not cover cellular — RFSAM owns this control end to end.",
      description:
        "The baseband is a second computer in every phone, running a real-time OS on its own core with firmware reachable over the air. Memory-corruption bugs there yield remote code execution below the application processor — demonstrated repeatedly across Qualcomm, Samsung Shannon/Exynos, MediaTek and UNISOC chipsets. Symmetrically, the network side (eNodeB/EPC, increasingly open-source) parses attacker-influenced NAS/RRC messages and has been shown to crash or be exploited by a single unauthenticated packet — city-wide denial of service with no SIM required. This control inventories the device baseband vendor/version and (where the eNodeB/EPC is in scope) the RAN/core implementation, then cross-references both against the corpora below. It is the LTE analogue of RFSAM-BLE-IG-01.",
      procedure: [
        "Identify the device baseband vendor and firmware (Qualcomm / Shannon-Exynos / MediaTek / UNISOC) from device data or modem.bin teardown.",
        "Where the network is in scope, identify the eNodeB/EPC stack (srsRAN, Open5GS, OpenAirInterface, Magma, NextEPC, Athonet, SD-Core) and version.",
        "Cross-reference the baseband against vendor security bulletins and the LLFuzz/Weinmann L2 corpus.",
        "Cross-reference the RAN/core stack against RANsacked (97 CVEs) and the srsRAN/UNISOC NAS-parsing CVEs.",
        "Record patch status; flag end-of-life basebands and unpatched open-source cores as high-risk."
      ],
      resources: ["RFSAM-RES-08"],
      attacks: [
        { name: "RANsacked", ref: "Univ. Florida / NC State, 2025 — 97 CVEs", what: "Domain-informed fuzzing of LTE/5G RAN-core interfaces found 119 vulnerabilities across srsRAN, Open5GS, Magma, OpenAirInterface, NextEPC, Athonet and SD-Core. A single unauthenticated packet can persistently crash the MME/AMF — city-wide outage, no SIM required." },
        { name: "UNISOC NAS stack overflow", ref: "CVE-2022-20210", what: "Missing bounds checks in NAS message parsing (mirrored in srsRAN's liblte_mme unpack functions) overflow fixed-size buffers from a malicious ATTACH_ACCEPT, crashing or corrupting the modem. Check Point, 2022." },
        { name: "Qualcomm FastRPC use-after-free", ref: "CVE-2024-43047 (CVSS 7.8, exploited)", what: "Actively-exploited baseband-adjacent use-after-free flagged by Google TAG and Amnesty Security Lab — illustrates that baseband/DSP bugs reach real targeted-surveillance use." },
        { name: "LLFuzz baseband L2 bugs", ref: "KAIST, 2025 — 7 CVEs", what: "Over-the-air fuzzing of cellular Layer-2 across 15 commercial phones (Apple, Samsung, Google, Xiaomi) found 11 memory-corruption bugs in PDCP/RLC/MAC/RRC; e.g. Exynos RLC DoS crashing the modem with a malformed radio packet." },
        { name: "Baseband remote RCE (Shannon/Weinmann)", ref: "Weinmann, WOOT 2012; Tencent KeenLab, 2021", what: "Foundational and modern demonstrations of remote code execution in baseband firmware (Samsung Shannon among them) by exploiting memory corruption in over-the-air message handling." }
      ],
      example:
        "Identifying the stack first reframes the LTE engagement exactly as it does for BLE. If the in-scope eNodeB/EPC is an unpatched srsRAN or Open5GS build, the RANsacked corpus already lists single-packet MME-crash CVEs before any custom fuzzing — the finding may be decisive on inventory alone. On the device side, a baseband on an unpatched Qualcomm/Exynos/UNISOC release carries known RCE/DoS exposure independent of how the cell is configured.",
      remediation: "Network side: patch the RAN/core stack against RANsacked and NAS-parsing CVEs; never expose an unauthenticated MME/AMF to attacker-reachable packets. Device side: keep baseband firmware current via OEM updates; treat end-of-life basebands with no patch path as high-risk. There is no BSAM equivalent to defer to — cellular is RFSAM's domain."
    },
    {
      id: "RFSAM-LTE-SP-01", protocol: "LTE", layer: "SP", criticality: "info",
      title: "Operator, band and cell identification",
      applicability: ["LTE"],
      intro: "LTE assessment begins by identifying which operator, band and physical cell to observe. The correct EARFCN and PCI must be established before any capture is meaningful.",
      description:
        "An LTE deployment is a grid of cells, each on a downlink EARFCN with a Physical Cell Identity (PCI, 0–503). Before capturing, the auditor must establish the operators present, their bands, and the EARFCNs/PCIs of nearby cells. This is doable with a scanning modem plus cell-search software, and it scopes every later LTE control. This control records the operator/band/EARFCN/PCI inventory of the environment.",
      procedure: [
        "Scan the cellular bands with a capable modem to list operators and EARFCNs.",
        "Run cell search to recover PCI from PSS/SSS for each cell.",
        "Record operator ↔ band ↔ EARFCN ↔ PCI mapping.",
        "Select target cells and confirm they are within the SDR's capture envelope."
      ],
      resources: ["RFSAM-RES-08"],
      example:
        "A scan in Mexico surfaced 5 cells, 4 of them sniffable: Telcel on B4/B66/B5 and AT&T on B2, with real PCIs (58 / 287 / 301) and measured EARFCNs. Knowing operator, band and EARFCN is the prerequisite — without it, capture is aimed at nothing.",
      remediation: "Environmental baseline, not a device finding. Documents scope and target selection for the LTE assessment."
    },
    {
      id: "RFSAM-LTE-PHY-01", protocol: "LTE", layer: "PHY", criticality: "info",
      title: "OFDM capture with coherent timing",
      applicability: ["LTE"],
      intro: "LTE's OFDM physical layer is the wall that stops naive capture: 1200+ subcarriers, tight timing, and a reference clock requirement. The control verifies the capture chain is coherent enough to demodulate the resource grid.",
      description:
        "LTE downlink is OFDMA — over a thousand subcarriers carrying QAM, with a cyclic prefix and strict frame/symbol timing (10 ms frame, 1 ms subframe, 0.5 ms slot). Demodulating the resource grid requires accurate frequency and timing reference; a free-running SDR clock drifts and corrupts the grid. A disciplined oscillator (GPSDO) provides the coherence. This control confirms the SDR locks to a stable reference and recovers the OFDM grid (PSS/SSS → MIB → grid) before attempting higher-layer decode.",
      procedure: [
        "Lock the SDR to a disciplined reference (GPSDO) and confirm clock rate.",
        "Capture the target EARFCN and recover PSS/SSS timing.",
        "Decode MIB from PBCH to obtain bandwidth and frame number.",
        "Verify the resource grid demodulates cleanly (no timing-induced corruption)."
      ],
      resources: ["RFSAM-RES-08", "RFSAM-RES-09"],
      example:
        "A 2× USRP B210 rig with GPSDO, clock locked at 23.04 MHz, passed register loopback and presented a coherent receiver ready to capture. With the reference disciplined, the OFDM grid demodulates reliably; without it, the same capture degrades into timing-corrupted symbols. (A documented field failure: MIB decode succeeded on a desktop host but failed on a NUC — a reminder that host I/O, not just the SDR, affects coherent capture.)",
      remediation: "Auditor-side. Use a disciplined reference for any OFDM capture and validate the host can sustain the sample rate; otherwise report capture quality as a limiting factor."
    },
    {
      id: "RFSAM-LTE-LL-01", protocol: "LTE", layer: "LL", criticality: "high",
      title: "Passive control-channel decode and identifier exposure",
      applicability: ["LTE"],
      intro: "LTE control channels (PDCCH) and broadcast information are decodable passively. Blind decoding reveals scheduling, RNTIs, and — depending on configuration — identity information, all without transmitting.",
      description:
        "The PDCCH carries downlink control information (DCI) addressed by RNTIs; decoding it is a blind search over candidate locations, validated by CRC masked with the RNTI. A passive receiver that recovers the grid (RFSAM-LTE-PHY-01) can follow scheduling and enumerate active RNTIs per cell, building a picture of cell load and activity. Combined with broadcast SIBs and paging, this exposes operational metadata and, in some conditions, subscriber-identity exposure paths. This control performs passive PDCCH/broadcast decode and inventories what identity and scheduling information is recoverable.",
      procedure: [
        "From the recovered grid, run blind PDCCH decode (search space → candidate → Viterbi → CRC⊕RNTI).",
        "Enumerate active RNTIs and observed DCI per subframe.",
        "Decode broadcast SIBs and paging for cell configuration and identity exposure.",
        "Record which identifiers and scheduling data are recoverable purely passively."
      ],
      resources: ["RFSAM-RES-08", "RFSAM-RES-10"],
      attacks: [
        { name: "IMSI catching / False Base Station", ref: "Yu et al., 'LTE Phone Number Catcher', 2019; NIST 2025", what: "A rogue eNodeB induces UEs to disclose IMSI (and via MSISDN translation, phone number) because identity is sent before ciphering and broadcast messages lack integrity protection. Built from COTS SDR." },
        { name: "aLTEr", ref: "Rupprecht et al., IEEE S&P 2019", what: "User-plane data is encrypted with AES-CTR but not integrity-protected, so it is malleable: an active MITM redirects DNS by bit-flipping ciphertext without breaking encryption. Exploits the same integrity gap visible in passive analysis." },
        { name: "LTEInspector", ref: "Hussain et al., NDSS 2018", what: "Systematic adversarial testing of LTE attach/paging/detach procedures, surfacing authentication-relay, paging-channel hijack and DoS flaws — the procedural attacks downstream of the passive view this control builds." },
        { name: "ReVoLTE", ref: "Rupprecht et al., USENIX Security 2020", what: "Keystream reuse across VoLTE calls on the same radio bearer allows decryption of an encrypted call by capturing a subsequent call — a keystream-reuse flaw in the radio layer." }
      ],
      example:
        "Following PSS → MIB → DCI → PDSCH in strict order, passive blind decode of the PDCCH typically searches up to ~44 candidates per subframe per active cell, validating each by CRC masked with the candidate RNTI. The result is a passive view of cell scheduling and active RNTIs — operational metadata extracted without transmitting, using only open-source tooling (LTESniffer / FALCON class) on a coherent SDR.",
      remediation: "Largely an operator/standard concern: passive control-channel exposure is inherent to LTE. Mitigations live in the standard (identity protection, paging changes) and in 5G's improved identifier confidentiality; for assessment, the control documents the exposure rather than a device fix."
    },

    // ============ Wi-Fi vertical slice ============
    {
      id: "RFSAM-WIFI-SP-01", protocol: "WIFI", layer: "SP", criticality: "info",
      title: "Band, channel and monitor-mode capture feasibility",
      applicability: ["802.11 b/g/n", "802.11 ac/ax"],
      intro: "Wi-Fi assessment depends on a radio that can enter monitor mode and inject on the target band. 2.4 GHz is universally reachable; 5 and 6 GHz need a capable chipset. This control establishes which channels are observable and whether injection is possible before any attack.",
      description:
        "802.11 spans 2.4 GHz (14 channels), 5 GHz (many channels, DFS-restricted), and 6 GHz (Wi-Fi 6E). Assessment requires an adapter whose chipset supports monitor mode (passive capture of all frames) and, for active controls, frame injection. Not every adapter does both on every band — the classic ALFA AWUS036ACH (RTL8812AU) covers 2.4/5 GHz with injection; many built-in cards cannot inject at all. This control records the adapter capability and the channel survey so later controls are scoped honestly: a 'not seen' on an unsupported band is a capability gap, not an all-clear.",
      procedure: [
        "Identify the adapter chipset and confirm monitor-mode + injection support (e.g. aireplay-ng --test).",
        "Survey 2.4/5/6 GHz for APs and channels in scope.",
        "Record which bands the hardware can capture and inject on.",
        "Note DFS/regulatory channels that may be unobservable."
      ],
      resources: ["RFSAM-RES-11"],
      example:
        "An ALFA AWUS036ACH (RTL8812AU) in monitor mode covers 2.4 and 5 GHz with reliable injection — the de facto reference adapter. An Electronic Cats Minino (ESP32-C6) covers 2.4 GHz Wi-Fi alongside BLE/Zigbee/Thread and integrates GPS for wardriving, making it a compact survey-and-locate tool. Confirming injection up front avoids the common failure of reporting 'no handshake captured' when the adapter simply could not transmit the deauth.",
      remediation: "Auditor-capability baseline, not a device finding. Document the adapter envelope so band coverage is interpreted correctly."
    },
    {
      id: "RFSAM-WIFI-LL-01", protocol: "WIFI", layer: "LL", criticality: "medium",
      title: "Management-frame exposure and deauthentication",
      applicability: ["802.11"],
      intro: "Unless Management Frame Protection (802.11w) is enforced, 802.11 management frames are unauthenticated. Deauthentication frames can be forged to disconnect clients at will — enabling DoS and forcing handshake captures.",
      description:
        "Beacons, probe requests/responses, association and deauthentication frames are sent in the clear and, without 802.11w (PMF), are unauthenticated. An attacker forges deauth frames to evict clients (DoS) or to force a reconnection whose 4-way handshake can be captured for offline cracking. Probe requests also leak the SSIDs a client has previously joined, enabling tracking and evil-twin targeting. This control captures management frames, tests deauth susceptibility, and inventories the SSID/identity leakage.",
      procedure: [
        "Capture beacons and probe requests; inventory broadcast SSIDs and client probe lists.",
        "Check whether the AP advertises/enforces 802.11w (PMF).",
        "If PMF is absent, test a targeted deauth and confirm client disconnection (authorised scope only).",
        "Record SSID leakage usable for evil-twin / tracking."
      ],
      resources: ["RFSAM-RES-11", "RFSAM-RES-12"],
      attacks: [
        { name: "Deauthentication DoS", ref: "802.11 management-frame design; mitigated by 802.11w", what: "Forged deauth frames disconnect clients arbitrarily. Used both as DoS and to force handshake capture. Defeated only by enforced PMF." },
        { name: "Evil Twin / KARMA", ref: "well-established AP-impersonation class", what: "A rogue AP cloning a known SSID lures clients whose probe lists reveal remembered networks — the WiFi Pineapple's signature capability." }
      ],
      example:
        "A passive capture inventories every broadcast SSID and the probe-request history of nearby clients (the networks each device remembers). With a WiFi Pineapple this directly seeds an evil-twin AP; with an ALFA adapter a single forged deauth (where PMF is absent) evicts a client and forces the 4-way handshake needed for RFSAM-WIFI-CR-01. A Minino with GPS logs the same survey geographically for wardriving.",
      remediation: "Enforce 802.11w (Protected Management Frames). Disable SSID auto-join on clients where feasible and avoid hidden-SSID 'security by obscurity', which worsens probe leakage."
    },
    {
      id: "RFSAM-WIFI-CR-01", protocol: "WIFI", layer: "CR", criticality: "high",
      title: "WPA/WPA2/WPA3 handshake capture and key recovery",
      applicability: ["WPA2-PSK", "WPA3-SAE", "WPS"],
      intro: "WPA2-PSK networks are exposed to offline cracking via 4-way-handshake or clientless PMKID capture; WPS adds an online PIN-recovery path; even WPA3 has downgrade and DoS exposure. This control captures the relevant material and assesses key-recovery feasibility.",
      description:
        "WPA2-PSK security reduces to passphrase strength once a handshake is captured — and since 2018 the PMKID attack lets an auditor capture the needed material from the AP alone, with no connected client and no deauth noise. WPS, still widely enabled, validates its 8-digit PIN in two halves with no lockout on many APs, cutting brute-force to ~11,000 guesses; Pixie Dust recovers the PIN almost instantly on chipsets with weak E-S1/E-S2 nonces. WPA3-SAE resists offline cracking, but transitional/mixed-mode networks downgrade to WPA2 for legacy clients, and Dragonblood-class flaws plus Dragon-Drain DoS apply. This control captures handshake/PMKID/WPS data and assesses each path.",
      procedure: [
        "Attempt clientless PMKID capture from the AP (RFSAM-RES-12).",
        "If a client is present, capture the 4-way handshake (optionally forcing it via deauth where authorised).",
        "Check WPS status; test Pixie Dust and PIN brute-force feasibility.",
        "For WPA3, check for transitional mode and MFP enforcement (downgrade exposure).",
        "Run offline cracking against captured material to assess passphrase strength."
      ],
      resources: ["RFSAM-RES-11", "RFSAM-RES-12"],
      attacks: [
        { name: "KRACK", ref: "CVE-2017-13077 … 13088 (Vanhoef & Piessens, 2017)", what: "Key Reinstallation Attack: replaying handshake message 3 forces nonce reuse, breaking WPA2 packet confidentiality. Affected effectively all WPA implementations until patched." },
        { name: "Kr00k", ref: "CVE-2019-15126 (ESET, 2020)", what: "Broadcom/Cypress chips encrypt buffered frames with an all-zero key after disassociation, letting an attacker decrypt them. Affected billions of devices (Echo, iPhone, RPi 3, Asus/Huawei APs)." },
        { name: "PMKID clientless capture", ref: "hashcat team, 2018", what: "RSN PMKID in the first handshake message lets the PSK hash be captured from the AP alone — no client, no deauth — then cracked offline (hashcat mode 22000)." },
        { name: "WPS Pixie Dust", ref: "Bongard, 2014", what: "Weak E-S1/E-S2 nonce generation on many chipsets lets the WPS PIN be recovered offline near-instantly, yielding the PSK." },
        { name: "Dragonblood", ref: "Vanhoef & Ronen, 2019", what: "Side-channel and downgrade flaws in WPA3-SAE; combined with transitional-mode downgrade, reduces many 'WPA3' networks to WPA2 attack surface." },
        { name: "FragAttacks", ref: "Vanhoef, 2021", what: "Design and implementation flaws in 802.11 frame aggregation/fragmentation allowing injection and exfiltration across WPA/WPA2/WPA3." }
      ],
      example:
        "On a target WPA2-PSK AP, a clientless PMKID capture with an ALFA adapter takes under a minute walking past, with the crack run later at the desk — no deauth, no client needed. Where WPS is left enabled (common on consumer routers), Pixie Dust often recovers the PIN, and thus the PSK, in seconds regardless of passphrase strength. A 'WPA3' network in transitional mode still presents the full WPA2 surface to any legacy client.",
      remediation: "Use a long, high-entropy passphrase (defeats offline cracking). Disable WPS entirely. Deploy WPA3 in non-transitional mode with PMF enforced. Patch APs and clients against KRACK/Kr00k/FragAttacks; prefer enterprise (802.1X) auth for sensitive networks."
    },

    // ============ RFID / NFC vertical slice ============
    {
      id: "RFSAM-RFID-SP-01", protocol: "RFID", layer: "SP", criticality: "info",
      title: "Frequency, technology and reader/tag identification",
      applicability: ["125 kHz LF", "13.56 MHz HF", "ISO 14443A/B", "ISO 15693"],
      intro: "RFID/NFC splits into low-frequency (125 kHz) and high-frequency (13.56 MHz) families with very different security. The first step is identifying the frequency, protocol and chip so the correct attack path applies.",
      description:
        "LF (125 kHz) covers EM4100/HID Prox — typically no cryptography, trivially cloned. HF (13.56 MHz) covers ISO 14443A/B (MIFARE Classic/DESFire, NXP), ISO 15693, and NFC Forum types. Security ranges from none (UID-only access control) to the broken Crypto1 (MIFARE Classic) to sound AES (DESFire EV2/EV3). This control identifies the operating frequency, the protocol/standard, and the specific chip — because the entire downstream attack tree depends on it (a Crypto1 attack is meaningless against DESFire, and vice-versa).",
      procedure: [
        "Determine operating frequency (LF 125 kHz vs HF 13.56 MHz) with a multi-frequency reader.",
        "Identify the protocol/standard (ISO 14443A/B, 15693) and chip (MIFARE Classic / Ultralight / DESFire, HID Prox, EM4100).",
        "For MIFARE Classic, read the PRNG/nonce behaviour to classify weak vs hardened vs static-encrypted-nonce.",
        "Record whether access control relies on UID-only (cloneable) or on cryptographic authentication."
      ],
      resources: ["RFSAM-RES-13"],
      example:
        "A Proxmark3 'hf search' / 'lf search' identifies frequency, standard and chip in one step and reports the MIFARE PRNG strength (weak/hard). An Electronic Cats BomberCat (PN7150, ISO 14443A/B, NFC Forum T4T) reads and emulates HF cards and adds MagSpoof magnetic-stripe and NFC-relay capability; a Chameleon emulates HF cards for reader-side testing. Establishing 'UID-only access control' versus 'Crypto1' versus 'DESFire AES' is the fork that decides the whole assessment.",
      remediation: "Capability/scoping baseline. The finding it enables: any system relying on UID-only identification (LF Prox, MIFARE UID) is cloneable regardless of frequency and should be flagged immediately."
    },
    {
      id: "RFSAM-RFID-CR-01", protocol: "RFID", layer: "CR", criticality: "high",
      title: "MIFARE Classic Crypto1 key recovery",
      applicability: ["MIFARE Classic", "MIFARE Plus (SL1)"],
      intro: "MIFARE Classic's proprietary Crypto1 cipher (48-bit key) is fundamentally broken. Depending on the card's nonce behaviour, keys are recoverable card-only (no reader) or with one known key — making most MIFARE Classic access systems clonable.",
      description:
        "Crypto1 has intrinsic, unpatchable weaknesses: a 48-bit key, an LFSR-based PRNG, a parity-bit keystream leak, and (on many cards) a NACK leak. The attack path depends on the card: the Darkside attack recovers a key card-only by exploiting NACK + nonce-repeat leaks; the Nested attack recovers further keys given one known key and a predictable PRNG; the Hardnested attack handles hardened cards (MIFARE Classic EV1) with truly-random nonces via statistical cryptanalysis. The 2024 Quarkslab research broke even the 'static encrypted nonce' variant (Fudan FM11RF08S) and found a hardware backdoor. Reader-side, mfkey32 recovers keys from a captured reader↔card exchange. This control determines the applicable attack and recovers the sector keys.",
      procedure: [
        "Classify PRNG/nonce behaviour (weak → darkside/nested; hard → hardnested; static-encrypted → FM11RF08S techniques).",
        "Run dictionary/default-key check first (many deployments never change keys).",
        "Apply the attack matching the nonce class to recover sector keys.",
        "Where a reader is available, capture an authentication and recover keys with mfkey32.",
        "Dump all sectors; assess whether access data (UID, sector contents) enables cloning."
      ],
      resources: ["RFSAM-RES-13"],
      attacks: [
        { name: "Darkside attack", ref: "Courtois, 2009", what: "Card-only key recovery exploiting the Crypto1 NACK leak and nonce repetition — needs no prior key and no reader." },
        { name: "Nested attack", ref: "Garcia et al., 2008", what: "Given one known key and a predictable PRNG, recovers remaining sector keys by triggering nested authentications and filtering nonce guesses via the parity leak." },
        { name: "Hardnested attack", ref: "Meijer & Verdult, 2015", what: "Defeats hardened MIFARE Classic EV1 (truly-random nonces) using statistical cryptanalysis on thousands of nonces with SIMD acceleration; needs one known key." },
        { name: "FM11RF08S static-encrypted-nonce + backdoor", ref: "Teuwen / Quarkslab, 2024", what: "Breaks the most-hardened 'static encrypted nonce' Crypto1 clones and documents a hardware backdoor key affecting a range of MIFARE-compatible cards." },
        { name: "mfkey32 reader-key extraction", ref: "Proxmark/Flipper tooling", what: "Recovers sector keys from a captured reader↔card authentication, attacking the reader side rather than the card." }
      ],
      example:
        "A Proxmark3 classifies the card's PRNG, runs a default-key check, then applies darkside (weak PRNG, card-only) or hardnested (EV1, one known key) to recover all sector keys — after which the card is fully dumped and clonable. Against a hardened FM11RF08S, the 2024 Quarkslab techniques (and the discovered backdoor key) still recover keys. Where only the reader is reachable, capturing one authentication and running mfkey32 yields the keys instead.",
      remediation: "Migrate off MIFARE Classic to MIFARE DESFire EV2/EV3 (AES) or other audited cryptographic credentials. Never rely on UID-only checks. Where migration is impossible, add backend anti-passback/anomaly detection — but treat any Crypto1 deployment as effectively cloneable."
    },
    {
      id: "RFSAM-RFID-AT-01", protocol: "RFID", layer: "AT", criticality: "high",
      title: "Cloning, emulation and relay attacks",
      applicability: ["LF Prox", "MIFARE", "NFC payment", "access control"],
      intro: "Once identity or keys are recovered, the credential can be cloned to a blank, emulated by a device, or relayed in real time between a genuine card and a distant reader — defeating proximity as a security assumption.",
      description:
        "Three escalations follow key/identity recovery. Cloning writes the recovered data to a blank card (or 'magic' UID-changeable card). Emulation has a device present the credential directly — a Chameleon or Proxmark emulating an HF card, or BomberCat emulating NFC/MagSpoof magstripe. Relay is the strongest: a host device reads a genuine card while a client device, anywhere with connectivity, presents it to the target reader in real time — defeating physical-proximity assumptions entirely. BomberCat was purpose-built for NFC relay against bank terminals (its RelayNFC host/client, demonstrated at DEF CON 30). This control verifies which of clone/emulate/relay the target is susceptible to.",
      procedure: [
        "Clone recovered LF/HF credentials to a blank or magic card; test against the reader.",
        "Emulate the credential with a Chameleon/Proxmark/BomberCat; confirm reader acceptance.",
        "For relay, set up host (reads card) + client (presents to reader) and test acceptance versus any timing checks.",
        "Record whether the reader enforces timing/anti-relay or distance bounding."
      ],
      resources: ["RFSAM-RES-13", "RFSAM-RES-14"],
      attacks: [
        { name: "UID/credential cloning", ref: "standard LF/HF practice", what: "UID-only and cloned-key credentials are written to blanks or magic cards and used directly — the baseline failure of non-cryptographic access control." },
        { name: "Card emulation", ref: "Chameleon / Proxmark / BomberCat", what: "A device presents the credential without a physical card, enabling rapid testing and real-world impersonation." },
        { name: "NFC relay attack", ref: "BomberCat RelayNFC, DEF CON 30", what: "Host reads a genuine card while a remote client presents it to the target reader in real time, defeating proximity. Demonstrated against bank terminals." },
        { name: "MagSpoof magstripe emulation", ref: "Electronic Cats MagSpoof / BomberCat", what: "Emulates magnetic-stripe data wirelessly to standard magstripe readers, extending the attack to legacy payment/access infrastructure." }
      ],
      example:
        "After Crypto1 recovery (RFSAM-RFID-CR-01), a Proxmark or Chameleon emulates the card to the reader; a magic card clones it physically. For payment/banking, BomberCat's RelayNFC relays a live card from a host to a client at the terminal — the DEF CON 30 demonstration — while MagSpoof covers the magstripe fallback. The control's key question for the defender: does the reader enforce any timing/anti-relay check, or is presence alone trusted?",
      remediation: "Use cryptographically authenticated credentials (DESFire AES) so cloned/emulated data is useless. For payment/high-value access, enforce timing constraints or distance bounding to defeat relay. Never trust UID or magstripe data as proof of presence."
    },

    // ============ Sub-GHz ISM / Remotes vertical slice ============
    {
      id: "RFSAM-SUBG-SP-01", protocol: "SUBG", layer: "SP", criticality: "info",
      title: "Band sweep and signal discovery",
      applicability: ["315 MHz", "433.92 MHz", "868 MHz", "915 MHz ISM"],
      intro: "Sub-GHz ISM is where most remotes, sensors, alarms and key fobs live. The first step is finding the carrier: which ISM band, what modulation, what burst structure — usually with a wideband SDR to discover, then a cheap CC1101-class transceiver to work it.",
      description:
        "Unlicensed ISM activity clusters at 315 MHz (North America remotes), 433.92 MHz (global remotes/sensors), 868 MHz (Europe) and 915 MHz (North America). Devices are typically simple: OOK/ASK or 2-FSK bursts keyed by a microcontroller, often with no carrier sense and no encryption. The discovery workflow Michael Ossmann formalised as 'Rapid Radio Reversing' is the model: use a wideband SDR (HackRF) to find and characterise the signal, then drop to a CC1101-based tool (YARD Stick One + rfcat) to receive and transmit at the right bitrate. This control locates the carrier, identifies the band/modulation, and records the burst timing so later controls can demodulate it.",
      procedure: [
        "Sweep the candidate ISM bands (315/433/868/915 MHz) with a wideband SDR while triggering the target device.",
        "Capture the burst to I/Q; note centre frequency, bandwidth and on-off keying vs frequency-shift.",
        "Estimate the symbol/bit rate from the shortest pulse.",
        "Configure a CC1101-class radio (YARD Stick One/rfcat) with those layer-1 parameters to receive."
      ],
      resources: ["RFSAM-RES-01", "RFSAM-RES-15"],
      example:
        "Ossmann's own SimpliSafe work is the template: HackRF One to monitor the keypad transmissions and characterise the signal, then YARD Stick One with rfcat to receive and replay at the correct layer-1 settings — no vendor hardware, no physical proximity. The same discover-then-work-it flow applies to any garage remote, TPMS sensor, or 433 MHz weather station.",
      remediation: "Discovery/capability baseline. The finding it sets up: any device transmitting unauthenticated OOK/FSK bursts in the clear (most cheap ISM remotes) is replayable or forgeable once characterised."
    },
    {
      id: "RFSAM-SUBG-PHY-01", protocol: "SUBG", layer: "PHY", criticality: "medium",
      title: "Demodulation and protocol reversing of an unknown signal",
      applicability: ["OOK/ASK", "2-FSK", "Manchester"],
      intro: "Turning a captured Sub-GHz burst into bits — then into meaning — is the core reversing skill. Most ISM signals are OOK/ASK or 2-FSK with Manchester or PWM encoding, decodable with SDR tooling plus a CC1101 radio.",
      description:
        "After capture, the signal must be demodulated (OOK: presence/absence of carrier; FSK: two tones) and the line coding recovered (Manchester, PWM, raw). Universal Radio Hacker (URH) provides an integrated workflow for this: visualise the burst, auto-detect modulation and bit rate, and extract the bitstream, then diff captures to find which bits change between button presses. The recovered frame typically splits into a preamble, a device/serial ID, a command field, and (for rolling systems) a counter. This control demodulates the signal and reverses the frame structure — the prerequisite for replay, forgery, or crypto analysis.",
      procedure: [
        "Load the I/Q capture into Universal Radio Hacker (or GNU Radio); identify modulation (OOK/ASK vs FSK) and bit rate.",
        "Recover the line coding (Manchester/PWM/raw) and extract the bitstream.",
        "Capture multiple transmissions and diff them to locate static (ID) vs changing (counter/command) fields.",
        "Document the frame format: preamble, ID, command, counter, checksum."
      ],
      resources: ["RFSAM-RES-15"],
      example:
        "Universal Radio Hacker turns a raw 433 MHz garage-remote capture into a labelled bitstream in minutes: the fixed prefix is the device ID, a few bits flip per press (the command), and on rolling systems a multi-byte field increments — immediately telling you whether you're facing a fixed code (replayable) or a rolling code (needs RollJam-class technique).",
      remediation: "Reversing is auditor-side. The defensive takeaway it produces: a frame whose only 'security' is an unchanging ID broadcast in the clear offers no protection — identification is not authentication."
    },
    {
      id: "RFSAM-SUBG-LL-01", protocol: "SUBG", layer: "LL", criticality: "high",
      title: "Fixed-code replay and brute force",
      applicability: ["fixed-code remotes", "gates", "garages", "alarms"],
      intro: "Fixed-code devices transmit the same code every time. Once captured it can be replayed indefinitely, and because the keyspace is often tiny, it can frequently be brute-forced outright — no capture needed.",
      description:
        "A large installed base of gates, garages, barriers and cheap alarms uses fixed codes set by DIP switches or a one-time-programmed ID. Capturing one transmission and replaying it opens the device forever. Worse, the keyspace is often small (8–12 DIP switches), and Ossmann's OpenSesame work showed the brute-force time can be collapsed dramatically using a De Bruijn sequence — sending overlapping codes so every possible code is emitted in the shortest possible bitstream, opening 'virtually any fixed-code garage in seconds.' This control tests for replayability and brute-force feasibility.",
      procedure: [
        "Capture one transmission and replay it (YARD Stick One/rfcat or HackRF) to confirm the device accepts replays.",
        "Determine the code length / keyspace (DIP switches, ID bits).",
        "Where the keyspace is small, test a De Bruijn-sequence brute force (OpenSesame technique) and measure time-to-open.",
        "Record whether the device has any replay or rate-limiting defence."
      ],
      resources: ["RFSAM-RES-15"],
      attacks: [
        { name: "OpenSesame", ref: "Samy Kamkar, DEF CON 23 (2015)", what: "Brute-forces fixed-code garages/gates in seconds by emitting a De Bruijn sequence that overlaps every possible code, slashing the bits needed versus naive brute force. Built on a $12 Mattel IM-ME toy (CC1110)." },
        { name: "Fixed-code replay", ref: "general ISM practice", what: "Capturing and re-transmitting the single static code opens the device indefinitely — the baseline failure of non-rolling remotes." }
      ],
      example:
        "Kamkar's OpenSesame opened virtually any fixed-code garage in seconds using a De Bruijn sequence on a child's toy — the canonical demonstration that a fixed-code remote's small keyspace is its undoing. In an audit, confirming a single captured code replays, then measuring brute-force time against the keyspace, quantifies exactly how exposed the device is.",
      remediation: "Replace fixed-code remotes with rolling/hopping-code systems (Security+, Intellicode) at minimum. Better, move to authenticated, cryptographically rolling schemes. Add receiver-side rate limiting to slow brute force."
    },
    {
      id: "RFSAM-SUBG-CR-01", protocol: "SUBG", layer: "CR", criticality: "high",
      title: "Rolling-code interception and replay (RollJam / RollBack)",
      applicability: ["rolling-code RKE", "KeeLoq", "HITAG2", "garage/vehicle remotes"],
      intro: "Rolling codes defeat naive replay by using each code once. But jam-and-capture techniques, counter-resync weaknesses, and weak cipher implementations break them — and capturing several codes can recover the cryptographic key on some schemes.",
      description:
        "Rolling-code systems (KeeLoq, HITAG2, vehicle RKE) increment a counter and authenticate each press, so a replayed old code is rejected. Three attack classes break this. RollJam (Kamkar, DEF CON 23) jams the receiver while capturing the fob's code, replays an earlier captured code to satisfy the user, and banks the fresh one for later use. RollBack (2022) is a time-agnostic replay: re-sending previously captured signals in a specific sequence rolls the counter back into an accepting state, so old captures work again — no jamming needed. And implementation-level cryptanalysis (KeeLoq correlation, the HITAG2 correlation attack) can recover the key from a handful of captured codes, fully cloning the fob. This control assesses which apply.",
      procedure: [
        "Reverse the frame (RFSAM-SUBG-PHY-01) and locate the rolling counter and fixed serial.",
        "Test jam-and-capture (RollJam): confirm whether jamming the receiver while capturing yields a usable banked code.",
        "Test sequential replay (RollBack): replay captured codes in sequence and check for counter resync acceptance.",
        "Identify the cipher (KeeLoq/HITAG2) and assess key-recovery feasibility from captured codes.",
        "Record any defence: tight counter windows, time bounding, challenge-response."
      ],
      resources: ["RFSAM-RES-15"],
      attacks: [
        { name: "RollJam", ref: "Samy Kamkar, DEF CON 23 (2015)", what: "Jams the receiver while capturing the fob transmission, replays an older captured code so the user notices nothing, and stores a still-valid fresh code for the attacker — defeats rolling codes on most cars, garages and alarms with ~$32 of hardware." },
        { name: "RollBack", ref: "Csikor et al., USENIX/2022", what: "Time-agnostic replay: re-transmitting previously-captured signals in a specific order rolls the receiver counter back into accepting old codes, so captures remain usable without jamming." },
        { name: "KeeLoq / HITAG2 key recovery", ref: "correlation attacks, multiple papers", what: "Capturing only a handful of rolling codes lets the cryptographic key be recovered on widely-deployed KeeLoq and HITAG2 schemes, allowing full key-fob cloning (affecting many VW Group and other vehicles)." }
      ],
      example:
        "RollJam is the definitive demonstration that 'rolling code' is not a synonym for 'secure': by jamming and banking codes, an attacker keeps a perpetually-fresh unlock no matter how many times the owner presses the fob. RollBack later showed many systems accept rolled-back counters via sequential replay alone. For an auditor, the key questions are whether the receiver jams-detectable, how tight its counter resync window is, and which cipher the fob uses.",
      remediation: "Use authenticated challenge-response (bidirectional) rather than one-way rolling counters where possible. Enforce tight, non-resettable counter windows and detect jamming. Migrate off KeeLoq/HITAG2 to modern authenticated schemes; add time-bounding to defeat RollBack-style sequential replay."
    },
    {
      id: "RFSAM-SUBG-AT-01", protocol: "SUBG", layer: "AT", criticality: "high",
      title: "Jamming and denial of service",
      applicability: ["alarms", "sensors", "remotes", "ISM links"],
      intro: "Because most ISM devices have no carrier-sense and no jamming detection, a continuous or targeted transmission on their frequency silences them — suppressing alarm sensors, blocking remotes, or enabling the jam half of jam-and-replay.",
      description:
        "Sub-GHz ISM links are typically simplex and unauthenticated, with no listen-before-talk. A transmitter on the target frequency drowns the legitimate signal: a door/window alarm sensor's 'open' event never reaches the panel, a remote's command never lands, a TPMS or telemetry link goes dark. Jamming is also the enabling primitive for RollJam-class attacks (jam the receiver, capture the fob). This control tests whether the target detects or tolerates jamming and what the security impact of suppression is. Note: transmitting to jam is legally restricted in most jurisdictions and must be confined to a shielded/authorised environment.",
      procedure: [
        "Identify the exact operating frequency and bandwidth (RFSAM-SUBG-SP-01).",
        "In an authorised/shielded setup, transmit narrowband noise on the frequency and observe device behaviour.",
        "Determine whether the receiver detects jamming or supervises link health (e.g. alarm 'tamper'/'supervision' signalling).",
        "Assess security impact: can a sensor event be suppressed without alerting the panel?"
      ],
      resources: ["RFSAM-RES-15"],
      attacks: [
        { name: "Sensor/alarm jamming", ref: "well-documented ISM weakness", what: "Suppressing an unauthenticated sensor's transmission prevents alarm events from reaching the panel; many systems lack jam/supervision detection, so the suppression is silent." },
        { name: "Jam-and-replay enabler", ref: "RollJam primitive", what: "Targeted jamming of the receiver is the prerequisite half of jam-and-capture attacks against rolling-code remotes (RFSAM-SUBG-CR-01)." }
      ],
      example:
        "An alarm contact sensor that fires a one-way 433 MHz 'opened' burst with no acknowledgement and no supervision can be silenced by jamming its frequency during entry — the panel simply never hears the event. Whether the system raises a 'supervision lost' condition is the dividing line between a robust and a defeatable installation.",
      remediation: "Use supervised links that alarm on loss of periodic check-in and on detected jamming. Prefer frequency-agile or spread-spectrum links over single-frequency OOK. Treat any safety-critical sensor on an unauthenticated simplex ISM link as suppressible."
    }
  ],

  // Standard tooling referenced across controls. EC hardware marked.
  tools: [
    { name: "Minino", vendor: "Electronic Cats", ec: true, protocols: ["Wi-Fi", "BLE", "Zigbee", "Thread", "802.15.4"], note: "ESP32-C6 multiprotocol/multiband board with GPS, microSD, OLED — sniffing, wardriving, IoT attack. A pocket survey knife." },
    { name: "CatSniffer", vendor: "Electronic Cats", ec: true, protocols: ["BLE", "Sub-GHz", "Zigbee", "LoRa"], note: "CC1352 + RP2040 multiprotocol sniffer; runs the Sniffle fork that bluecat drives." },
    { name: "BomberCat", vendor: "Electronic Cats", ec: true, protocols: ["NFC", "RFID", "MagStripe"], note: "RP2040 + PN7150 + ESP32. NFC read/write/emulate (ISO 14443A/B), MagSpoof magstripe, and RelayNFC relay attacks against bank terminals (DEF CON 30)." },
    { name: "WiFi Pineapple", vendor: "Hak5", ec: false, protocols: ["Wi-Fi"], note: "Standard rogue-AP / evil-twin platform automating capture and client-luring workflows." },
    { name: "ALFA AWUS036ACH", vendor: "ALFA Network", ec: false, protocols: ["Wi-Fi"], note: "RTL8812AU 2.4/5 GHz adapter with reliable monitor mode and injection — the reference Wi-Fi assessment radio." },
    { name: "Proxmark3", vendor: "RFID Research Group", ec: false, protocols: ["RFID", "NFC"], note: "The reference RFID/NFC tool: LF+HF, full MIFARE Crypto1 attack suite (darkside/nested/hardnested), read/write/emulate." },
    { name: "Chameleon", vendor: "community", ec: false, protocols: ["RFID", "NFC"], note: "HF card emulator for reader-side testing and credential impersonation." },
    { name: "YARD Stick One", vendor: "Great Scott Gadgets", ec: false, protocols: ["Sub-GHz"], note: "CC1111 sub-GHz transceiver (300–928 MHz) running rfcat — receive, replay and transmit OOK/ASK/FSK from a Python shell. The reference cheap Sub-GHz work tool, paired with HackRF for discovery." },
    { name: "HackRF One", vendor: "Great Scott Gadgets", ec: false, protocols: ["Wide-band SDR"], note: "1 MHz–6 GHz half-duplex SDR — the discovery radio for 'Rapid Radio Reversing': find and characterise an unknown signal before working it with a narrowband tool." },
    { name: "Universal Radio Hacker", vendor: "open source", ec: false, protocols: ["any SDR"], note: "Integrated reversing workbench: auto-detect modulation/bitrate, extract bitstreams, diff captures, and replay — the fastest path from raw I/Q to a labelled frame format." }
  ],

  resources: [
    { id: "RFSAM-RES-01", title: "Capture raw I/Q with an SDR",
      body: "Select an SDR whose instantaneous bandwidth covers the target, tune to the centre frequency, set sample rate ≥ signal bandwidth, and record I/Q to disk. Log overflow/dropped-sample counters — a capture with overflows is silently incomplete. Reference radios: RTL-SDR V4 (narrow), HackRF One (~20 MHz), USRP B210 (~56 MHz, GPSDO), bladeRF 2.0 (~61 MHz)." },
    { id: "RFSAM-RES-02", title: "Follow a frequency-hopping connection",
      body: "When full-band capture is impossible, recover the hop sequence/parameters from connection setup and retune per hop, or channelise the whole band (RFSAM-RES-03). For BLE, the hop interval and channel map are negotiated at connection time and visible to a sniffer that catches the connection request." },
    { id: "RFSAM-RES-03", title: "GPU polyphase channelisation",
      body: "Split a wide I/Q stream into many narrow channels using a polyphase filterbank + FFT offloaded to the GPU (OpenCL / VkFFT). This makes real-time multi-channel demodulation tractable where CPU channelisation throttles and drops samples. Reference: the ice9-bluetooth-sniffer approach for the BLE band." },
    { id: "RFSAM-RES-04", title: "Sniff and audit a BLE device",
      body: "Drive a Sniffle-class sniffer (e.g. CatSniffer / CC1352) to passively scan advertising channels, then connect and enumerate GATT to audit for unencrypted readable/writable characteristics. Audit-on-discovery sweeps every connectable advertiser as it is found, classifying address type and recording writable handles without authentication." },
    { id: "RFSAM-RES-05", title: "Enumerate and exercise a GATT table",
      body: "After connecting, discover all services and characteristics, attempt reads on readable handles, and identify writable handles reachable without encryption. A REPL workflow (read/write/subscribe/terminate) lets the auditor replay learned commands and observe device response." },
    { id: "RFSAM-RES-06", title: "Hijack a live BLE connection",
      body: "Follow an established connection's hop sequence, stabilise over several connection events, then transmit as master to evict the original central. The clean pattern is hijack → LL_TERMINATE_IND → reconnect. Implementation note: set the decoder's current Access Address to the connection AA only after reaching CENTRAL (flush first); advertisements during INITIATING reset it to the advertising AA and break data-PDU decoding." },
    { id: "RFSAM-RES-07", title: "Capture and decode LoRa / LoRaWAN",
      body: "Capture the ISM sub-band to I/Q, de-chirp with a soft-decision LoRa demodulator (gr-lora_sdr class), then parse the LoRaWAN frame: MHDR, MType, DevAddr, and — for joins — AppEUI/DevEUI/DevNonce in clear; application payload remains AES-128 encrypted. Classify by MType to profile the network passively." },
    { id: "RFSAM-RES-08", title: "Identify and capture an LTE cell",
      body: "Scan bands with a capable modem to list operators/EARFCNs, run cell search to recover PCI from PSS/SSS, then capture the target EARFCN on a GPSDO-disciplined SDR. Decode MIB (PBCH) for bandwidth and frame number before higher-layer work." },
    { id: "RFSAM-RES-09", title: "Coherent capture with a disciplined reference",
      body: "Lock the SDR to a GPSDO; confirm clock rate and register loopback. Validate the host can sustain the sample rate (host I/O can cause MIB-decode failures even when the SDR is fine). Coherence is mandatory for OFDM grid recovery." },
    { id: "RFSAM-RES-10", title: "Passive LTE control-channel decode",
      body: "From a recovered resource grid, blind-decode PDCCH: enumerate the search space, run Viterbi on each candidate, and validate by CRC masked with the candidate RNTI. Open-source tooling (LTESniffer / FALCON class) performs this passively; pair with SIB/paging decode for configuration and identity exposure." },
    { id: "RFSAM-RES-11", title: "Wi-Fi monitor-mode capture and survey",
      body: "Put a monitor-mode-capable adapter (e.g. ALFA AWUS036ACH / RTL8812AU, or ESP32-C6 Minino) into monitor mode, channel-hop across 2.4/5/6 GHz, and capture all 802.11 frames. Confirm injection support with aireplay-ng --test before relying on active controls. Add GPS for wardriving/geolocation of APs." },
    { id: "RFSAM-RES-12", title: "Wi-Fi handshake / PMKID capture and cracking",
      body: "Capture the WPA 4-way handshake (optionally forcing it with a deauth where authorised and PMF is absent) or extract the RSN PMKID clientlessly from the AP. Crack offline with hashcat (mode 22000). Check WPS and attempt Pixie Dust / PIN brute-force. A WiFi Pineapple automates evil-twin and capture workflows." },
    { id: "RFSAM-RES-13", title: "Read, identify and attack RFID/NFC cards",
      body: "Use a Proxmark3 (hf/lf search) to identify frequency, standard, chip and MIFARE PRNG strength, then run default-key checks and the matching Crypto1 attack (darkside/nested/hardnested). Chameleon and BomberCat (PN7150) read and emulate HF cards; mfkey32 recovers keys from a captured reader exchange." },
    { id: "RFSAM-RES-14", title: "Clone, emulate and relay credentials",
      body: "Clone recovered data to blank/magic cards, or emulate with Chameleon/Proxmark/BomberCat. For NFC relay, use BomberCat RelayNFC (host reads the genuine card, client presents it to the target reader over the network). MagSpoof/BomberCat emulate magnetic-stripe data to legacy readers. Test for reader-side timing/anti-relay defences." },
    { id: "RFSAM-RES-15", title: "Discover, demodulate and replay a Sub-GHz signal",
      body: "Use a wideband SDR (HackRF) to discover and characterise the burst (frequency, OOK/FSK, bitrate) — Ossmann's 'Rapid Radio Reversing' workflow. Demodulate and reverse the frame in Universal Radio Hacker or GNU Radio. Then drive a CC1101-class transceiver (YARD Stick One + rfcat) at the recovered layer-1 settings to receive, replay or forge. For brute force, generate a De Bruijn sequence (OpenSesame). For rolling codes, assess jam-and-capture (RollJam) and sequential replay (RollBack)." }
  ]
};
