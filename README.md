# Feierabend.fm

A nostalgic German internet-radio experience built with Next.js, TypeScript, Tailwind CSS, and the official YouTube IFrame Player API.

## Live website

**[Open Feierabend.fm](https://feierabend.live/)**

## Features

- Four cinematic visual moods
- Mood-specific YouTube playlists
- Random initial song selection
- Hidden YouTube video with custom playback controls
- Play, pause, previous, next, shuffle, seeking, and automatic track advance
- Local time and simulated live-listener count
- Responsive desktop and mobile layout

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Music configuration

Playlist IDs and mood settings are stored in [`data/vibes.ts`](data/vibes.ts).

Playback remains entirely within the official YouTube embedded player. The application does not download or proxy audio.

## Deployment

Every push to `master` deploys the static export through GitHub Actions to GitHub Pages.
