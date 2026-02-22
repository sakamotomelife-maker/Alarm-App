import React from "react";
import { createPortal } from "react-dom";
import { type Alarm } from "../../store/useAlarmStore";

type Props = {
  alarm: Alarm | null;
  onStop: () => void;
};

export const AlarmToast: React.FC<Props> = ({ alarm, onStop }) => {
  if (!alarm) return null; // null ガード（白画面防止）

  const anchor = document.getElementById("alarm-toast-anchor");
  if (!anchor) return null; // createPortal の null 対策

  return createPortal(
    <div className="alarm-toast">
      <div className="toast-left">
        <div className="toast-title">🔔 {alarm.name}</div>
        <div className="toast-time">{alarm.time} になりました</div>
      </div>

      <button className="toast-stop" onClick={onStop}>
        停止
      </button>
    </div>,
    anchor
  );
};
