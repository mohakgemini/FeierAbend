export type Track = { youtubeId: string; title: string; artist: string; year: number };
export type Vibe = { id: string; title: string; cardSubtitle: string; subtitle: string; background: string; playlistId?: string; tracks: Track[] };

export const sommerPlaylistId = "PLfP25--coVjg";
export const defaultPlaylistId = "PL_PtigFDidUiP8J76EmrlVd6zsTAImE4V";

// Music comes exclusively from the playlist above. This neutral entry is shown
// only for a moment while YouTube loads the current track metadata.
const playlistLoadingTrack: Track = {
  youtubeId: "",
  title: "Feierabend.fm Playlist",
  artist: "Wird geladen …",
  year: new Date().getFullYear(),
};

const image = (name: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${name}`;

export const vibes: Vibe[] = [
  { id: "sommer06", title: "Sommer ’06", cardSubtitle: "Sonne, Freunde, Fußball", subtitle: "Golden Hour. Fenster offen.", background: image("sommer06.jpg"), playlistId: sommerPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "freitag2003", title: "Freitag 2003", cardSubtitle: "Späti, Kumpels, Beats", subtitle: "Späti-Licht. Die Nacht ist jung.", background: image("freitag2003.jpg"), playlistId: defaultPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "nachtfahrt2001", title: "Nachtfahrt 2001", cardSubtitle: "Autobahn, Lichter, Trance", subtitle: "120 BPM. Kein Ziel nötig.", background: image("nachtfahrt2001.jpg"), playlistId: defaultPlaylistId, tracks: [playlistLoadingTrack] },
  { id: "sonntag1998", title: "Sonntag 1998", cardSubtitle: "Zuhause, ruhig, Radio an", subtitle: "Kaffee warm. Welt ganz leise.", background: image("sonntag1998.jpg"), playlistId: defaultPlaylistId, tracks: [playlistLoadingTrack] },
];
