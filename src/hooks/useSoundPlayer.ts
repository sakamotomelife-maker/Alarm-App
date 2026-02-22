import { useEffect, useState } from "react";

export const useSoundPlayer = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /** 再生開始（前の音を止めてから再生） */
  const play = (url: string) => {
    // すでに再生中なら止める
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });

    audio.play().catch((e) => console.error("再生失敗:", e));

    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  /** 停止 */
  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  /** アンマウント時（モーダル閉じた時）に停止 */
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  return {
    isPlaying,
    play,
    stop,
  };
};
