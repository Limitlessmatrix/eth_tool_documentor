import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { DropRecord } from '../types';

interface Props {
  drops: DropRecord[];
  onNewDrop: () => void;
  onOpenDrop: (dropId: string) => void;
}

export function HomeScreen({ drops, onNewDrop, onOpenDrop }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cable Doc Tech</Text>
      <Pressable style={styles.button} onPress={onNewDrop}>
        <Text style={styles.buttonText}>+ New Drop</Text>
      </Pressable>
      <FlatList
        data={drops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onOpenDrop(item.id)}>
            <Text style={styles.cardTitle}>{item.label?.normalizedLabel ?? 'Unlabeled Drop'}</Text>
            <Text>{item.location.building} / Room {item.location.room}</Text>
            <Text>Status: {item.tester?.status ?? 'Pending'}</Text>
            <Text numberOfLines={2}>{item.summaryText || 'Not finalized yet.'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No drops yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  button: { backgroundColor: '#0f766e', padding: 14, borderRadius: 10, marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  list: { paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, gap: 2 },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 30, color: '#475569' }
});
