import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { siteConfig } from "../config/site.js";
import AdminLink from "../components/AdminLink.jsx";

const MainLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-xl font-semibold tracking-tight text-gray-900">
                Holland
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Tez, halol va mazali fast food.
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100"
                href={`tel:${siteConfig.phone}`}
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100"
                href={`https://t.me/${siteConfig.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>
              <div className="py-6 text-center border-t border-gray-100">
                <AdminLink />
              </div>
            </div>
          </div>
          <div className="mt-8 text-xs text-gray-500">
            © {new Date().getFullYear()} Holland. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
