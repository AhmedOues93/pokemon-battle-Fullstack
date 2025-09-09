import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/roster">My Roster</Link>
        <Link to="/battle">Battle</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
    </header>
  );
}

export default Header;
