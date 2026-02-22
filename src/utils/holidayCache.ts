// utils/holidayCache.ts
const CACHE_KEY = "jp_holidays_cache";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7日

export async function loadHolidayMap() {
  const now = Date.now();

  // 既存キャッシュを読む
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const data = JSON.parse(cached);
    if (now - data.timestamp < CACHE_TTL) {
      return data.holidays;
    }
  }

  // API 取得
  try {
    const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    const holidays = await res.json();

    // キャッシュ保存
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: now,
        holidays,
      })
    );

    return holidays;
  } catch (e) {
    console.error("祝日API取得失敗:", e);
    return {}; // フォールバック
  }
}
