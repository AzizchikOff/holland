import { lazy, Suspense, Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { useLanguage } from "./context/useLanguage.js";
import MainLayout from "./layout/MainLayout";
import MiniAppNavigation from "./components/MiniAppNavigation.jsx";

const Home    = lazy(() => import("./pages/Home"));
const Menu    = lazy(() => import("./pages/Menu"));
const About   = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Order   = lazy(() => import("./pages/Order"));

function PageLoader() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">{t("loading")}</span>
      </div>
    </div>
  );
}

// ✅ FIX 2i: 404 sahifa
function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🍟</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("notFound")}</h1>
      <p className="text-gray-500 mb-8">{t("notFoundDesc")}</p>
      <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
        🏠 {t("home")}
      </Link>
    </div>
  );
}

// ✅ FIX 5: ErrorBoundary — lazy chunk yuklanmasa oq ekran bo'lmaydi
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Sahifa xatosi:", error, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nimadir noto'g'ri ketdi</h2>
          <p className="text-gray-500 mb-8">Sahifani yangilab ko'ring.</p>
          <button onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
            🔄 Yangilash
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <LanguageProvider><BrowserRouter>
      <MiniAppNavigation />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/"        element={<Home />} />
              <Route path="/app"     element={<Home />} />
              <Route path="/app/menu" element={<Menu />} />
              <Route path="/app/about" element={<About />} />
              <Route path="/app/contact" element={<Contact />} />
              <Route path="/app/order" element={<Order />} />
              <Route path="/menu"    element={<Menu />} />
              <Route path="/about"   element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order"   element={<Order />} />
              <Route path="*"        element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter></LanguageProvider>
  );
}

export default App;