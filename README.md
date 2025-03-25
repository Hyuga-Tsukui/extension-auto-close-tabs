# Auto Close Tabs

A Chrome extension that automatically closes inactive tabs after a configurable period of time to help manage browser tab overflow and improve system performance.

## Features

- Automatically closes inactive tabs after a configurable time period
- Default timeout is 12 hours
- Protected tabs (pinned tabs and tabs in groups) are never automatically closed
- Active tabs are not closed, but rescheduled for later review
- Simple popup interface to adjust the auto-close timeout

## Installation

### From Source
1. Clone this repository:
   ```
   git clone https://github.com/yourusername/extension-auto-close-tabs.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npx tsc
   ```

4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

### From Chrome Web Store
(Coming soon)

## Usage

1. Click on the extension icon in your browser toolbar to open the settings popup
2. Enter the desired timeout period in seconds (default is 43200 seconds, which is 12 hours)
3. Click "Save" to apply the new timeout setting

## How It Works

- When a new tab is created, it's scheduled to be closed after the configured timeout
- If a tab is active when its timeout expires, it gets rescheduled instead of closed
- Pinned tabs and tabs in groups are protected from automatic closure
- The extension uses Chrome's alarm API to schedule tab closures efficiently

## Development

This project uses:
- TypeScript
- Chrome Extension Manifest V3
- Biome for code formatting and linting

To contribute to the development:
1. Make your changes
2. Format code: `npx @biomejs/biome format --write .`
3. Lint code: `npx @biomejs/biome lint .`
4. Compile: `npx tsc`
5. Test the extension in Chrome