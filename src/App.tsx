import { useState } from 'react';
import KoiPond from './KoiPond';
import Controls from './Controls';
import './App.css';

export interface Settings {
  fishCount:      number;
  rainIntensity:  number;
  lilyPadDensity: number;
  reedDensity:    number;
  sparkleCount:   number;
  pixelFilter:    boolean;
  underwaterText: string;
}

/* Point this at your fork once the repo exists. */
const REPO_URL = 'https://github.com/Riu-F/koi-pond';

const DEFAULTS: Settings = {
  fishCount:      7,
  rainIntensity:  1,
  lilyPadDensity: 1,
  reedDensity:    1,
  sparkleCount:   48,
  pixelFilter:    false,
  underwaterText: '',
};

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(true);

  const randomise = () =>
    setSettings((s) => ({
      ...s,
      fishCount:      Math.round(rand(3, 30)),
      rainIntensity:  round1(rand(0, 2.5)),
      lilyPadDensity: round1(rand(0, 2.5)),
      reedDensity:    round1(rand(0, 2.5)),
      sparkleCount:   Math.round(rand(0, 120)),
      pixelFilter:    Math.random() > 0.6,
    }));

  return (
    <main className="stage">
      <KoiPond
        fishCount={settings.fishCount}
        rainIntensity={settings.rainIntensity}
        lilyPadDensity={settings.lilyPadDensity}
        reedDensity={settings.reedDensity}
        sparkleCount={settings.sparkleCount}
        pixelFilter={settings.pixelFilter}
        underwaterText={settings.underwaterText || undefined}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />

      <Controls
        settings={settings}
        setSettings={setSettings}
        onReset={() => setSettings(DEFAULTS)}
        onRandomise={randomise}
        open={panelOpen}
        onToggle={() => setPanelOpen((o) => !o)}
        repoUrl={REPO_URL}
      />

      <a className="credit" href="https://riufukazawa.com" target="_blank" rel="noreferrer">
        riufukazawa.com
      </a>
    </main>
  );
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
