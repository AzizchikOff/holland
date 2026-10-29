export function setupTelegramViewport() {
  const tg = window.Telegram?.WebApp;

  if (!tg) return () => {};

  const updateViewport = () => {
    const height =
      tg.viewportStableHeight ||
      tg.viewportHeight ||
      window.innerHeight;

    if (height > 0) {
      document.documentElement.style.setProperty(
        "--tg-viewport-height",
        `${height}px`
      );
    }

    document.documentElement.style.setProperty(
      "--tg-safe-top",
      `${tg.safeAreaInset?.top || 0}px`
    );

    document.documentElement.style.setProperty(
      "--tg-safe-bottom",
      `${tg.safeAreaInset?.bottom || 0}px`
    );

    document.documentElement.style.setProperty(
      "--tg-content-safe-top",
      `${tg.contentSafeAreaInset?.top || 0}px`
    );

    document.documentElement.style.setProperty(
      "--tg-content-safe-bottom",
      `${tg.contentSafeAreaInset?.bottom || 0}px`
    );
  };

  try {
    tg.setHeaderColor?.("#EDE2D3");
    tg.setBackgroundColor?.("#EDE2D3");
  } catch (error) {
    console.warn("Telegram theme configuration:", error);
  }

  tg.ready();
  tg.expand();

  updateViewport();

  tg.onEvent?.("viewportChanged", updateViewport);
  tg.onEvent?.("safeAreaChanged", updateViewport);
  tg.onEvent?.("contentSafeAreaChanged", updateViewport);

  return () => {
    tg.offEvent?.("viewportChanged", updateViewport);
    tg.offEvent?.("safeAreaChanged", updateViewport);
    tg.offEvent?.("contentSafeAreaChanged", updateViewport);
  };
}
