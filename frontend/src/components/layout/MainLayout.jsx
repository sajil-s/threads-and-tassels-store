
import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

function MainLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <AnnouncementBar />

      <div className="sticky top-0 z-30">
        <Navbar />
      </div>

      <main>
        <Outlet />
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
}

export default MainLayout;
