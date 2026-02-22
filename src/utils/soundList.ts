type SoundItem = {
  fileName: string;
  url: string;
  duration?: number;
};

/* ----------------------------------------
   sounds/*.mp3 読み込み（silent.mp3 は除外）
---------------------------------------- */
const soundFiles = import.meta.glob("/src/assets/sounds/*.mp3", { eager: true });

const baseSoundList: SoundItem[] = Object.keys(soundFiles)
  .filter((path: string) => !path.includes("silent.mp3"))
  .map((path: string) => {
    const fileName = path.split("/").pop()!;
    return {
      fileName,
      url: (soundFiles as Record<string, any>)[path].default as string,
    };
  });

/* ----------------------------------------
   duration を読み取る
---------------------------------------- */
const loadDuration = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
};

/* ----------------------------------------
   soundListPromise（duration 付き）
---------------------------------------- */
export const soundListPromise: Promise<SoundItem[]> = Promise.all(
  baseSoundList.map(async (s: SoundItem) => {
    const duration = await loadDuration(s.url);
    return {
      ...s,
      duration,
    };
  })
);
