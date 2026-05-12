import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { siteConfig } from "../config/site.js";

export default function MainLayout() {
  const location = useLocation();
  const isOrder = location.pathname === "/order";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {!isOrder && (
        <footer className="mt-auto border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="text-xl font-extrabold text-gray-900">
                  🍔 Holland
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Tez, halol va mazali fast food.
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors"
                >
                  📞 {siteConfig.phoneDisplay}
                </a>
                <a
                  href={`https://t.me/${siteConfig.telegramUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 font-semibold transition-colors"
                >
                  💬 Telegram
                </a>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>© {new Date().getFullYear()} Holland. Barcha huquqlar himoyalangan.</span>
              <span>{siteConfig.workHours}</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
