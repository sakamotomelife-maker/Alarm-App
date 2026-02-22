export const toHalf = (s: string) =>
  s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

export const pad2 = (n: number) => n.toString().padStart(2, "0");
