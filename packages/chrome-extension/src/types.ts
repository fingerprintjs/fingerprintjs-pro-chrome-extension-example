export interface Message {
  type: 'get-visitor-id'
}

export enum FingerprintStrategy {
  NewWindow = 'NewWindow',
  Iframe = 'Iframe',
}
