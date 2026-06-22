// ════════════════════════════════════════════════════════════
//  AdminLink — saytga admin panelga kirish tugmasi
//  Footer.jsx yoki Navbar.jsx ichiga qo'shiladi
// ════════════════════════════════════════════════════════════
//
//  Ishlatish:
//  import AdminLink from "../components/AdminLink.jsx";
//  ...
//  <AdminLink />   // Footer yoki istalgan joyga qo'ying
//
// ════════════════════════════════════════════════════════════
import { ShieldCheck } from "lucide-react";

const ADMIN_URL = "https://holland-bot.onrender.com/admin";

export default function AdminLink() {
  return (
    <a
      href={ADMIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
    >
      <ShieldCheck size={13} />
      Admin panel
    </a>
  );
}