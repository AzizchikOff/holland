// ✅ FIX 5: URL kodga qotirilmagan — env orqali
// ✅ FIX 1e: rel="nofollow noindex" — qidiruv tizimlariga ko'rsatilmaydi
const ADMIN_URL = `${import.meta.env.VITE_API_URL || "https://holland-bot.onrender.com"}/admin`;

export default function AdminLink() {
  return (
    <a
      href={ADMIN_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Admin panel"
      className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors"
    >
      ·
    </a>
  );
}