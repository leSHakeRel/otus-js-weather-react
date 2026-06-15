import { Link } from "react-router";
import { Navigation } from "@/components/Navigation";

export function NotFound() {
  return (
    <>
      <Navigation />
      <div className="app">
        <div className="main-container">
          <h1>404 — Страница не найдена</h1>
          <p>Запрашиваемая страница не существует.</p>
          <Link
            to="/main"
            className="back-to-home"
            style={{ display: "inline-block", marginTop: "20px" }}
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
}
