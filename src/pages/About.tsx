import { Link } from "react-router";
import { Navigation } from "@/components/Navigation";
import "@/components/About.css";

export function About() {
  return (
    <>
      <Navigation />
      <div className="app">
        <div className="main-container">
          <div className="about-content">
            <h2>О приложении &laquo;Прогноз погоды&raquo;</h2>

            <div className="about-section">
              <p>Приложение для просмотра прогноза погоды</p>
            </div>

            <div className="about-section">
              <h3>Технологии</h3>
              <ul>
                <li>Vanilla JavaScript (ES6+)</li>
                <li>Клиентский роутинг с поддержкой истории</li>
                <li>Event-driven архитектура (EventBus)</li>
                <li>Open-Meteo API для данных о погоде</li>
                <li>IP-API для геолокации</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>Ссылки</h3>
              <ul>
                <li>
                  <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
                    Open-Meteo API
                  </a>
                </li>
                <li>
                  <a href="https://ip-api.com/" target="_blank" rel="noopener noreferrer">
                    IP-API
                  </a>
                </li>
              </ul>
            </div>

            <Link className="back-to-home" data-router-link="href" to="/main">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
