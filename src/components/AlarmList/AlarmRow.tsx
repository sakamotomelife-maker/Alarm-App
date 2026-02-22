import React from "react";
import { type Alarm, useAlarmStore } from "../../store/useAlarmStore";

type Props = {
  alarm: Alarm;
  onEdit: (a: Alarm) => void;
};

export const AlarmRow: React.FC<Props> = ({ alarm, onEdit }) => {
  const update = useAlarmStore((s) => s.updateAlarm);

  const toggleEnabled = () => {
    update(alarm.id, { enabled: !alarm.enabled });
  };

  // アラーム名のフォント縮小ロジック
  const getFontSize = (name: string) => {
    if (name.length <= 12) return 14;
    if (name.length <= 15) return 13;
    return 13;
  };

  const displayName =
    alarm.name.length > 15 ? alarm.name.slice(0, 15) + "…" : alarm.name;

  return (
    <div className="alarm-row">
      <div className="alarm-info">
        <div
          className="alarm-name"
          style={{ fontSize: getFontSize(alarm.name) }}
          title={alarm.name}
        >
          {displayName}
        </div>

        <div className="alarm-sub">
          {alarm.time
            ? alarm.time
            : alarm.minutePatterns?.length
            ? `毎時 ${alarm.minutePatterns.join(",")}分`
            : "—"}
        </div>
      </div>

      <div className="alarm-actions">
        <label className="switch">
          <input
            type="checkbox"
            checked={alarm.enabled}
            onChange={toggleEnabled}
          />
          <span className="slider"></span>
        </label>

        <button className="edit-btn" onClick={() => onEdit(alarm)}>
          編集
        </button>
      </div>
    </div>
  );
};
