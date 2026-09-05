export type Track = { youtubeId: string; title: string; artist: string; year: number };
export type Vibe = { id: string; title: string; cardSubtitle: string; subtitle: string; background: string; mobileBackground: string; playlistId?: string; seasonal?: "oktoberfest"; tracks: Track[] };

export const sommerPlaylistId = "PL19SqEq2HQT3KLFZ-YfvA3m3t-mR5XlC7";
export const defaultPlaylistId = "PL_PtigFDidUiP8J76EmrlVd6zsTAImE4V";
export const oktoberfestPlaylistId = "RDEMXO_6Sdt6FaiHhnxNUF77Vw";
export const nachtfahrtPlaylistId = "PLHg022HMFzFDMNp9xBGy3sARnqxaPl3PG";

// Music comes exclusively from the playlists above. This neutral entry is shown
// only for a moment while YouTube loads the current track metadata.
const playlistLoadingTrack: Track = {
  youtubeId: "",
  title: "Feierabend.fm Playlist",
  artist: "Wird geladen …",
  year: new Date().getFullYear(),
};

const image = (name: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${name}`;

export const vibes: Vibe[] = [
  { id: "sommer06", title: "Sommer ’06", cardSubtitle: "Sonne, Freunde, Fußball", subtitle: "Golden Hour. Fenster offen.", background: image("sommer06.jpg"), mobileBackground: image("sommer06-mobile.jpg"), playlistId: sommerPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "freitag2003", title: "Freitag 2003", cardSubtitle: "Späti, Kumpels, Beats", subtitle: "Späti-Licht. Die Nacht ist jung.", background: image("freitag2003.jpg"), mobileBackground: image("freitag2003-mobile.jpg"), playlistId: defaultPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "oktoberfest2004", title: "Oktoberfest 2004", cardSubtitle: "Lichter, Freunde, eine letzte Runde", subtitle: "München. Irgendwann im September.", background: image("oktoberfest2004.jpg"), mobileBackground: image("oktoberfest2004-mobile.jpg"), playlistId: oktoberfestPlaylistId, seasonal: "oktoberfest", tracks: [playlistLoadingTrack] },
  { id: "nachtfahrt2001", title: "Nachtfahrt 2001", cardSubtitle: "Autobahn, Lichter, Trance", subtitle: "120 BPM. Kein Ziel nötig.", background: image("nachtfahrt2001.jpg"), mobileBackground: image("nachtfahrt2001-mobile.jpg"), playlistId: nachtfahrtPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "sonntag1998", title: "Sonntag 1998", cardSubtitle: "Zuhause, ruhig, Radio an", subtitle: "Kaffee warm. Welt ganz leise.", background: image("sonntag1998.jpg"), mobileBackground: image("sonntag1998-mobile.jpg"), playlistId: defaultPlaylistId, tracks: [playlistLoadingTrack] },
];
