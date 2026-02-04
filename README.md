# 📈 ASX Dividend Tracker Front-End
A high-performance, real-time dashboard for tracking upcoming ASX dividends. This front-end is designed to handle the complexities of the Australian Securities Exchange (ASX) market hours, providing global users with a localized Sydney-centric view of dividend data.

## 🔗 Data Source
This project acts as the visualization layer for the [ASX Dividend Scraper](https://github.com/Hminh0306/asx-dividend-scraper/).

- Backend: Python-based scraper running on GitHub Actions.

- Operational Storage: AWS S3 (JSON).

- Trigger: Repository Dispatch API.

## 🌟 Key Features
- Fixed Sydney Timezone: All "Last Updated" timestamps and filtering logic are forced to Australia/Sydney (AEST/AEDT) time. No matter where you are in the world, the data remains market-relevant.

- Intelligent Data Polling: Trigger-based polling with a built-in 2-minute propagation delay to allow GitHub Actions and S3 synchronization to complete before checking for updates.

- Safety Backoff: Includes a 15-minute hard timeout that automatically stops background processes and fetches the latest available state if the scraper stalls.

- UTC Gatekeeping: Prevents unnecessary server load by enforcing a 10-minute cooldown between refresh requests based on UTC comparison.

- Upcoming-Only Filter: Automatically hides expired dividends by comparing the current Sydney date against the stock's Ex-Date.

## 🏗️ Architecture
The application follows a strict data-flow pattern to ensure consistency:

- Ingestion: Fetches raw JSON data containing UTC timestamps.

- Transformation: Uses a custom library (processDataToSydneyTimezone) to convert timestamps and format financial values using Australian locales (Commas for thousands, dots for decimals).

- State Management: DividendContainer manages the lifecycle of the data, handling the "Updating" UI overlay and the polling intervals.

- Formatting: The table uses en-AU localization for all currency and volume figures.

## 🚀 Getting Started
### Prerequisites
- Node.js 20.8 or higher

- Next.js 14/15 (App Router)

- Environment Variables:

```Bash
GITHUB_PAT=your_personal_access_token
REPO_OWNER=your_github_username
REPO_NAME=your_repo_name

AWS_BUCKET_NAME=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-southeast-2

NEXT_PUBLIC_APP_URL=your_app_url
```

### Installation
1. Clone the repository:

```Bash
git clone https://github.com/your-username/asx-dividend-tracker.git
```

2. Install dependencies:

```Bash
npm install
```

3. Run the development server:

```Bash
npm run dev
```

## 📁 Project Structure
- /app/api/ - Serverless routes for triggering the scraper, checking status, and fetching S3 data.

- /components/ - Atomic UI components (RefreshButton, DividendTable, etc.).

- /lib/ - Logic for timezone processing and S3 data fetching.

- /types/ - TypeScript interfaces for DividendData and component props.

## 🛠️ Tech Stack
- Framework: Next.js (React)

- Styling: Tailwind CSS

- Data Source: AWS S3

- Automation: GitHub Actions (triggered via Repository Dispatches)

- Time Handling: Native Intl.DateTimeFormat (Sydney IANA zone)