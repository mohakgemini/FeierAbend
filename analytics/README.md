# Feierabend.fm analytics

This directory runs a private Umami analytics instance and PostgreSQL database on the Mac mini.

The dashboard binds locally to `127.0.0.1:3002`. The `tunnel` service publishes it through the named Cloudflare Tunnel at `analytics.feierabend.live`; no inbound router port is opened.

```bash
cd analytics
docker compose up -d
```

Open `http://localhost:3002`, sign in, and immediately replace the initial password. The local `.env` contains installation secrets and is ignored by Git.

The Feierabend.fm Umami website ID is configured in the GitHub Pages build as `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Keep the Cloudflare tunnel credentials in `~/.cloudflared` private and back up the PostgreSQL Docker volume separately.
