export const layers = [
  {
    "id": "IG",
    "name": "Info Gathering",
    "color": "#C9D4E0",
    "note": "Identify the components and cross-reference known CVEs before any RF work."
  },
  {
    "id": "SP",
    "name": "Spectrum",
    "color": "#2FB8E0",
    "note": "What is transmitting, where, and whether you can see it at all."
  },
  {
    "id": "PHY",
    "name": "Signal / PHY",
    "color": "#3FD17C",
    "note": "From waveform to bits: modulation, demodulation, channelisation."
  },
  {
    "id": "LL",
    "name": "Link / Protocol",
    "color": "#9B8CFF",
    "note": "Frame structure, addressing, identifiers, discovery data."
  },
  {
    "id": "CR",
    "name": "Crypto",
    "color": "#FFC24B",
    "note": "Pairing, key exchange, confidentiality and integrity of the link."
  },
  {
    "id": "AT",
    "name": "Attack",
    "color": "#FF7A1A",
    "note": "Active interaction: injection, replay, hijack, rogue infrastructure."
  },
  {
    "id": "AP",
    "name": "Application",
    "color": "#FF5A5F",
    "note": "What the device trusts above the link: auth, signing, updates."
  }
];
