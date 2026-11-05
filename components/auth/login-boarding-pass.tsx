export type LoginMood = "idle" | "explore" | "private";

type Props = {
  mood: LoginMood;
};

/**
 * Pase de embarque NEMI — orientación multi-destino (mundo).
 */
export function LoginBoardingPass({ mood }: Props) {
  const bars = [
    3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 3, 2, 1,
    3, 4, 1, 2, 3, 1, 2, 4, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4,
  ];

  return (
    <div
      className={`nemi-board nemi-board--${mood}`}
      role="img"
      aria-label="Pase de orientación NEMI para explorar el mundo"
    >
      <div className="nemi-board-ticket">
        <div className="nemi-board-stub">
          <p className="nemi-board-airline">NEMI</p>
          <p className="nemi-board-stub-code">WORLD</p>
          <div className="nemi-board-stub-qr" aria-hidden>
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="nemi-board-qr-cell"
                style={{ opacity: (i * 7) % 5 === 0 ? 0.15 : 0.85 }}
              />
            ))}
          </div>
        </div>

        <div className="nemi-board-main">
          <div className="nemi-board-top">
            <div>
              <p className="nemi-board-kicker">Pase de orientación</p>
              <p className="nemi-board-brand">NEMI · multi-destino</p>
            </div>
            <div className={`nemi-board-badge ${mood === "private" ? "is-locked" : ""}`}>
              {mood === "private" ? "PRIVADO" : "ABIERTO"}
            </div>
          </div>

          <div className="nemi-board-route">
            <div className="nemi-board-city">
              <span className="nemi-board-iata">TÚ</span>
              <span className="nemi-board-city-name">Donde estés</span>
            </div>
            <div className="nemi-board-flight" aria-hidden>
              <span className="nemi-board-flight-line" />
              <svg
                className="nemi-board-flight-plane"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
              </svg>
              <span className="nemi-board-flight-line" />
            </div>
            <div className="nemi-board-city nemi-board-city-end">
              <span className="nemi-board-iata">MUNDO</span>
              <span className="nemi-board-city-name">Cultura · lugar</span>
            </div>
          </div>

          <div className="nemi-board-grid">
            <div>
              <p className="nemi-board-label">Pasajero</p>
              <p className="nemi-board-value">
                {mood === "explore"
                  ? "Explorador global"
                  : mood === "private"
                    ? "••••••••"
                    : "Por confirmar"}
              </p>
            </div>
            <div>
              <p className="nemi-board-label">Alcance</p>
              <p className="nemi-board-value nemi-board-gate">
                {mood === "explore" ? "Global" : mood === "private" ? "—" : "··"}
              </p>
            </div>
            <div>
              <p className="nemi-board-label">Enfoque</p>
              <p className="nemi-board-value">Orientación cultural</p>
            </div>
            <div>
              <p className="nemi-board-label">Estado</p>
              <p className="nemi-board-value">
                {mood === "explore"
                  ? "Listo para descubrir"
                  : mood === "private"
                    ? "Sellado"
                    : "En espera"}
              </p>
            </div>
          </div>

          <div className="nemi-board-barcode" aria-hidden>
            {bars.map((w, i) => (
              <span
                key={i}
                className="nemi-board-bar"
                style={{ width: w === 1 ? 2 : w === 2 ? 3 : w === 3 ? 4 : 6 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
