export const siteConfig = {
  brand: "Holland",
  phone: "+998939111636",
  phoneDisplay: "+998 (93) 911 16 36",
  telegramUsername: "prosto_senior",
  address: "Namangan, Uzbekistan",
  workHours: "Har kuni 10:00 – 23:00",
  googleMapEmbedUrl:
    "https://maps.app.goo.gl/1h4r4Gytce8iNEsK9",
};

export function getTelegramDeepLink(message) {
  const text = encodeURIComponent(message);
  const username = siteConfig.telegramUsername?.trim();
  if (username) return `https://t.me/${username}?text=${text}`;
  return `https://t.me/share/url?text=${text}`;
}

