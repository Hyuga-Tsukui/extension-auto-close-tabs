import { getDelay, saveDelay } from "./delay";

// Load and display current settings when the page loads
document.addEventListener("DOMContentLoaded", async () => {
	const currentDelay = await getDelay();
	const delayInput = document.getElementById("delay") as HTMLInputElement;
	delayInput.value = currentDelay.toString();
	
	// Update the element that displays the current setting
	const currentSettingElement = document.getElementById("current-setting");
	if (currentSettingElement) {
		currentSettingElement.textContent = `Current setting: ${currentDelay} seconds`;
	}
});

document.getElementById("save")?.addEventListener("click", () => {
	const delayInput = document.getElementById("delay") as HTMLInputElement;
	const delay = Number.parseInt(delayInput.value, 10);

	if (Number.isNaN(delay) || delay <= 0) {
		showMessage("Must be a positive number");
		return;
	}

	saveDelayAndNotify(delay);
});

/**
 * Save delay setting to storage and notify user
 */
async function saveDelayAndNotify(seconds: number) {
	try {
		await saveDelay(seconds);
		showMessage(`Close delay set to ${seconds} seconds`);
	} catch (error) {
		console.error("Error saving delay:", error);
		showMessage("Failed to save settings");
	}
}

/**
 * Display a message to the user
 */
function showMessage(message: string) {
	alert(message);
}
