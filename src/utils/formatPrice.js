// formatPrice — pul formatlash yordamchi funksiyasi
// Ilgari bu fayl bo'sh edi

export { formatSum } from "../lib/money.js";

// Qo'shimcha: "19 000 so'm" ko'rinishida qaytaradi
export function formatPrice(amount) {
  const n = Number(amount || 0);
  return new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";
}