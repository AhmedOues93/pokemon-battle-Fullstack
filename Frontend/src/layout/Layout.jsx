import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom"; 
import bgBody from "../img/BG_BODY.png";

export default function Layout() {
  return (
 
    <div className="min-h-screen relative text-white">
   
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgBody})` }}
      />
     
      <div className="absolute inset-0 bg-black/20" />

   
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

