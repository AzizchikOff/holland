import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminLink from "../components/AdminLink.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EDE2D3]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
