import React from "react";

type Props = {
  sundaySelected: boolean;
  holidayBehavior: "run" | "skip" | "nextBusinessDay";
  onChange: (v: "run" | "skip" | "nextBusinessDay") => void;
};

export const HolidaySettings: React.FC<Props> = ({
  sundaySelected,
  holidayBehavior,
  onChange,
}) => {
  return (
    <div className="section compact">
      <label className="label">
        {sundaySelected ? "祝日の場合：" : "日曜/祝日の場合："}
      </label>

      <div className="holiday-row-inline">
        <label>
          <input
            type="radio"
            checked={holidayBehavior === "nextBusinessDay"}
            onChange={() => onChange("nextBusinessDay")}
          />
          翌営業日
        </label>

        <label>
          <input
            type="radio"
            checked={holidayBehavior === "skip"}
            onChange={() => onChange("skip")}
          />
          実施しない
        </label>

        <label>
          <input
            type="radio"
            checked={holidayBehavior === "run"}
            onChange={() => onChange("run")}
          />
          実施する
        </label>
      </div>
    </div>
  );
};
