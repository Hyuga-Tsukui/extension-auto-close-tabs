// Default timeout setting (12 hours)
export const DEFAULT_TIMEOUT_SECONDS = 3600 * 12;

/**
 * Save delay setting to storage
 */
export function saveDelay(seconds: number): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ timeout_seconds: seconds }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

/**
 * Get tab closing timeout setting from storage
 */
export async function getDelay(): Promise<number> {
  try {
    const result = await chrome.storage.local.get("timeout_seconds");
    return result.timeout_seconds || DEFAULT_TIMEOUT_SECONDS;
  } catch (error) {
    console.error("Error retrieving timeout setting:", error);
    return DEFAULT_TIMEOUT_SECONDS;
  }
}