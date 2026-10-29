import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const miniAppPaths = new Set([
  "/",
  "/menu",
  "/about",
  "/contact",
  "/order",
]);

export default function MiniAppNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isMiniApp = location.pathname === "/app" ||
      location.pathname.startsWith("/app/");

    if (!isMiniApp) return;

    const path = location.pathname.replace(/^\/app(?=\/|$)/, "") || "/";

    if (!miniAppPaths.has(path)) return;

    // Telegram ichidagi joriy sahifani belgilash
    document.documentElement.dataset.hollandMiniApp = "true";

    return () => {
      delete document.documentElement.dataset.hollandMiniApp;
    };
  }, [location.pathname]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    const isMiniApp = location.pathname === "/app" ||
      location.pathname.startsWith("/app/");

    if (!isMiniApp) {
      tg.BackButton.hide();
      return;
    }

    const isHome = location.pathname === "/app" ||
      location.pathname === "/app/";

    const goBack = () => navigate(-1);

    if (isHome) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
      tg.BackButton.onClick(goBack);
    }

    return () => {
      tg.BackButton.offClick(goBack);
      tg.BackButton.hide();
    };
  }, [location.pathname, navigate]);

  return null;
}
