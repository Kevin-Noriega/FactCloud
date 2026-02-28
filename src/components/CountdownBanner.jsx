import { useState, useEffect } from "react";
import "../styles/CountdownBanner.css";

const getTimeLeft = (targetDate) => {
  const now = Date.now();
  const diff = targetDate - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

  const targetDate = new Date("2026-03-31T07:06:59").getTime();
export default function CountdownBanner() {

const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));
const [showTimer, setShowTimer] = useState(() => Boolean(getTimeLeft(targetDate)));


  useEffect(() => {
  const timer = setInterval(() => {
    const updated = getTimeLeft(targetDate);

    if (!updated) {
      setShowTimer(false);
      clearInterval(timer);
      return;
    }

    setTimeLeft(updated);
  }, 1000);

  return () => clearInterval(timer);
}, []);

  if (!showTimer) return null;

  return (
    <div className="countdown-banner">
      <div className="countdown-content">
        <p className="countdown-text">
          ¡Empieza el año ahorrando! Accede a nuestros sistemas con descuentos
          exclusivos por tiempo limitado.
        </p>

        <div className="countdown-timer">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div className="time-unit" key={unit}>
              <div className="time-value">
                {String(timeLeft[unit]).padStart(2, "0")}
              </div>
              <div className="time-label">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
