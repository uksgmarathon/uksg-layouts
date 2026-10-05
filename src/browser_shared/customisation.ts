import type { RunData } from 'speedcontrol-util/types/schemas';
import type { Schemas } from '../types';

type PlayerCustomisation = NonNullable<Schemas.RunCustomisation[string]['players'][string]>;
const playerKeys = ['badgeColour', 'badgeLabel', 'feedColour'] as const;
const colourKeys: string[] = ['badgeColour', 'feedColour'];

/**
 * Colours offered as quick choices on the dashboard.
 * The first few are the UKSG brand colours, the rest are general purpose ones for matching characters.
 */
export const presetColours = [
  '#44a0e3', // UKSG
  '#d00c27', // UKSG Red
  '#4bd133', // UKSG Green
  '#0091ff', // UKSG Blue
  '#e52521',
  '#f28c28',
  '#f5c400',
  '#43b047',
  '#14a3a3',
  '#1f4fbf',
  '#7b3fb5',
  '#e85d9e',
  '#8b5a2b',
  '#1b1b1b',
  '#f2f2f2',
];

/**
 * Checks if a string is a valid CSS colour.
 */
export function isValidColour(colour?: string | null): colour is string {
  return !!colour && CSS.supports('color', colour);
}

/**
 * Gets the customisation for a specific player in a run.
 * In order of priority: dashboard override, the player's own custom data,
 * then the run's custom data (a comma separated list in player order, or a single value for everyone).
 */
export function getPlayerCustomisation(
  run: RunData | null | undefined,
  overrides: Schemas.RunCustomisation | undefined,
  teamIndex: number,
  playerIndex = 0,
) {
  const result: PlayerCustomisation = {};
  const player = run?.teams[teamIndex]?.players[playerIndex];
  if (!run || !player) return result;
  const flatIndex = run.teams.slice(0, teamIndex).reduce((prev, t) => prev + t.players.length, 0) + playerIndex;
  const override = overrides?.[run.id]?.players[player.id] ?? {};
  for (const key of playerKeys) {
    const list = run.customData[key]?.split(',').map((str) => str.trim());
    const fromRun = list?.length === 1 ? list[0] : list?.[flatIndex];
    const value = [override[key], player.customData[key], fromRun]
      .find((v) => v && (!colourKeys.includes(key) || isValidColour(v)));
    if (value) result[key] = value;
  }
  return result;
}

/**
 * Gets the accent colour for a run, from the dashboard override or the run's custom data.
 */
export function getAccentColour(run: RunData | null | undefined, overrides: Schemas.RunCustomisation | undefined) {
  if (!run) return undefined;
  return [overrides?.[run.id]?.accentColour, run.customData.accentColour].find(isValidColour);
}

/**
 * Converts a hex colour into an "rgba()" string with the supplied alpha.
 * Non-hex colours are returned as is.
 */
export function hexToRgba(hex: string, alpha: number) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;
  const full = match[1].length === 3 ? match[1].split('').map((c) => c + c).join('') : match[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns a dark or light text colour, whichever is more readable on top of the supplied (hex) colour.
 */
export function getTextColour(hex: string) {
  const rgba = hexToRgba(hex, 1);
  const [r, g, b] = (rgba.match(/\d+/g) ?? ['0', '0', '0']).map(Number);
  const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;
  return luminance > 0.6 ? '#011f39' : 'white';
}

/**
 * Gets the IDs of the content warnings that apply to a run: those ticked on the dashboard or, if nothing has been
 * set for the run there, any listed in the run's "contentWarnings" custom data (comma separated warning names).
 */
export function getRunWarningIds(run: RunData | null | undefined, warnings: Schemas.ContentWarnings | undefined) {
  if (!run || !warnings) return [];
  const ticked = warnings.runs[run.id];
  if (ticked) return ticked;
  const names = run.customData.contentWarnings?.split(',').map((str) => str.trim().toLowerCase()) ?? [];
  return warnings.available.filter((w) => names.includes(w.text.toLowerCase())).map((w) => w.id);
}

/**
 * Gets the names of the content warnings that apply to a run, in the order they are listed on the dashboard.
 */
export function getRunWarnings(run: RunData | null | undefined, warnings: Schemas.ContentWarnings | undefined) {
  const ids = getRunWarningIds(run, warnings);
  return (warnings?.available ?? []).filter((w) => ids.includes(w.id)).map((w) => w.text);
}
