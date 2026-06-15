import { Link } from "react-router";

export function Navigation() {
  return (
    <nav className="nav">
      <Link to="/main" className="nav-link">
        Главная
      </Link>
      <Link to="/about" className="nav-link">
        О приложении
      </Link>
    </nav>
  );
}
