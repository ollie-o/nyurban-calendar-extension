# NY Urban Calendar Extension

A Chrome extension that adds a calendar export button to NY Urban volleyball team schedule pages.

## Features

- Automatically detects NY Urban team schedule pages
- Parses game information (opponent, date, time, location)
- Exports games to ICS calendar format
- Works with any calendar app (Google Calendar, Apple Calendar, Outlook, etc.)

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the `dist` folder as an unpacked extension in Chrome

## Development

```bash
npm install       # Install dependencies
npm test          # Run tests
npm run lint      # Check code quality
npm run build     # Build for production
```

## Usage

1. Navigate to your team's schedule page on nyurban.com
2. Click the "Export to Calendar" button
3. Select the games you want to export
4. Import the downloaded `.ics` file into your calendar app
