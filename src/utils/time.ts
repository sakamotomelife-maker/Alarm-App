export const getHHMM = (date: Date) =>
  date.toTimeString().slice(0, 5);

export const isTimeMatch = (alarmTime: string, now: Date) =>
  getHHMM(now) === alarmTime;
