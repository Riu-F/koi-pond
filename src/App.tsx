import { useState } from 'react';
import KoiPond from './KoiPond';
import Controls from './Controls';
import './App.css';

export interface Settings {
  fishCount:      number;
  fishSpeed:      number;
  fishSize:       number;
  rainIntensity:  number;
  lilyPadDensity: number;
  reedDensity:    number;
  sparkleCount:   number;
  pixelSize:      number;
  underwaterText: string;
}

/* Point this at your fork once the repo exists. */
const REPO_URL = 'https://github.com/Riu-F/koi-pond';

const DEFAULTS: Settings = {
  fishCount:      7,
  fishSpeed:      1,
  fishSize:       1,
  rainIntensity:  1,
  lilyPadDensity: 1,
  reedDensity:    1,
  sparkleCount:   48,
  pixelSize:      1,
  underwaterText: '',
};

/* ── Embed mode ───────────────────────────────────────────────────────
   Add `?embed=1` to run chromeless (no control panel, no corner credit) so
   the pond can be dropped into an <iframe> — e.g. a portfolio bento tile.
   Every setting is overridable from the query string, plus `height` to lower
   the internal render resolution for a small tile, and `scale` to inflate
   every entity's size without moving the camera (handy at small sizes,
   where the default density reads too busy). The pond stays fully
   pointer-interactive (click to ripple, hold to feed, swipe to scatter) —
   unless `nav` is set, in which case a tap navigates there instead of
   rippling, and gentle hover movement ripples in place of a fast swipe.

     ?embed=1&fish=3&rain=0&reeds=0&lilypads=0.5&sparkles=12&height=180
     &scale=1.6&nav=https%3A%2F%2Friufukazawa.com%2Fkoi-pond
*/
interface EmbedConfig {
  embed:       boolean;
  settings:    Settings;
  baseHeight:  number | undefined;
  navigateUrl: string | undefined;
  scale:       number | undefined;
}

function num(params: URLSearchParams, key: string, fallback: number): number {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function readEmbedConfig(): EmbedConfig {
  const params = new URLSearchParams(
    typeof window === 'undefined' ? '' : window.location.search,
  );
  const embed = params.get('embed') === '1' || params.get('embed') === 'true';

  const settings: Settings = {
    fishCount:      num(params, 'fish',     DEFAULTS.fishCount),
    fishSpeed:      num(params, 'speed',    DEFAULTS.fishSpeed),
    fishSize:       num(params, 'size',     DEFAULTS.fishSize),
    rainIntensity:  num(params, 'rain',     DEFAULTS.rainIntensity),
    lilyPadDensity: num(params, 'lilypads', DEFAULTS.lilyPadDensity),
    reedDensity:    num(params, 'reeds',    DEFAULTS.reedDensity),
    sparkleCount:   num(params, 'sparkles', DEFAULTS.sparkleCount),
    pixelSize:      num(params, 'pixel',    DEFAULTS.pixelSize),
    underwaterText: params.get('text') ?? DEFAULTS.underwaterText,
  };

  const heightRaw = params.get('height');
  const baseHeight =
    heightRaw !== null && Number.isFinite(Number(heightRaw))
      ? Number(heightRaw)
      : undefined;

  const navigateUrl = params.get('nav') ?? undefined;

  const scaleRaw = params.get('scale');
  const scale =
    scaleRaw !== null && Number.isFinite(Number(scaleRaw))
      ? Number(scaleRaw)
      : undefined;

  return { embed, settings, baseHeight, navigateUrl, scale };
}

const EMBED = readEmbedConfig();

const PRESETS: Record<string, Settings> = {
  Calm:  { fishCount: 4,  fishSpeed: 0.5, fishSize: 1.3, rainIntensity: 0,   lilyPadDensity: 0.6, reedDensity: 0.5, sparkleCount: 30,  pixelSize: 1, underwaterText: '' },
  Rain:  { fishCount: 8,  fishSpeed: 1,   fishSize: 1,   rainIntensity: 2.6, lilyPadDensity: 1,   reedDensity: 1,   sparkleCount: 60,  pixelSize: 1, underwaterText: '' },
  Retro: { fishCount: 12, fishSpeed: 1.1, fishSize: 1,   rainIntensity: 1,   lilyPadDensity: 1.2, reedDensity: 1,   sparkleCount: 40,  pixelSize: 6, underwaterText: '' },
  Chaos: { fishCount: 70, fishSpeed: 2.4, fishSize: 0.8, rainIntensity: 3,   lilyPadDensity: 2,   reedDensity: 2,   sparkleCount: 100, pixelSize: 1, underwaterText: '' },
};

export default function App() {
  const [settings, setSettings] = useState<Settings>(
    EMBED.embed ? EMBED.settings : DEFAULTS,
  );
  const [panelOpen, setPanelOpen] = useState(true);

  const randomise = () =>
    setSettings((s) => ({
      ...s,
      fishCount:      Math.round(rand(4, 45)),
      fishSpeed:      round1(rand(0.4, 2.2)),
      fishSize:       round1(rand(0.7, 1.8)),
      rainIntensity:  round1(rand(0, 2.5)),
      lilyPadDensity: round1(rand(0, 2.5)),
      reedDensity:    round1(rand(0, 2.5)),
      sparkleCount:   Math.round(rand(0, 120)),
      pixelSize:      Math.random() > 0.5 ? 1 : Math.round(rand(2, 8)),
    }));

  return (
    <main className="stage">
      <KoiPond
        fishCount={settings.fishCount}
        fishSpeed={settings.fishSpeed}
        fishSize={settings.fishSize}
        rainIntensity={settings.rainIntensity}
        lilyPadDensity={settings.lilyPadDensity}
        reedDensity={settings.reedDensity}
        sparkleCount={settings.sparkleCount}
        pixelSize={settings.pixelSize}
        underwaterText={settings.underwaterText || undefined}
        baseHeight={EMBED.baseHeight}
        navigateUrl={EMBED.navigateUrl}
        scale={EMBED.scale}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />

      {/* Chrome (control panel + credit) is hidden in embed mode. */}
      {!EMBED.embed && (
        <>
          <Controls
            settings={settings}
            setSettings={setSettings}
            onReset={() => setSettings(DEFAULTS)}
            onRandomise={randomise}
            open={panelOpen}
            onToggle={() => setPanelOpen((o) => !o)}
            repoUrl={REPO_URL}
            presets={PRESETS}
          />

          <a className="credit" href="https://riufukazawa.com" target="_blank" rel="noreferrer">
            riufukazawa.com
          </a>
        </>
      )}
    </main>
  );
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
