import { siteConfig } from "../config/site.js";

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        Aloqa
      </h1>
      <p className="mt-3 text-gray-600">
        Savollaringiz bo'lsa, yozing yoki qo'ng'iroq qiling.
      </p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-500">Telefon</div>
              <a
                className="mt-2 block font-bold text-gray-900 hover:text-red-600"
                href={`tel:${siteConfig.phone}`}
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-500">Telegram</div>
              <a
                className="mt-2 block font-bold text-gray-900 hover:text-red-600"
                href={`https://t.me/${siteConfig.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
              >
                @{siteConfig.telegramUsername}
              </a>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
              <div className="text-xs font-semibold text-gray-500">Manzil</div>
              <div className="mt-2 font-semibold text-gray-900">
                {siteConfig.address}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
              <div className="text-xs font-semibold text-gray-500">
                Ish vaqti
              </div>
              <div className="mt-2 font-semibold text-gray-900">
                {siteConfig.workHours}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
          <iframe
            title="Google xarita"
            src={siteConfig.googleMapEmbedUrl}
            className="w-full h-[380px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
