export const LAYER_IDS = ['IG', 'SP', 'PHY', 'LL', 'CR', 'AT', 'AP'];

export const PROTOCOL_IDS = [
  'BLE', 'WIFI', 'LORA', 'LTE', 'RFID', 'SUBG',
  'ZIGBEE', 'ZWAVE', 'THREAD', 'GNSS', 'ADSB', 'NR5G', 'GSM', 'UWB',
];

export const CRITICALITY_IDS = ['info', 'low', 'medium', 'high', 'critical'];
export const REVIEW_STATUSES = ['stub', 'draft', 'verified'];
export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'];

const ID_RE = new RegExp(
  `^RFSAM-(${PROTOCOL_IDS.join('|')})-(${LAYER_IDS.join('|')})-(\\d{2})$`,
);

export function parseControlId(id) {
  const m = ID_RE.exec(id);
  if (!m) return null;
  return { protocol: m[1], layer: m[2], nn: m[3] };
}
