import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { buildSummary } from '../lib/report';
import { extractLabelFromImage, extractTesterFromImage } from '../lib/extraction';
import { DropRecord, LocationMeta, PhotoType } from '../types';

interface Props {
  drop: DropRecord;
  onSave: (drop: DropRecord) => void;
  onBack: () => void;
}

export function DropScreen({ drop, onSave, onBack }: Props) {
  const [local, setLocal] = useState(drop);

  const missing = useMemo(
    () => (['context', 'label', 'tester'] as PhotoType[]).filter((p) => !local.photos[p]),
    [local.photos]
  );

  async function pickPhoto(type: PhotoType) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission required');
      return;
    }

    const imageResult = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (imageResult.canceled || imageResult.assets.length === 0) return;

    const locPerm = await Location.requestForegroundPermissionsAsync();
    const position =
      locPerm.status === 'granted' ? await Location.getCurrentPositionAsync({}) : null;

    const uri = imageResult.assets[0].uri;

    const updated: DropRecord = {
      ...local,
      photos: {
        ...local.photos,
        [type]: {
          type,
          uri,
          capturedAtUtc: new Date().toISOString(),
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude
        }
      }
    };

    if (type === 'label') {
      updated.label = await extractLabelFromImage(uri);
    }
    if (type === 'tester') {
      updated.tester = await extractTesterFromImage(uri);
    }

    setLocal(updated);
    onSave(updated);
  }

  function finalizeDrop() {
    if (missing.length > 0) {
      Alert.alert('Missing photos', `Please capture: ${missing.join(', ')}`);
      return;
    }
    if (!local.tester || local.tester.status === 'UNKNOWN') {
      Alert.alert('Missing tester result', 'Please confirm tester photo and status.');
      return;
    }

    const finalized = { ...local, finalized: true };
    finalized.summaryText = buildSummary(finalized);
    setLocal(finalized);
    onSave(finalized);
    Alert.alert('Drop finalized', finalized.summaryText);
  }

  function updateLocation<K extends keyof LocationMeta>(key: K, value: LocationMeta[K]) {
    const updated = { ...local, location: { ...local.location, [key]: value } };
    setLocal(updated);
    onSave(updated);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </Pressable>

      <Text style={styles.header}>Drop Workflow</Text>
      <TextInput
        style={styles.input}
        placeholder="Tech name"
        value={local.techName}
        onChangeText={(v) => onSave({ ...local, techName: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Building"
        value={local.location.building}
        onChangeText={(v) => updateLocation('building', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Floor"
        value={local.location.floor}
        onChangeText={(v) => updateLocation('floor', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Room"
        value={local.location.room}
        onChangeText={(v) => updateLocation('room', v)}
      />

      {(['context', 'label', 'tester'] as PhotoType[]).map((type) => (
        <View key={type} style={styles.captureCard}>
          <Text style={styles.captureTitle}>{type.toUpperCase()} PHOTO</Text>
          <Pressable style={styles.captureBtn} onPress={() => pickPhoto(type)}>
            <Text style={styles.captureBtnText}>Capture {type}</Text>
          </Pressable>
          {local.photos[type] ? (
            <Image source={{ uri: local.photos[type]!.uri }} style={styles.preview} />
          ) : (
            <Text style={styles.missing}>Not captured yet</Text>
          )}
        </View>
      ))}

      <View style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Extracted Values</Text>
        <Text>Label: {local.label?.normalizedLabel ?? '—'}</Text>
        <Text>Label confidence: {local.label?.confidence ?? '—'}</Text>
        <Text>Status: {local.tester?.status ?? '—'}</Text>
        <Text>Length ft: {local.tester?.lengthFt ?? '—'}</Text>
        <Text>Wiremap: {local.tester?.wiremap ?? '—'}</Text>
      </View>

      <Pressable style={styles.finalizeBtn} onPress={finalizeDrop}>
        <Text style={styles.finalizeBtnText}>Finalize Drop</Text>
      </Pressable>

      {!!local.summaryText && (
        <View style={styles.summaryCard}>
          <Text style={styles.resultsTitle}>Summary</Text>
          <Text>{local.summaryText}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 6 },
  backBtnText: { color: '#0f766e', fontWeight: '600' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  captureCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, gap: 8 },
  captureTitle: { fontWeight: '700' },
  captureBtn: { backgroundColor: '#1d4ed8', padding: 10, borderRadius: 8 },
  captureBtnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  missing: { color: '#64748b' },
  preview: { width: '100%', height: 180, borderRadius: 8 },
  resultsCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, gap: 2 },
  resultsTitle: { fontWeight: '700', marginBottom: 4 },
  finalizeBtn: { backgroundColor: '#0f766e', padding: 14, borderRadius: 10 },
  finalizeBtnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  summaryCard: { backgroundColor: '#ecfeff', borderRadius: 10, padding: 12 }
});
