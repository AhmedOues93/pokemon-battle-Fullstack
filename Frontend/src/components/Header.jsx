import { Link } from "react-router";

function Header() {
  return (
    <header>
  <nav className="  flex justify-between items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-500   shadow-lg">
        {/* Logo */}
        <div className="text-white font-extrabold text-4xl tracking-wide drop-shadow-lg">
          Pokémon Battle
        </div>

        {/* Menu */}
        <div className="flex gap-8 text-lg">
          <Link
            to="/"
            className="relative  text-2xl text-gray-200 font-extrabold transition-all duration-300 hover:text-yellow-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            to="/roster"
            className="relative  text-2xl text-gray-200 font-extrabold transition-all duration-300 hover:text-yellow-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            My Roster
          </Link>
          <Link
            to="/battle"
            className="relative  text-2xl text-gray-200 font-extrabold transition-all duration-300 hover:text-yellow-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Battle
          </Link>
          <Link
            to="/board"
            className="relative  text-2xl text-gray-200 font-extrabold transition-all duration-300 hover:text-yellow-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
          >
            Leaderboard
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
