import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/useLanguage.js";

const cards = [
  {
    label: "history",
    heading: "story",
    body: "storyText",
    icon: BookOpen,
    number: "01",
  },
  {
    label: "mission",
    heading: "missionTitle",
    body: "missionText",
    icon: ShieldCheck,
    number: "02",
  },
  {
    label: "why",
    heading: "service",
    body: "serviceText",
    icon: HeartHandshake,
    number: "03",
  },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#EDE2D3] text-[#302824]">
      <section className="relative isolate overflow-hidden bg-[#DCC9B3]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[55px] border-[#92272D]/5" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#C79B64]" />
            <Sparkles size={16} className="text-[#92272D]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#92272D]">
              THE HOLLAND STORY
            </span>
          </div>

          <h1 className="max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.055em]">
            HOLLAND
            <span className="text-[#92272D]"> — {t("about")}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#62534A] sm:text-base">
            {t("aboutIntro")}
          </p>

          <div className="mt-9 flex items-center gap-3">
            <span className="rounded-full border border-[#92272D]/20 bg-white/40 px-4 py-2 text-xs font-bold text-[#92272D]">
              FRESH · HALAL · HOLLAND
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-[2px] w-9 bg-[#C79B64]" />
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#92272D]">
            HOLLAND EXPERIENCE
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.number}
                className="group relative overflow-hidden rounded-[26px] border border-[#C79B64]/25 bg-white/85 p-7 shadow-[0_12px_40px_rgba(48,40,36,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_50px_rgba(48,40,36,0.10)]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-[0.18em] text-[#C79B64]">
                    {card.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#92272D]/10 text-[#92272D] transition-colors group-hover:bg-[#92272D] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.8} />
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#92272D]">
                  {t(card.label)}
                </span>

                <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[#302824]">
                  {t(card.heading)}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#73695E]">
                  {t(card.body)}
                </p>

                <div className="mt-7 h-[2px] w-12 rounded-full bg-[#C79B64] transition-all duration-300 group-hover:w-24" />
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-6 rounded-[28px] bg-gradient-to-br from-[#92272D] to-[#302824] px-6 py-9 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#C79B64]">
              HOLLAND FAST FOOD
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              {t("orderReady")}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              {t("orderPrompt")}
            </p>
          </div>

          <Link
            to="/menu"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#C79B64] px-6 py-3.5 text-sm font-bold text-[#302824] transition-transform hover:-translate-y-1"
          >
            {t("viewMenu")}
            <ArrowUpRight
              size={19}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
