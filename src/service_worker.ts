import { getDelay } from "./delay";

// Alarm prefix for identifying tab close alarms
const ALARM_PREFIX = "close_tab_";

// Listen for new tab creations
chrome.tabs.onCreated.addListener(async (tab) => {
	if (!tab.id) return;

	try {
		// Schedule tab for closing
		const timeoutSeconds = await getDelay();
		await scheduleTabClose(tab.id, timeoutSeconds);
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
		const timeoutSeconds = await getDelay();
		if (tab.active) {
			try {
				await scheduleTabClose(tabId, timeoutSeconds);
				console.log(
					`Tab ${tabId} is active, rescheduling closing in ${timeoutSeconds} seconds`,
				);
				return;
			}catch (error) {
				console.error("Error rescheduling tab close:", error);
			}
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
async function scheduleTabClose(tabId: number, timeoutSeconds: number) {
	const alarmName = `${ALARM_PREFIX}${tabId}`;
	await chrome.alarms.create(alarmName, { delayInMinutes: timeoutSeconds / 60 });
}
