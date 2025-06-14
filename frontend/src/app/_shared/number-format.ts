export const formatLargeNumber = (input: number | string): string => {
  const num = typeof input === "string" ? Number(input) : input;

  if (isNaN(num)) {
    return "NaN";
  }

  if (num < 1e3) {
    return num.toString();
  }

  const suffixes = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "O", "N", "d"];
  const exponent = Math.floor(Math.log10(num) / 3);
  const suffix = suffixes[exponent] || "";
  const shortNum = num / Math.pow(10, exponent * 3);

  return `${shortNum.toFixed(2)}${suffix}`;
};