import { Link } from "react-router-dom"; 

export default function Header() {
  return (
    <header>
 
      <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-lg">
        <div className="text-white font-extrabold text-4xl tracking-wide drop-shadow-lg">
          Pokémon Battle
        </div>
        <div className="flex gap-8 text-lg">
      
          <Link to="/" className="relative text-2xl text-gray-200 font-extrabold hover:text-yellow-300">
            Home
          </Link>
          <Link to="/roster" className="relative text-2xl text-gray-200 font-extrabold hover:text-yellow-300">
            My Roster
          </Link>
          <Link to="/battle" className="relative text-2xl text-gray-200 font-extrabold hover:text-yellow-300">
            Battle
          </Link>
          <Link to="/board" className="relative text-2xl text-gray-200 font-extrabold hover:text-yellow-300">
            Leaderboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
