// Default timeout setting (12 hours)
const DEFAULT_TIMEOUT_SECONDS = 3600 * 12;

// Alarm prefix for identifying tab close alarms
const ALARM_PREFIX = "close_tab_";

// Listen for new tab creations
chrome.tabs.onCreated.addListener(async (tab) => {
	if (!tab.id) return;

	try {
		// Schedule tab for closing
		const timeoutSeconds = await getTimeoutSetting();
		scheduleTabClose(tab.id, timeoutSeconds);
		console.log(
			`Tab ${tab.id} scheduled to close in ${timeoutSeconds} seconds`,
		);
	} catch (error) {
		console.error("Error scheduling tab close:", error);
	}
});

// Process alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
	// Only process tab close alarms
	if (!alarm.name.startsWith(ALARM_PREFIX)) return;

	const tabId = Number.parseInt(alarm.name.replace(ALARM_PREFIX, ""), 10);

	try {
		// Get current tab state
		const tab = await chrome.tabs.get(tabId);

		// Skip tabs that are protected
		if (tab.pinned || tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
			console.log(
				`Tab ${tabId} is protected (pinned or in group), not closing`,
			);
			return;
		}

		// If tab is active, reschedule
		const timeoutSeconds = await getTimeoutSetting();
		if (tab.active) {
			scheduleTabClose(tabId, timeoutSeconds);
			console.log(
				`Tab ${tabId} is active, rescheduling closing in ${timeoutSeconds} seconds`,
			);
			return;
		}

		// Close the tab
		await chrome.tabs.remove(tabId);
		console.log(`Tab ${tabId} closed`);
	} catch (error) {
		// Tab might already be closed
		console.log(`Failed to close tab ${tabId}, it may no longer exist:`, error);
	}
});

/**
 * Schedule a tab to be closed after the specified timeout
 */
function scheduleTabClose(tabId: number, timeoutSeconds: number): void {
	const alarmName = `${ALARM_PREFIX}${tabId}`;
	chrome.alarms.create(alarmName, { delayInMinutes: timeoutSeconds / 60 });
}

/**
 * Get tab closing timeout setting from storage
 */
async function getTimeoutSetting(): Promise<number> {
	try {
		const result = await chrome.storage.local.get("timeout_seconds");
		return result.timeout_seconds || DEFAULT_TIMEOUT_SECONDS;
	} catch (error) {
		console.error("Error retrieving timeout setting:", error);
		return DEFAULT_TIMEOUT_SECONDS;
	}
}
