import { useEffect } from "react";
import { useAlarmStore } from "./store/useAlarmStore";
import { AlarmList } from "./components/AlarmList/AlarmList";
import { useAlarmChecker } from "./hooks/useAlarmChecker";

/* ----------------------------------------
   ★ silent.mp3 を assets から import（相対パス）
---------------------------------------- */
import silent from "./assets/sounds/silent.mp3";

export const App = () => {
  const load = useAlarmStore((s) => s.load);

  // 初回ロード
  useEffect(() => {
    load();
  }, []);

  // 通知許可
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ----------------------------------------
     ★ Edge autoplay 対策（決定版）
     初回クリックで silent.mp3 を再生して解除
  ---------------------------------------- */
  useEffect(() => {
    let unlocked = false;

    const unlockAudio = () => {
      if (unlocked) return;
      unlocked = true;

      const audio = new Audio(silent);
      audio.volume = 0;

      audio.play().catch((err) => {
        console.log("Silent autoplay unlock failed:", err);
      });

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // アラームチェック
  useAlarmChecker();

  return (
    <div className="app-container">
      <AlarmList />
    </div>
  );
};
