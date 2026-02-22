import { useEffect, useState } from "react";
import { soundListPromise } from "../../utils/soundList";
import { useSoundPlayer } from "../../hooks/useSoundPlayer";

type Props = {
  soundValue: string;
  onChange: (value: string, label: string) => void;
};

export const SoundSelector: React.FC<Props> = ({
  soundValue,
  onChange,
}) => {
  const [soundList, setSoundList] = useState<any[]>([]);
  const { isPlaying, play, stop } = useSoundPlayer();

  useEffect(() => {
    soundListPromise.then(setSoundList);
  }, []);

  const handleSelect = (v: string) => {
    const item = soundList.find((s) => s.url === v);
    onChange(v, item?.fileName ?? v);
  };

  return (
    <div className="boxed-section sound-box row">
      <select
        className="text-input sound-select"
        value={soundValue}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="none">サウンドなし</option>

        {soundList.map((s) => (
          <option key={s.fileName} value={s.url}>
            {s.fileName}
          </option>
        ))}
      </select>

      <button
        className="play-btn"
        disabled={soundValue === "none"}
        onClick={() => {
          if (isPlaying) stop();
          else play(soundValue);
        }}
      >
        {isPlaying ? "■" : "▶"}
      </button>
    </div>
  );
};
