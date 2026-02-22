import React, { useState, useEffect } from "react";

type SoundItem = {
  fileName: string;
  url: string;
};

/* ----------------------------------------
   通常サウンド（sounds/*.mp3）
---------------------------------------- */
const normalSounds = import.meta.glob("/src/assets/sounds/*.mp3", {
  eager: true,
});

/* ----------------------------------------
   secret サウンド（sounds/secret/*.mp3）
---------------------------------------- */
const secretSounds = import.meta.glob("/src/assets/sounds/secret/*.mp3", {
  eager: true,
});

/* ----------------------------------------
   ファイル名とURLのリスト化
---------------------------------------- */
function toList(obj: Record<string, any>): SoundItem[] {
  return Object.keys(obj).map((path: string) => {
    const fileName = path.split("/").pop()!;
    return {
      fileName,
      url: obj[path].default as string,
    };
  });
}

const normalList: SoundItem[] = toList(normalSounds);
const secretList: SoundItem[] = toList(secretSounds);

/* ----------------------------------------
   Props 型
---------------------------------------- */
type Props = {
  onClose: () => void;
};

/* ----------------------------------------
   FurokuModal（動画なし版）
---------------------------------------- */
export const FurokuModal: React.FC<Props> = ({ onClose }) => {
  const [normalSel, setNormalSel] = useState("");
  const [secretSel, setSecretSel] = useState("");

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ▼ 再生開始 */
  const handlePlay = (url: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });

    audio.play().catch((e) => console.error("再生失敗:", e));

    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  /* ▼ 停止 */
  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  /* ▼ モーダルが閉じられたときも停止 */
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  return (
    <div className="modal-backdrop">
      <div className="modal wide">

        <header className="modal-header">
          <div>付録</div>
          <button
            className="close-btn"
            onClick={() => {
              handleStop();
              onClose();
            }}
          >
            ×
          </button>
        </header>

        <div className="modal-body">

          {/* 通常サウンド */}
          <div className="section">
            <label className="label">サウンド試聴</label>

            <div className="row">
              <select
                className="text-input"
                value={normalSel}
                onChange={(e) => setNormalSel(e.target.value)}
              >
                <option value="">選択してください</option>
                {normalList.map((s: SoundItem) => (
                  <option key={s.fileName} value={s.url}>
                    {s.fileName}
                  </option>
                ))}
              </select>

              <button
                className="play-btn"
                disabled={!normalSel}
                onClick={() => {
                  if (isPlaying) handleStop();
                  else handlePlay(normalSel);
                }}
              >
                {isPlaying ? "■" : "▶"}
              </button>
            </div>
          </div>

          {/* secret サウンド */}
          <div className="section">
            <label className="label">お楽しみ（secret）</label>

            <div className="row">
              <select
                className="text-input"
                value={secretSel}
                onChange={(e) => setSecretSel(e.target.value)}
              >
                <option value="">選択してください</option>
                {secretList.map((s: SoundItem) => (
                  <option key={s.fileName} value={s.url}>
                    {s.fileName}
                  </option>
                ))}
              </select>

              <button
                className="play-btn"
                disabled={!secretSel}
                onClick={() => {
                  if (isPlaying) handleStop();
                  else handlePlay(secretSel);
                }}
              >
                {isPlaying ? "■" : "▶"}
              </button>
            </div>
          </div>

        </div>

        <footer className="modal-footer">
          <button
            className="save-btn"
            onClick={() => {
              handleStop();
              onClose();
            }}
          >
            閉じる
          </button>
        </footer>

      </div>
    </div>
  );
};
