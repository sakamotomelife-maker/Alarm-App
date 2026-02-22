import React from "react";
import { TimeInput } from "./TimeInput";
import { toHalf, pad2 } from "../../utils/format";

type Props = {
  mode: "time" | "repeat";
  time: string;
  activeFrom: string;
  activeTo: string;

  /* number[] に統一 */
  minutePatterns: number[];

  onChangeMode: (m: "time" | "repeat") => void;
  onChangeTime: (v: string) => void;
  onChangeActiveFrom: (v: string) => void;
  onChangeActiveTo: (v: string) => void;

  /* number を返す */
  onChangeMinutePattern: (v: number) => void;
};

export const PatternEditor: React.FC<Props> = ({
  mode,
  time,
  activeFrom,
  activeTo,
  minutePatterns,
  onChangeMode,
  onChangeTime,
  onChangeActiveFrom,
  onChangeActiveTo,
  onChangeMinutePattern,
}) => {
  const [timeH, timeM] = time.split(":");
  const [fromH, fromM] = activeFrom.split(":");
  const [toH, toM] = activeTo.split(":");

  const minuteValue = minutePatterns[0] ?? 0;

  return (
    <div className="section">
      <label className="label">時刻</label>

      <div className="boxed-section">
        {/* ▼ 時刻指定 */}
        <div className="time-row">
          <label className="time-label">
            <input
              type="radio"
              checked={mode === "time"}
              onChange={() => onChangeMode("time")}
            />
            時刻指定
          </label>

          <TimeInput
            hour={timeH}
            minute={timeM}
            disabled={mode !== "time"}
            onChange={({ hour, minute }) => {
              if (hour === "" || minute === "") {
                onChangeTime(`${hour || "00"}:${minute || "00"}`);
              } else {
                onChangeTime(`${hour}:${minute}`);
              }
            }}
          />
        </div>

        {/* ▼ 時間内繰り返し */}
        <div className="time-row">
          <label className="time-label">
            <input
              type="radio"
              checked={mode === "repeat"}
              onChange={() => onChangeMode("repeat")}
            />
            繰り返し
          </label>

          <div className="time-repeat-inline repeat-label-small">
            <TimeInput
              hour={fromH}
              minute={fromM}
              disabled={mode !== "repeat"}
              onChange={({ hour, minute }) =>
                onChangeActiveFrom(`${hour || "00"}:${minute || "00"}`)
              }
            />

            <span>〜</span>

            <TimeInput
              hour={toH}
              minute={toM}
              disabled={mode !== "repeat"}
              onChange={({ hour, minute }) =>
                onChangeActiveTo(`${hour || "00"}:${minute || "00"}`)
              }
            />

            <span className="small-text" style={{ marginLeft: 4 }}>
              毎時
            </span>

            {/* ▼ minutePatterns（number[]） */}
            <input
              className="hm-input hm-input-narrow"
              disabled={mode !== "repeat"}
              maxLength={2}
              value={minuteValue === 0 ? "" : pad2(minuteValue)}
              onChange={(e) => {
                const raw = toHalf(e.target.value).replace(/[^0-9]/g, "");

                if (raw === "") {
                  onChangeMinutePattern(0);
                  return;
                }

                const num = Math.min(59, Math.max(0, Number(raw)));
                onChangeMinutePattern(num);
              }}
            />

            <span className="small-text">になったら</span>
          </div>
        </div>
      </div>
    </div>
  );
};
