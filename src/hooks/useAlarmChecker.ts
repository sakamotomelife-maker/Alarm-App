import { useEffect } from "react";
import { useAlarmStore, type Alarm } from "../store/useAlarmStore";
import { useAlarmRuntimeStore } from "../store/useAlarmRuntimeStore";
import { getHHMM } from "../utils/time";
import { loadHolidayMap } from "../utils/holidayCache";

/* ----------------------------------------
   日付を YYYY-MM-DD に変換
---------------------------------------- */
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ----------------------------------------
   翌営業日を取得
---------------------------------------- */
function getNextBusinessDay(
  date: Date,
  holidays: Record<string, string>
): Date {
  let d = new Date(date);

  while (true) {
    d.setDate(d.getDate() + 1);

    const dow = d.getDay();
    const key = toDateKey(d);

    const isHoliday = holidays[key] !== undefined;
    const isSunday = dow === 0;

    if (!isHoliday && !isSunday) {
      return d;
    }
  }
}

/* ----------------------------------------
   祝日処理（skip / nextBusinessDay / run）
---------------------------------------- */
function handleHolidayBehavior(
  a: Alarm,
  now: Date,
  holidays: Record<string, string>,
  todayKey: string
): boolean {
  if (a.holidayBehavior === "skip") {
    return false;
  }

  if (a.holidayBehavior === "nextBusinessDay") {
    const nextBiz = getNextBusinessDay(now, holidays);
    const nextKey = toDateKey(nextBiz);

    if (todayKey !== nextKey) {
      return false;
    }
  }

  return true;
}

/* ----------------------------------------
   メイン：アラームチェック
---------------------------------------- */
export const useAlarmChecker = () => {
  useEffect(() => {
    let holidays: Record<string, string> = {};

    // ★ 初回ロードで祝日キャッシュを読み込む
    loadHolidayMap().then((h) => {
      holidays = h ?? {};
    });

    const timer = setInterval(() => {
      const now = new Date();
      const hhmm = getHHMM(now);
      const day = now.getDay(); // 0=日曜
      const todayKey = toDateKey(now);

      const alarms = useAlarmStore.getState().alarms;
      const updateAlarm = useAlarmStore.getState().updateAlarm;
      const trigger = useAlarmRuntimeStore.getState().triggerAlarm;

      alarms.forEach((a: Alarm) => {
        if (!a.enabled) return;

        /* ------------------------------
           expireAt
        ------------------------------ */
        if (a.expireAt && now > new Date(a.expireAt)) return;

        /* ------------------------------
           日付指定（単発）
        ------------------------------ */
        if (a.dateOnce) {
          if (a.dateOnce !== todayKey) return;
        }

        /* ------------------------------
           毎月○日指定（number[]）
        ------------------------------ */
        if (a.monthlyDates?.length) {
          const todayDate = now.getDate(); // number
          if (!a.monthlyDates.includes(todayDate)) return;
        }

        /* ------------------------------
           曜日指定（1〜7、7=日曜）
        ------------------------------ */
        if (a.days?.length) {
          const dayKey = day === 0 ? 7 : day;
          if (!a.days.includes(dayKey)) return;
        }

        /* ------------------------------
           祝日判定
        ------------------------------ */
        const isHolidayToday = holidays[todayKey] !== undefined;
        const isSunday = day === 0;

        const sundaySelected = a.days?.includes(7);

        let shouldRun = true;

        if (sundaySelected) {
          // ★ 日曜は祝日扱いしない
          if (isHolidayToday) {
            shouldRun = handleHolidayBehavior(a, now, holidays, todayKey);
          }
        } else {
          // ★ 日曜も祝日扱い
          if (isHolidayToday || isSunday) {
            shouldRun = handleHolidayBehavior(a, now, holidays, todayKey);
          }
        }

        if (!shouldRun) return;

        /* ------------------------------
           時刻指定
        ------------------------------ */
        if (a.time && a.time !== hhmm) return;

        /* ------------------------------
           時間内繰り返し（number[]）
        ------------------------------ */
        if (a.minutePatterns?.length) {
          const mm = now.getMinutes(); // number
          if (!a.minutePatterns.includes(mm)) return;
        }

        /* ------------------------------
           多重発火防止
        ------------------------------ */
        const key = `${todayKey}-${hhmm}`;
        if (a.lastFiredAt === key) return;

        /* ------------------------------
           鳴らす
        ------------------------------ */
        trigger(a);
        updateAlarm(a.id, { lastFiredAt: key });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
};
