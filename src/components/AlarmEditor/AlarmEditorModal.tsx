import { useEffect, useState } from "react";

// store
import { type Alarm, useAlarmStore } from "../../store/useAlarmStore";

// utils
import { newId } from "../../utils/id";
import { pad2 } from "../../utils/format";

// components
import { DaySelector } from "./DaySelector";
import { HolidaySettings } from "./HolidaySettings";
import { PatternEditor } from "./PatternEditor";
import { DurationSelector } from "./DurationSelector";
import { SoundSelector } from "./SoundSelector";

type Props = {
  editing?: Alarm | null;
  onClose: () => void;
};

console.log("AlarmEditorModal loaded")

export const AlarmEditorModal: React.FC<Props> = ({ editing, onClose }) => {
  const addAlarm = useAlarmStore((s) => s.addAlarm);
  const updateAlarm = useAlarmStore((s) => s.updateAlarm);
  const deleteAlarm = useAlarmStore((s) => s.deleteAlarm);

  const isNew = !editing?.id;

  /* repeatType 判定 */
  const initialRepeatType: "weekday" | "dateOnce" | "monthly" =
    editing?.dateOnce
      ? "dateOnce"
      : editing?.monthlyDates?.length
      ? "monthly"
      : "weekday";

  const [repeatType, setRepeatType] = useState(initialRepeatType);

  /* 曜日（1〜7、7=日曜） */
  const [days, setDays] = useState<number[]>(editing?.days ?? []);

  /* 日付指定 */
  const [dateOnce, setDateOnce] = useState(editing?.dateOnce ?? "");

  /* 毎月○日（number[] に統一） */
  const [monthlyDates, setMonthlyDates] = useState<number[]>(
    editing?.monthlyDates?.length ? editing.monthlyDates : [0, 0, 0, 0]
  );

  /* 祝日動作 */
  const [holidayBehavior, setHolidayBehavior] = useState<
    "run" | "skip" | "nextBusinessDay"
  >(editing?.holidayBehavior ?? "run");

  /* 時刻 / 繰り返し */
  const isTimeMode = (editing?.minutePatterns?.length ?? 0) === 0;
  const [mode, setMode] = useState<"time" | "repeat">(
    isTimeMode ? "time" : "repeat"
  );

  const [time, setTime] = useState(editing?.time ?? "09:00");

  /* minutePatterns も number[] に統一 */
  const [minutePatterns, setMinutePatterns] = useState<number[]>(
    editing?.minutePatterns?.length ? editing.minutePatterns : [0]
  );

  const [activeFrom, setActiveFrom] = useState(editing?.activeFrom ?? "09:00");
  const [activeTo, setActiveTo] = useState(editing?.activeTo ?? "17:00");

  /* サウンド */
  const initialSound = editing?.sound ?? "none";
  const initialLabel = editing?.soundName ?? initialSound;
  const [soundValue, setSoundValue] = useState(initialSound);
  const [soundLabel, setSoundLabel] = useState(initialLabel);
  const isNoSound = soundValue === "none";

  /* durationMode */
  const [durationMode, setDurationMode] = useState<
    "fixed" | "infinite" | "once"
  >(editing?.durationMode ?? (editing?.durationSec === 0 ? "infinite" : "fixed"));

  const [durationSec, setDurationSec] = useState<number | "">(
    editing?.durationSec ?? 5
  );

  /* サウンドなしのとき once を強制解除 */
  useEffect(() => {
    if (isNoSound && durationMode === "once") {
      setDurationMode("fixed");
    }
  }, [isNoSound, durationMode]);

  /* アラーム名 */
  const [name, setName] = useState(editing?.name ?? "");

  /* 日曜選択中かどうか（7=日曜） */
  const sundaySelected =
    repeatType === "weekday" && days.includes(7);

  /* 保存処理 */
  const save = () => {
    const alarm: Alarm = {
      id: editing?.id ?? newId(),
      name,

      /* ★ Alarm 型に必須 */
      repeatType,
      includeHoliday: false,

      days: repeatType === "weekday" ? days : [],
      dateOnce: repeatType === "dateOnce" ? dateOnce : null,

      monthlyDates:
        repeatType === "monthly" ? monthlyDates.filter((d) => d > 0) : [],

      holidayBehavior,

      time: mode === "time" ? time : null,

      minutePatterns:
        mode === "repeat" ? minutePatterns.filter((m) => m >= 0) : [],

      activeFrom: mode === "repeat" ? activeFrom : null,
      activeTo: mode === "repeat" ? activeTo : null,

      expireAt: editing?.expireAt ?? null,

      sound: soundValue,
      soundName: soundLabel,

      durationMode,
      durationSec: durationMode === "fixed" ? (durationSec || 0) : 0,

      enabled: editing?.enabled ?? true,
    };

    if (isNew) addAlarm(alarm);
    else updateAlarm(alarm.id, alarm);

    onClose();
  };

  const remove = () => {
    if (!editing) return;
    deleteAlarm(editing.id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal wide">
        <header className="modal-header">
          <div>アラーム編集</div>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">

          {/* ▼ アラーム名 */}
          <div className="section">
            <label className="label">アラーム名</label>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
            />
          </div>

          {/* ▼ 曜日/日時指定 */}
          <div className="section">
            <label className="label">曜日/日時指定</label>

            <div className="boxed-section schedule-box">
              <div className="radio-row-tight">
                <label>
                  <input
                    type="radio"
                    checked={repeatType === "weekday"}
                    onChange={() => setRepeatType("weekday")}
                  />
                  曜日指定
                </label>

                <label>
                  <input
                    type="radio"
                    checked={repeatType === "dateOnce"}
                    onChange={() => setRepeatType("dateOnce")}
                  />
                  日付指定
                </label>

                <label>
                  <input
                    type="radio"
                    checked={repeatType === "monthly"}
                    onChange={() => setRepeatType("monthly")}
                  />
                  毎月○日
                </label>
              </div>

              <div className="schedule-inner">
                {repeatType === "weekday" && (
                  <DaySelector days={days} onChangeDays={setDays} />
                )}

                {repeatType === "dateOnce" && (
                  <input
                    type="date"
                    className="text-input"
                    value={dateOnce}
                    onChange={(e) => setDateOnce(e.target.value)}
                  />
                )}

                {repeatType === "monthly" && (
                  <div className="monthly-wrapper">
                    {monthlyDates.map((d, i) => (
                      <div key={i} className="monthly-row">
                        <input
                          className="hm-input"
                          maxLength={2}
                          value={d === 0 ? "" : pad2(d)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            const list = [...monthlyDates];

                            if (raw === "") {
                              list[i] = 0;
                            } else {
                              const num = Math.min(31, Math.max(1, Number(raw)));
                              list[i] = num;
                            }

                            setMonthlyDates(list);
                          }}
                        />
                        <span>日</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ▼ 日曜/祝日 */}
          <HolidaySettings
            sundaySelected={sundaySelected}
            holidayBehavior={holidayBehavior}
            onChange={setHolidayBehavior}
          />

          {/* ▼ 時刻 / 繰り返し */}
          <PatternEditor
            mode={mode}
            time={time}
            activeFrom={activeFrom}
            activeTo={activeTo}
            minutePatterns={minutePatterns}
            onChangeMode={setMode}
            onChangeTime={setTime}
            onChangeActiveFrom={setActiveFrom}
            onChangeActiveTo={setActiveTo}
            onChangeMinutePattern={(v) => setMinutePatterns([v])}
          />

          {/* ▼ サウンド */}
          <div className="section">
            <label className="label">サウンド</label>
                <SoundSelector
                  soundValue={soundValue}
                  onChange={(v, label) => {
                    setSoundValue(v);
                    setSoundLabel(label);
                  }}
                />
          </div>

          {/* ▼ 継続時間 */}
          <DurationSelector
            durationMode={durationMode}
            durationSec={durationSec}
            isNoSound={isNoSound}
            onChangeMode={setDurationMode}
            onChangeSec={setDurationSec}
          />

        </div>

        <footer className="modal-footer">
          {!isNew && (
            <button className="delete-btn" onClick={remove}>
              削除
            </button>
          )}

          <button className="save-btn" onClick={save}>
            保存
          </button>
        </footer>
      </div>
    </div>
  );
};

