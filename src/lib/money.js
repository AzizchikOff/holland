export function formatSum(amount) {
  const n = Number(amount || 0);
  return new Intl.NumberFormat("uz-UZ").format(Math.round(n));
}

