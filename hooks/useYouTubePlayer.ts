"use client";
import { useCallback, useEffect, useRef, useState } from "react";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void } }

export function useYouTubePlayer(onEnded: () => void) {
  const player = useRef<any>(null); const endedRef = useRef(onEnded); const playlistMode = useRef(false); const expectedVideoId = useRef(""); const metadataCache = useRef(new Map<string,{title?:string;author?:string}>()); const metadataRequests = useRef(new Set<string>()); const [ready, setReady] = useState(false); const [playlistReady, setPlaylistReady] = useState(false); const [playing, setPlaying] = useState(false); const [currentTime, setCurrentTime] = useState(0); const [duration, setDuration] = useState(0); const [videoData, setVideoData] = useState<{title?:string;author?:string;video_id?:string}>({});
  useEffect(() => { endedRef.current = onEnded }, [onEnded]);
  // YouTube replaces its mount node with an iframe. Keep that node inside a
  // React-owned wrapper so route unmounts never try to remove a replaced node.
  const mounted = useRef(false);
  const generation = useRef(0);
  const chooseTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerReady = useRef(false);
  const pending = useRef<((target:any)=>void) | null>(null);
  const clearPending = useCallback(() => {
    generation.current++;
    if (chooseTimer.current) clearInterval(chooseTimer.current);
    if (apiTimer.current) clearInterval(apiTimer.current);
    chooseTimer.current = null;
    apiTimer.current = null;
  }, []);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearPending();
      pending.current = null;
      playerReady.current = false;
      player.current?.destroy?.();
      player.current = null;
    };
  }, [clearPending]);
  const mountPlayer = useCallback((options:any) => {
    const host = document.getElementById("youtube-player");
    if (!host || !mounted.current) return;
    const node = document.createElement("div");
    host.replaceChildren(node);
    const originalReady = options.events.onReady;
    player.current = new window.YT.Player(node, {...options, events:{...options.events,
      onReady:(event:any)=>{
        if (!mounted.current || event.target !== player.current) return;
        playerReady.current = true;
        if (pending.current) { const action = pending.current; pending.current = null; action(event.target); setReady(true) }
        else originalReady(event);
      }
    }});
  }, []);
  const whenApiReady = useCallback((create:()=>void) => {
    if (window.YT?.Player) { create(); return }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
    // Poll locally instead of overwriting YouTube's global callback with an
    // instance that might already have unmounted during navigation.
    apiTimer.current = setInterval(()=>{
      if (window.YT?.Player && mounted.current) {
        if (apiTimer.current) clearInterval(apiTimer.current);
        apiTimer.current = null;
        create();
      }
    },100);
  }, []);
  const init = useCallback((videoId: string) => {
    clearPending();
    playlistMode.current = false;
    expectedVideoId.current = "";
    setPlaylistReady(true);
    const create = () => { if (player.current) { if(playerReady.current) player.current.loadVideoById(videoId); else pending.current=target=>target.loadVideoById(videoId); return; } mountPlayer({ height: "1", width: "1", videoId, playerVars: { autoplay: 1, controls: 0, playsinline: 1 }, events: { onReady: (e:any) => { setReady(true); e.target.playVideo() }, onStateChange: (e:any) => { setPlaying(e.data === window.YT.PlayerState.PLAYING); if (e.data === window.YT.PlayerState.ENDED) endedRef.current() } } }) };
    whenApiReady(create);
  }, [clearPending,mountPlayer,whenApiReady]);
  const initPlaylist = useCallback((playlistId:string) => {
    clearPending();
    const request = generation.current;
    playlistMode.current = true;
    expectedVideoId.current = "";
    setPlaylistReady(false);
    setVideoData({});
    const cueRandom = (target:any) => {
      target.cuePlaylist({list:playlistId,listType:"playlist",index:0});
      let attempts = 0;
      const choose = setInterval(() => {
        if (!mounted.current || request !== generation.current) { clearInterval(choose); return }
        const items:string[] = target.getPlaylist?.() || [];
        if (items.length) {
          clearInterval(choose);
          const index = Math.floor(Math.random() * items.length);
          expectedVideoId.current = items[index];
          setVideoData({});
          target.cuePlaylist({list:playlistId,listType:"playlist",index});
          target.setShuffle(true);
        } else if (++attempts > 20) { clearInterval(choose); expectedVideoId.current = ""; setPlaylistReady(true) }
      }, 150);
      chooseTimer.current = choose;
    };
    const create = () => { if (!mounted.current || request !== generation.current) return; if (player.current) { if (playerReady.current) cueRandom(player.current); else pending.current=cueRandom; return; } mountPlayer({ height:"1", width:"1", playerVars:{autoplay:0,controls:0,playsinline:1,listType:"playlist",list:playlistId}, events:{ onReady:(e:any)=>{setReady(true);cueRandom(e.target)}, onStateChange:(e:any)=>{setPlaying(e.data===window.YT.PlayerState.PLAYING); if(e.data===window.YT.PlayerState.ENDED&&!playlistMode.current) endedRef.current()} } }) };
    whenApiReady(create);
  },[clearPending,mountPlayer,whenApiReady]);
  useEffect(() => { const timer = setInterval(() => { if (player.current?.getCurrentTime) { setCurrentTime(player.current.getCurrentTime() || 0); setDuration(player.current.getDuration() || 0); const data = player.current.getVideoData?.() || {}; if (!playlistMode.current || !expectedVideoId.current || data.video_id === expectedVideoId.current) { const cached = data.video_id ? metadataCache.current.get(data.video_id) : undefined; setVideoData(cached ? {...data,...cached} : data); if (data.video_id && (!data.author || data.author === "YouTube") && !cached && !metadataRequests.current.has(data.video_id)) { const videoId = data.video_id; metadataRequests.current.add(videoId); fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`).then(response=>response.ok?response.json():Promise.reject()).then(meta=>{ const resolved={title:meta.title||data.title,author:meta.author_name}; metadataCache.current.set(videoId,resolved); setVideoData(current=>current.video_id===videoId?{...current,...resolved}:current) }).catch(()=>{}).finally(()=>metadataRequests.current.delete(videoId)) } if (playlistMode.current && data.video_id) { expectedVideoId.current = ""; setPlaylistReady(true) } } } }, 500); return () => clearInterval(timer) }, []);
  return { init, initPlaylist, ready, playlistReady, playing, currentTime, duration, videoData, play: () => player.current?.playVideo(), pause: () => player.current?.pauseVideo(), seek: (seconds:number) => player.current?.seekTo(seconds, true), nextVideo:()=>player.current?.nextVideo(), previousVideo:()=>player.current?.previousVideo(), shufflePlaylist:()=>{player.current?.setShuffle(true);player.current?.nextVideo()} };
}
