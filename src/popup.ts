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
function saveDelayAndNotify(seconds: number): void {
	chrome.storage.local.set({ timeout_seconds: seconds }, () => {
		showMessage(`Close delay set to ${seconds} seconds`);
	});
}

/**
 * Display a message to the user
 */
function showMessage(message: string): void {
	alert(message);
}
