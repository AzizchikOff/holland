import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "../config/site.js";
import { useLanguage } from "../context/useLanguage.js";

export default function Contact() {
  const { t } = useLanguage();

  const details = [
    {
      label: t("phone"),
      value: siteConfig.phoneDisplay,
      href: `tel:${siteConfig.phone}`,
      icon: Phone,
    },
    {
      label: "Telegram",
      value: `@${siteConfig.telegramUsername}`,
      href: `https://t.me/${siteConfig.telegramUsername}`,
      icon: Send,
    },
    {
      label: t("address"),
      value: siteConfig.address,
      icon: MapPin,
    },
    {
      label: t("hours"),
      value: siteConfig.workHours,
      icon: Clock3,
    },
  ];

  return (
    <main className="min-h-screen bg-[#EDE2D3] text-[#302824]">
      <section className="relative isolate overflow-hidden bg-[#DCC9B3]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[55px] border-[#92272D]/5" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#C79B64]" />
            <Sparkles size={16} className="text-[#92272D]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#92272D]">
              CONTACT HOLLAND
            </span>
          </div>

          <h1 className="text-[clamp(2.2rem,5vw,4.2rem)] font-bold tracking-[-0.055em]">
            {t("contact")}
            <span className="text-[#92272D]">.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#62534A] sm:text-base">
            {t("contactIntro")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {details.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="group flex min-w-0 items-start gap-4 rounded-[24px] border border-[#C79B64]/25 bg-white/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#92272D]/10 text-[#92272D]">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#92272D]">
                      {item.label}
                    </p>

                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("https") ? "_blank" : undefined}
                        rel={item.href.startsWith("https") ? "noopener noreferrer" : undefined}
                        className="mt-2 inline-flex items-center gap-2 break-all text-sm font-bold text-[#302824] hover:text-[#92272D]"
                      >
                        {item.value}
                        <ArrowUpRight size={16} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#302824]">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#C79B64]/25 bg-white p-3 shadow-[0_15px_50px_rgba(48,40,36,0.08)]">
            <div className="flex items-center gap-3 px-3 pb-3 pt-2">
              <MapPin size={19} className="text-[#92272D]" />
              <h2 className="font-bold text-[#302824]">{t("mapTitle")}</h2>
            </div>

            <iframe
              title={t("mapTitle")}
              src={siteConfig.googleMapEmbedUrl}
              className="h-[360px] w-full rounded-[20px] border-0 sm:h-[440px] lg:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
