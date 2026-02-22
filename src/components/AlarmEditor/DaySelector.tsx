const dayLabels = ["月", "火", "水", "木", "金", "土", "日"];

type Props = {
  days: number[];
  onChangeDays: (days: number[]) => void;
};

export const DaySelector: React.FC<Props> = ({ days, onChangeDays }) => {
  const toggle = (d: number) => {
    if (days.includes(d)) {
      onChangeDays(days.filter((x) => x !== d));
    } else {
      onChangeDays([...days, d]);
    }
  };

  return (
    <div className="day-selector-wrapper">
      <div className="day-selector-row">
        {dayLabels.map((label, idx) => (
          <div
            key={idx}
            className={`day-pill ${days.includes(idx + 1) ? "selected" : ""}`}
            onClick={() => toggle(idx + 1)}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
