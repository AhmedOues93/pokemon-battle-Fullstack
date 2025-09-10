import React from "react";
// import Router from "react-router";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";

import BattlePage from "./pages/BattlePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import MyRosterPage from "./pages/MyRosterPage.jsx";
import PokemonDetailsPage from "./pages/PokemonDetailsPage.jsx";
import Layout from "./layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/board" element={<LeaderboardPage />} />
        <Route path="/roster" element={<MyRosterPage />} />
        <Route path="/details" element={<PokemonDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
