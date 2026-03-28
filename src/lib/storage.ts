import AsyncStorage from '@react-native-async-storage/async-storage';
import { DropRecord } from '../types';

const STORAGE_KEY = 'cable_doc_drops_v1';

export async function loadDrops(): Promise<DropRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as DropRecord[];
  } catch {
    return [];
  }
}

export async function saveDrops(drops: DropRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
}
