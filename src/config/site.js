export const siteConfig = {
  brand: "Holland",
  phone: "+998906999595",
  phoneDisplay: "+998 (90) 699 95 95",
  telegramUsername: "Holland_fries",
  address: "G'alaba ko'chasi 1 а - uy, 160100, Namangan, Узбекистан",
  workHours: "Har kuni 11:00 – 01:00",
  googleMapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.295648113891!2d71.6049027!3d40.994264699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb4ba29f24446b%3A0xe43d10c1000237da!2sHolland%20fries%20and%20cheese!5e1!3m2!1sru!2s!4v1777025330414!5m2!1sru!2s",
};

export function getTelegramDeepLink(message) {
  const text = encodeURIComponent(message);
  const username = siteConfig.telegramUsername?.trim();
  if (username) return `https://t.me/${username}?text=${text}`;
  return `https://t.me/share/url?text=${text}`;
}
