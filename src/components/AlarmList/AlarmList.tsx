import React, { useState } from "react";
import { type Alarm, useAlarmStore } from "../../store/useAlarmStore";
import { AlarmRow } from "./AlarmRow";
import { AlarmEditorModal } from "../AlarmEditor/AlarmEditorModal";
import { FurokuModal } from "../Furoku/FurokuModal";
import { AlarmToast } from "../AlarmToast/AlarmToast";
import { useAlarmRuntimeStore } from "../../store/useAlarmRuntimeStore";


export const AlarmList: React.FC = () => {
  const alarms = useAlarmStore((s) => s.alarms);

  const cards = useAlarmRuntimeStore((s) => s.activeCards);
  const stopSound = useAlarmRuntimeStore((s) => s.stopSound);
  const completeCard = useAlarmRuntimeStore((s) => s.completeCard);

  const [editing, setEditing] = useState<Alarm | null>(null);
  const [showFuroku, setShowFuroku] = useState(false);

  return (
    <div className="alarm-list">

      {/* 通知カードを重ねる場所 */}
      <div id="alarm-toast-anchor"></div>

      <div className="list-header">
        <h2>アラーム一覧</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="add-btn"
            onClick={() => setEditing(null)}
          >
            ＋ 新規
          </button>

          <button className="furoku-btn" onClick={() => setShowFuroku(true)}>
            付録
          </button>
        </div>
      </div>

      <div className="list-body">
        {alarms.length === 0 && (
          <div className="empty">アラームがありません</div>
        )}

        {alarms.map((a) => (
          <AlarmRow key={a.id} alarm={a} onEdit={setEditing} />
        ))}
      </div>

      {/* 通知カード（複数対応） */}
      {cards.map((card) => (
        <AlarmToast
          key={card.id}
          alarm={card.alarm as Alarm}
          onStop={() => {
            stopSound(card.id);
            completeCard(card.id);
          }}
        />
      ))}

      {editing && (
        <AlarmEditorModal
          editing={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {showFuroku && (
        <FurokuModal onClose={() => setShowFuroku(false)} />
      )}
    </div>
  );
};
