# Cable Doc Tech App (iOS + Android)

Cross-platform mobile app for field technicians to document cable drops with 3 photos:
1. Context/location photo
2. Label photo
3. Tester screen photo

The app groups these photos into a single `DropRecord`, extracts label/test results (stubbed in v1), stores metadata, and generates report-ready summaries.

## MVP Features

- Works on iPhone + Android via Expo/React Native
- Guided drop workflow with required 3-photo capture
- GPS + timestamp metadata capture
- Composite-key style grouping at record level (label + time + location)
- Report summary generation
- Local persistence using AsyncStorage

## Run

```bash
npm install
npm run start
```

Then use Expo Go or simulator/emulator.

## Notes

- OCR/CV is currently stubbed in `src/lib/extraction.ts` for fast validation of end-to-end workflow.
- Replace extraction stubs with ML Kit / Vision / cloud OCR in production.
- Tester ID is captured for reference only and not used as a unique key.
