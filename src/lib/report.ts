import { DropRecord } from '../types';

export function buildSummary(drop: DropRecord): string {
  const label = drop.label?.normalizedLabel ?? 'Unknown Label';
  const location = `${drop.location.building} Floor ${drop.location.floor} Room ${drop.location.room}`;
  const status = drop.tester?.status ?? 'UNKNOWN';
  const length = drop.tester?.lengthFt ? ` Length ${drop.tester.lengthFt} ft.` : '';

  return `Cable drop ${label} at ${location} tested ${status} on ${drop.createdAtUtc}.${length} Supporting context, label, and tester photos attached.`;
}
