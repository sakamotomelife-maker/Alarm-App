import { create } from "zustand";

export type Alarm = {
  id: string;
  name: string;

  /* 時刻 */
  time: string | null;

  /* 繰り返し設定 */
  repeatType: "weekday" | "dateOnce" | "monthly" | "minutePattern";
  days: number[];
  dateOnce: string | null;

  /* 毎月○日 / 毎時○分（number[] に統一） */
  monthlyDates: number[];
  minutePatterns: number[];

  /* 有効期間 */
  activeFrom: string | null;
  activeTo: string | null;
  expireAt: string | null;

  /* 祝日 */
  includeHoliday: boolean;
  holidayBehavior: "run" | "skip" | "nextBusinessDay";

  /* サウンド */
  sound: string;
  soundName: string;

  durationMode: "infinite" | "once" | "fixed";
  durationSec: number;

  /* ON/OFF */
  enabled: boolean;

  /* 多重発火防止 */
  lastFiredAt?: string | null;
};

type AlarmStore = {
  alarms: Alarm[];

  load: () => void;
  save: () => void;

  addAlarm: (a: Alarm) => void;
  updateAlarm: (id: string, patch: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleEnabled: (id: string) => void;
};

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: [],

  /* ----------------------------------------
     ★ ローカルストレージから読み込み
     （古い string[] データを number[] に変換）
  ---------------------------------------- */
  load: () => {
    const raw = localStorage.getItem("alarms");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      const fixed: Alarm[] = parsed.map((a: any) => ({
        ...a,

        /* number[] に統一 */
        monthlyDates: (a.monthlyDates ?? []).map((d: any) => Number(d) || 0),
        minutePatterns: (a.minutePatterns ?? []).map((m: any) => Number(m) || 0),

        /* holidayBehavior の補完 */
        holidayBehavior: a.holidayBehavior ?? "run",

        /* soundName の補完 */
        soundName: a.soundName ?? a.sound ?? "none",
      }));

      set({ alarms: fixed });
    } catch (e) {
      console.error("Failed to load alarms:", e);
    }
  },

  /* ----------------------------------------
     ★ 保存
  ---------------------------------------- */
  save: () => {
    const alarms = get().alarms;
    localStorage.setItem("alarms", JSON.stringify(alarms));
  },

  /* ----------------------------------------
     ★ CRUD
  ---------------------------------------- */
  addAlarm: (a) =>
    set((s) => {
      const next = [...s.alarms, a];
      localStorage.setItem("alarms", JSON.stringify(next));
      return { alarms: next };
    }),

  updateAlarm: (id, patch) =>
    set((s) => {
      const next = s.alarms.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      );
      localStorage.setItem("alarms", JSON.stringify(next));
      return { alarms: next };
    }),

  deleteAlarm: (id) =>
    set((s) => {
      const next = s.alarms.filter((a) => a.id !== id);
      localStorage.setItem("alarms", JSON.stringify(next));
      return { alarms: next };
    }),

  toggleEnabled: (id) =>
    set((s) => {
      const next = s.alarms.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      );
      localStorage.setItem("alarms", JSON.stringify(next));
      return { alarms: next };
    }),
}));
