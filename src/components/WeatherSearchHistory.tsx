import "./WeatherSearchHistory.css";

interface WeatherSearchHistoryProps {
  history: string[];
  onCityClick: (city: string) => void;
  onRemoveCity: (city: string) => void;
  onClearHistory: () => void;
}

export function WeatherSearchHistory({
  history,
  onCityClick,
  onRemoveCity,
  onClearHistory,
}: WeatherSearchHistoryProps) {
  const isEmpty = history.length === 0;

  return (
    <div className="search-history">
      <h3>История поиска</h3>
      <div className="history-list-container">
        <div className="history-list">
          {isEmpty ? (
            <>
              <div className="empty-history">
                <p>История поиска пуста</p>
                <p className="empty-hint">Найдите погоду в городе, чтобы добавить её в историю</p>
              </div>
              <button className="clear-history-btn" disabled>
                Очистить всю историю
              </button>
            </>
          ) : (
            <>
              <div className="history-items">
                {history.map((city, index) => (
                  <div className="history-item-wrapper" key={city} data-city={city}>
                    <span
                      className="history-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => onCityClick(city)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onCityClick(city);
                        }
                      }}
                    >
                      <span className="history-item-number">{index + 1}.</span>
                      <span className="history-item-name">{city}</span>
                    </span>
                    <button
                      className="remove-history-item"
                      data-city={city}
                      title={`Удалить ${city} из истории`}
                      onClick={() => onRemoveCity(city)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button className="clear-history-btn" onClick={onClearHistory}>
                Очистить всю историю
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
