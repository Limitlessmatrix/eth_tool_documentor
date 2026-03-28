import { LabelExtraction, TesterExtraction } from '../types';

export async function extractLabelFromImage(_uri: string): Promise<LabelExtraction> {
  // TODO: replace with real OCR pipeline (ML Kit / Apple Vision / cloud OCR)
  return {
    rawText: '#35B',
    normalizedLabel: '35B',
    confidence: 0.93
  };
}

export async function extractTesterFromImage(_uri: string): Promise<TesterExtraction> {
  // TODO: replace with real tester-screen extraction model
  return {
    status: 'PASS',
    statusConfidence: 0.98,
    lengthFt: 9,
    wiremap: '1-1,2-2,3-3,4-4,5-5,6-6,7-7,8-8',
    idVisible: '1'
  };
}
