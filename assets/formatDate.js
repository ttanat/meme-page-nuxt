export default function formatDate(timestring) {
  const min = (new Date() - new Date(timestring)) / 1000 / 60;
  if (min < 1) return `${Math.round(s)} second${Math.round(s) === 1 ? "" : "s"}`;
  const hrs = min / 60;
  if (hrs < 1) return `${Math.round(min)} minute${Math.round(min) === 1 ? "" : "s"}`;
  const days = hrs / 24;
  if (days < 1) return `${Math.round(hrs)} hour${Math.round(hrs) === 1 ? "" : "s"}`;
  const wks = days / 7;
  if (wks < 1) return `${Math.round(days)} day${Math.round(days) === 1 ? "" : "s"}`;
  const mnths = days / 30;
  if (mnths < 1) return `${Math.round(wks)} week${Math.round(wks) === 1 ? "" : "s"}`;
  const yrs = days / 365;
  if (yrs < 1) return `${Math.round(mnths)} month${Math.round(mnths) === 1 ? "" : "s"}`;
  return `${Math.round(yrs)} year${Math.round(yrs) === 1 ? "" : "s"}`;
}
