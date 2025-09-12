import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router";
import bgBody from "../img/BG_BODY.png";

const Layout = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgBody})` }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

