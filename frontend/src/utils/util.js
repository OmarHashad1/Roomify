export const humanize = (s) =>
  typeof s === "string"
    ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : s;
