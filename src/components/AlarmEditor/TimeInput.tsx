import React, { useEffect, useState } from "react";
import { toHalf, pad2 } from "../../utils/format";

type HMProps = {
  hour: string;
  minute: string;
  disabled?: boolean;
  onChange: (v: { hour: string; minute: string }) => void;
};

export const TimeInput: React.FC<HMProps> = ({
  hour,
  minute,
  disabled,
  onChange,
}) => {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);

  useEffect(() => setH(hour), [hour]);
  useEffect(() => setM(minute), [minute]);

  const normalize = (v: string) => toHalf(v).replace(/[^0-9]/g, "");

  const commitHour = () => {
    if (h === "") {
      onChange({ hour: "", minute: m });
      return;
    }
    const num = Math.min(23, Math.max(0, Number(normalize(h) || "0")));
    const fixed = pad2(num);
    setH(fixed);
    onChange({ hour: fixed, minute: m });
  };

  const commitMinute = () => {
    if (m === "") {
      onChange({ hour: h, minute: "" });
      return;
    }
    const num = Math.min(59, Math.max(0, Number(normalize(m) || "0")));
    const fixed = pad2(num);
    setM(fixed);
    onChange({ hour: h, minute: fixed });
  };

  return (
    <div className="hm-row">
      <input
        className="hm-input"
        value={h}
        disabled={disabled}
        maxLength={2}
        onChange={(e) => setH(normalize(e.target.value))}
        onBlur={commitHour}
      />
      <span>:</span>
      <input
        className="hm-input"
        value={m}
        disabled={disabled}
        maxLength={2}
        onChange={(e) => setM(normalize(e.target.value))}
        onBlur={commitMinute}
      />
    </div>
  );
};
