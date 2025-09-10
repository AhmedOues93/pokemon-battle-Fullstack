import { Link } from "react-router";

function Header() {
  return (
    <header>
      <nav className="flex justify-between items-center p-4 bg-gray-800">
        <Link to="/">Home</Link>
        <Link to="/roster">My Roster</Link>
        <Link to="/battle">Battle</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
    </header>
  );
}

export default Header;
