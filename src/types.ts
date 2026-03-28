export type PhotoType = 'context' | 'label' | 'tester';

export interface PhotoMeta {
  type: PhotoType;
  uri: string;
  capturedAtUtc: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationMeta {
  siteName: string;
  building: string;
  floor: string;
  room: string;
  latitude?: number;
  longitude?: number;
}

export interface LabelExtraction {
  rawText: string;
  normalizedLabel: string;
  confidence: number;
}

export interface TesterExtraction {
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  statusConfidence: number;
  lengthFt: number | null;
  wiremap: string | null;
  idVisible: string | null;
}

export interface DropRecord {
  id: string;
  createdAtUtc: string;
  techName: string;
  location: LocationMeta;
  photos: Partial<Record<PhotoType, PhotoMeta>>;
  label: LabelExtraction | null;
  tester: TesterExtraction | null;
  finalized: boolean;
  summaryText: string;
}
