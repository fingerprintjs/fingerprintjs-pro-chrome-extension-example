export interface Message {
  type: 'get-fingerprint';
}

export enum FingerprintStrategy {
  NewWindow = 'NewWindow',
  Iframe = 'Iframe',
}
