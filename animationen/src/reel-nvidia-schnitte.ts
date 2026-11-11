// Automatisch erzeugt: gekürzte Sprechpausen im Voiceover v3 (Sekunden, Original-Zeitachse)
export const SCHNITTE: [number, number][] = [[2.38, 2.89], [5.42, 5.61], [12.44, 12.67], [15.5, 15.61], [17.48, 17.59], [18.98, 19.17], [21.36, 21.67], [33.28, 33.57], [34.58, 34.71], [43.62, 43.95], [49.38, 49.57], [51.76, 52.13], [63.52, 63.83], [66.92, 67.09], [68.96, 69.49], [72.02, 72.21], [73.72, 73.89], [81.48, 81.65], [85.62, 85.73], [92.48, 92.77], [94.18, 94.31], [96.34, 96.59]];
export const neueZeit = (t: number) => t - SCHNITTE.reduce((v, [a, b]) => v + (t >= b ? b - a : t > a ? t - a : 0), 0);
export const AUDIO_V3_SEK = 93.03;
