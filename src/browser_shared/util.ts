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

/**
 * Simple formatter for displaying currency amounts.
 * @param amount Amount as a integer/float.
 * @param noCents Never display cents, even if under 100; supply "round" to round and not floor.
 * @returns Formatted amount.
 */
export function formatCurrencyAmount(amount: number, noCents: 'round' | boolean = false) {
  if (amount >= 1000 || noCents) {
    const roundFunc = noCents === 'round' ? Math.round : Math.floor;
    return `${nodecg.bundleConfig.tracker.currencySymbol}${
      roundFunc(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `${nodecg.bundleConfig.tracker.currencySymbol}${amount.toFixed(2)}`;
}

/**
 * Basic wait Promise command.
 * @param length Length in milliseconds.
 * @return Promise that resolves after "length".
 */
export function wait(length: number) {
  return new Promise((res) => { window.setTimeout(res, length); });
}
