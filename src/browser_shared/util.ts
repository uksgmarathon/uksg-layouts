/**
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 * @returns Padded number.
 */
export function padTimeNumber(num: number) {
  return num.toString().padStart(2, '0');
}

/**
 * Converts milliseconds into a time string (HH:MM:SS).
 * @param ms Milliseconds you wish to convert.
 * @returns Converted time string.
 */
export function msToTimeStr(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${padTimeNumber(hours)
  }:${padTimeNumber(minutes)
  }:${padTimeNumber(seconds)}`;
}
