import { useLanguage } from "../context/LanguageContext.jsx";

export default function About() {
  const { t } = useLanguage();
  const cards = [
    ["history", "story", "storyText"],
    ["mission", "missionTitle", "missionText"],
    ["why", "service", "serviceText"],
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{t("about")}</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">{t("aboutIntro")}</p>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(([label, heading, body]) => (
          <div key={label} className="rounded-2xl bg-white border border-gray-100 p-6">
            <div className="text-sm font-semibold text-gray-600">{t(label)}</div>
            <div className="mt-2 text-gray-900 font-bold text-xl">{t(heading)}</div>
            <p className="mt-2 text-gray-600">{t(body)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
