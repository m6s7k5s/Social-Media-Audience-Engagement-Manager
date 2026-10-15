# Pulse — Social Media Audience Engagement Analyzer

A beginner-friendly, responsive mini project built with HTML, CSS and JavaScript. It demonstrates how likes, comments and shares can be summarized into useful engagement insights.

## Features
- Dashboard summary cards for total interactions, average engagement rate, likes and comments
- Interactive bar chart and doughnut chart (Chart.js)
- Add new post metrics through a form
- Search posts and sort by engagement rate, likes, comments or shares
- Automatically identifies the post with the highest engagement rate
- Saves added posts in browser local storage
- Reset sample data button
- Responsive layout for desktop, tablet and mobile

## Engagement-rate formula
`Engagement Rate (%) = (Likes + Comments + Shares) / Followers × 100`

This is a simplified follower-based formula for learning purposes. Real platforms and analytics services may use different definitions.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. An internet connection is needed to load Google Fonts and Chart.js from their CDNs. The core dashboard still works without charts if Chart.js cannot load.

No server, database, API key, or package installation is required.

## Publish with GitHub Pages
1. Create a GitHub repository named `social-media-audience-engagement-analyzer`.
2. Upload `index.html`, `style.css`, `script.js`, and this README.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site. The URL will appear in the Pages section.

## Project structure
```text
social-media-audience-engagement-analyzer/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
```

## Limitations
- The starter metrics are fictional sample data, not live social-media data.
- The app does not connect to Instagram, TikTok, YouTube, or other platform APIs.
- Data is stored locally in the current browser and is not synchronized across devices.
- Chart.js and Google Fonts are loaded from external CDNs.

## Future scope
- Import CSV files
- Connect authorized social platform APIs
- Add date-range filters and downloadable reports
- Compare campaigns and track engagement over time

## Academic note
Created as a small educational project to demonstrate dashboard design, JavaScript calculations, data visualization and browser local storage.
