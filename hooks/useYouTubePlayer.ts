"use client";
import { useCallback, useEffect, useRef, useState } from "react";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void } }

export function useYouTubePlayer(onEnded: () => void) {
  const player = useRef<any>(null); const endedRef = useRef(onEnded); const playlistMode = useRef(false); const expectedVideoId = useRef(""); const [ready, setReady] = useState(false); const [playlistReady, setPlaylistReady] = useState(false); const [playing, setPlaying] = useState(false); const [currentTime, setCurrentTime] = useState(0); const [duration, setDuration] = useState(0); const [videoData, setVideoData] = useState<{title?:string;author?:string;video_id?:string}>({});
  useEffect(() => { endedRef.current = onEnded }, [onEnded]);
  const init = useCallback((videoId: string) => {
    playlistMode.current = false;
    expectedVideoId.current = "";
    setPlaylistReady(true);
    const create = () => { if (player.current) { player.current.loadVideoById(videoId); return; } player.current = new window.YT.Player("youtube-player", { height: "1", width: "1", videoId, playerVars: { autoplay: 1, controls: 0, playsinline: 1 }, events: { onReady: (e:any) => { setReady(true); e.target.playVideo() }, onStateChange: (e:any) => { setPlaying(e.data === window.YT.PlayerState.PLAYING); if (e.data === window.YT.PlayerState.ENDED) endedRef.current() } } }) };
    if (window.YT?.Player) create(); else { window.onYouTubeIframeAPIReady = create; if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) { const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s) } }
  }, []);
  const initPlaylist = useCallback((playlistId:string) => {
    playlistMode.current = true;
    expectedVideoId.current = "";
    setPlaylistReady(false);
    setVideoData({});
    const cueRandom = (target:any) => {
      target.cuePlaylist({list:playlistId,listType:"playlist",index:0});
      let attempts = 0;
      const choose = setInterval(() => {
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
    };
    const create = () => { if (player.current) { cueRandom(player.current); return; } player.current = new window.YT.Player("youtube-player", { height:"1", width:"1", playerVars:{autoplay:0,controls:0,playsinline:1,listType:"playlist",list:playlistId}, events:{ onReady:(e:any)=>{setReady(true);cueRandom(e.target)}, onStateChange:(e:any)=>{setPlaying(e.data===window.YT.PlayerState.PLAYING); if(e.data===window.YT.PlayerState.ENDED&&!playlistMode.current) endedRef.current()} } }) };
    if(window.YT?.Player) create(); else { window.onYouTubeIframeAPIReady=create; if(!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')){const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s)}}
  },[]);
  useEffect(() => { const timer = setInterval(() => { if (player.current?.getCurrentTime) { setCurrentTime(player.current.getCurrentTime() || 0); setDuration(player.current.getDuration() || 0); const data = player.current.getVideoData?.() || {}; if (!playlistMode.current || !expectedVideoId.current || data.video_id === expectedVideoId.current) { setVideoData(data); if (playlistMode.current && data.video_id) { expectedVideoId.current = ""; setPlaylistReady(true) } } } }, 500); return () => clearInterval(timer) }, []);
  return { init, initPlaylist, ready, playlistReady, playing, currentTime, duration, videoData, play: () => player.current?.playVideo(), pause: () => player.current?.pauseVideo(), seek: (seconds:number) => player.current?.seekTo(seconds, true), nextVideo:()=>player.current?.nextVideo(), previousVideo:()=>player.current?.previousVideo(), shufflePlaylist:()=>{player.current?.setShuffle(true);player.current?.nextVideo()} };
}
