import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PokemonDetailsPage from "./pages/PokemonDetailsPage.jsx";
import MyRosterPage from "./pages/MyRosterPage.jsx";
import BattlePage from "./pages/BattlePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="details/:name" element={<PokemonDetailsPage />} />
        <Route path="roster" element={<MyRosterPage />} />
        <Route path="battle" element={<BattlePage />} />
        <Route path="board" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  );
}
