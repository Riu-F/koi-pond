import type { Dispatch, SetStateAction } from 'react';
import type { Settings } from './App';

interface ControlsProps {
  settings:    Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  onReset:     () => void;
  onRandomise: () => void;
  open:        boolean;
  onToggle:    () => void;
  repoUrl:     string;
}

export default function Controls({
  settings,
  setSettings,
  onReset,
  onRandomise,
  open,
  onToggle,
  repoUrl,
}: ControlsProps) {
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <aside className="panel">
      <button className="panel__toggle" onClick={onToggle} aria-expanded={open}>
        <span className="panel__title">Koi Pond</span>
        <span className="panel__chevron">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="panel__body">
          <p className="panel__hint">Click to ripple &middot; hold to feed &middot; swipe to scatter</p>

          <Slider
            label="Fish"
            value={settings.fishCount}
            min={0}
            max={40}
            step={1}
            onChange={(v) => update('fishCount', v)}
          />
          <Slider
            label="Rain"
            value={settings.rainIntensity}
            min={0}
            max={3}
            step={0.1}
            format={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => update('rainIntensity', v)}
          />
          <Slider
            label="Lily pads"
            value={settings.lilyPadDensity}
            min={0}
            max={3}
            step={0.1}
            format={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => update('lilyPadDensity', v)}
          />
          <Slider
            label="Reeds"
            value={settings.reedDensity}
            min={0}
            max={3}
            step={0.1}
            format={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => update('reedDensity', v)}
          />
          <Slider
            label="Sparkles"
            value={settings.sparkleCount}
            min={0}
            max={150}
            step={1}
            onChange={(v) => update('sparkleCount', v)}
          />

          <Slider
            label="Pixelate"
            value={settings.pixelSize}
            min={1}
            max={10}
            step={1}
            format={(v) => (v <= 1 ? 'off' : `${v}px`)}
            onChange={(v) => update('pixelSize', v)}
          />

          <label className="control">
            <span className="control__label">Pond-floor text</span>
            <input
              type="text"
              className="text-input"
              maxLength={12}
              placeholder="e.g. 404"
              value={settings.underwaterText}
              onChange={(e) => update('underwaterText', e.target.value)}
            />
          </label>

          <div className="panel__buttons">
            <button className="btn" onClick={onRandomise}>Randomise</button>
            <button className="btn btn--ghost" onClick={onReset}>Reset</button>
          </div>

          <a className="panel__repo" href={repoUrl} target="_blank" rel="noreferrer">
            {'↗'} Fork it on GitHub
          </a>
        </div>
      )}
    </aside>
  );
}

interface SliderProps {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step:     number;
  format?:  (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  return (
    <label className="control">
      <span className="control__label">
        {label}
        <span className="control__value">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
