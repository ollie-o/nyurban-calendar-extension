# Privacy Policy

**Effective Date:** 2026-01-30

This privacy policy applies to the **NY Urban Calendar** Chrome extension. This extension is a client-side utility designed to respect user privacy by operating entirely offline.

## 1. Data Collection and Usage

The NY Urban Calendar extension follows a strict "no-data" collection policy:

- **No Personal Data:** We do not collect, store, or transmit any personally identifiable information (PII) or league account details.
- **Local Generation:** All game data extraction and `.ics` file generation happen locally in your browser.
- **No Cloud Storage:** We do not host, store, or see the calendar files you generate.
- **No Tracking:** We do not use cookies, analytics, or tracking pixels.

## 2. Permissions & Functionality

To facilitate the creation of calendar files, the extension uses:

- **Host Permission (`https://www.nyurban.com/team-details/*`)**: This permission is used exclusively to read game schedules from NY Urban team detail pages so they can be converted into a calendar format.
- **Content Scripts**: These run only on the specific team details pages (`https://www.nyurban.com/team-details/*`) to identify game times and locations.

## 3. Third-Party Integration

The extension generates standard `.ics` files. Once you download this file, your data handling is subject to the privacy policy of the calendar provider (e.g., Google Calendar, Apple Calendar, Outlook) where you choose to upload it. This extension has no connection to those accounts.

## 4. Limited Use Disclosure

The use of information received from Google APIs (via the Chrome Web Store) will adhere to the [Chrome Web Store User Data Policy](https://developer.chrome.com), including the **Limited Use** requirements.

## 5. Contact

If you have questions about this policy, please open an issue in this [GitHub repository](https://github.com/ollie-o/nyurban-calendar-extension).
