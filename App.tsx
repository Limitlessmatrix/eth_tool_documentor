import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { DropScreen } from './src/screens/DropScreen';
import { loadDrops, saveDrops } from './src/lib/storage';
import { DropRecord } from './src/types';

function makeNewDrop(): DropRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAtUtc: now,
    techName: '',
    location: {
      siteName: 'Default Site',
      building: '',
      floor: '',
      room: ''
    },
    photos: {},
    label: null,
    tester: null,
    finalized: false,
    summaryText: ''
  };
}

export default function App() {
  const [drops, setDrops] = useState<DropRecord[]>([]);
  const [activeDropId, setActiveDropId] = useState<string | null>(null);

  useEffect(() => {
    loadDrops().then(setDrops).catch(() => setDrops([]));
  }, []);

  useEffect(() => {
    saveDrops(drops).catch(() => undefined);
  }, [drops]);

  const activeDrop = useMemo(
    () => drops.find((d) => d.id === activeDropId) ?? null,
    [drops, activeDropId]
  );

  function handleNewDrop() {
    const next = makeNewDrop();
    setDrops((prev) => [next, ...prev]);
    setActiveDropId(next.id);
  }

  function handleSaveDrop(updated: DropRecord) {
    setDrops((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {activeDrop ? (
        <DropScreen drop={activeDrop} onSave={handleSaveDrop} onBack={() => setActiveDropId(null)} />
      ) : (
        <HomeScreen
          drops={drops}
          onNewDrop={handleNewDrop}
          onOpenDrop={(id) => setActiveDropId(id)}
        />
      )}
    </SafeAreaView>
  );
}
