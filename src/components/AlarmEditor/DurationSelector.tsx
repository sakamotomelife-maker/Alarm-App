import React from "react";
import { toHalf } from "../../utils/format";

type Props = {
  durationMode: "fixed" | "infinite" | "once";
  durationSec: number | "";
  isNoSound: boolean;
  onChangeMode: (m: "fixed" | "infinite" | "once") => void;
  onChangeSec: (sec: number | "") => void;
};

export const DurationSelector: React.FC<Props> = ({
  durationMode,
  durationSec,
  isNoSound,
  onChangeMode,
  onChangeSec,
}) => {
  return (
    <div className="section">
      <label className="label">継続時間</label>

      <div className="boxed-section duration-box">
        <div className="radio-row">
          {/* 秒数指定 */}
          <label>
            <input
              type="radio"
              checked={durationMode === "fixed"}
              onChange={() => onChangeMode("fixed")}
            />
            秒数指定
          </label>

          <input
            className="hm-input hm-input-narrow"
            disabled={durationMode !== "fixed"}
            value={durationSec === "" ? "" : String(durationSec)}
            maxLength={3}
            onChange={(e) => {
              const raw = toHalf(e.target.value).replace(/[^0-9]/g, "");
              if (raw === "") {
                onChangeSec("");
                return;
              }
              const num = Math.min(999, Math.max(1, Number(raw)));
              onChangeSec(num);
            }}
          />
          <span>秒</span>

          {/* 止めるまで */}
          <label>
            <input
              type="radio"
              checked={durationMode === "infinite"}
              onChange={() => onChangeMode("infinite")}
            />
            止めるまで
          </label>

          {/* 一回再生するまで（サウンドなし時は無効） */}
          <label>
            <input
              type="radio"
              checked={durationMode === "once"}
              disabled={isNoSound}
              onChange={() => onChangeMode("once")}
            />
            一回再生するまで
          </label>
        </div>
      </div>
    </div>
  );
};
