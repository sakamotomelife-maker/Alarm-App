import { create } from "zustand";
import type { Alarm } from "./useAlarmStore";

type ActiveCard = {
  id: string;
  alarm: Alarm;
  audio: HTMLAudioElement | null;
};

type RuntimeStore = {
  activeCards: ActiveCard[];
  triggerAlarm: (alarm: Alarm) => void;
  stopSound: (cardId: string) => void;
  completeCard: (cardId: string) => void;
};

export const useAlarmRuntimeStore = create<RuntimeStore>((set) => ({
  activeCards: [],

  triggerAlarm: (alarm) =>
    set((state) => {
      let audio: HTMLAudioElement | null = null;

      /* ------------------------------
         ★ ネイティブ通知（右下バナー）
      ------------------------------ */
      if (Notification.permission === "granted") {
        new Notification(`${alarm.name}`, {
          body: `${alarm.time ?? ""} になりました`,
          icon: "/icons/alarm.png",
        });
      }

      /* ------------------------------
         ★ サウンド再生
      ------------------------------ */
      if (alarm.sound && alarm.sound !== "none") {
        const audioSrc = alarm.sound;
        audio = new Audio(audioSrc);

        if (alarm.durationMode === "infinite") {
          audio.loop = true;
        } else if (alarm.durationMode === "once") {
          audio.loop = false;
          audio.onended = () => {
            set((s) => ({
              activeCards: s.activeCards.filter((c) => c.alarm.id !== alarm.id),
            }));
          };
        } else {
          audio.loop = false;
          if (alarm.durationSec > 0) {
            setTimeout(() => {
              if (audio) {
                audio.pause();
                audio.currentTime = 0;
              }
            }, alarm.durationSec * 1000);
          }
        }

        audio.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      }

      return {
        activeCards: [
          ...state.activeCards,
          { id: crypto.randomUUID(), alarm, audio },
        ],
      };
    }),

  /* ------------------------------
     ★ 停止ボタン（停止 → カードは残る）
  ------------------------------ */
  stopSound: (cardId) =>
    set((state) => {
      const card = state.activeCards.find((c) => c.id === cardId);
      if (card?.audio) {
        card.audio.pause();
        card.audio.currentTime = 0;
      }
      return state;
    }),

  /* ------------------------------
     ★ 処理済み（カードを閉じる）
  ------------------------------ */
  completeCard: (cardId) =>
    set((state) => ({
      activeCards: state.activeCards.filter((c) => c.id !== cardId),
    })),
}));
