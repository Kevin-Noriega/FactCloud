import "../styles/TopBar.css";
import canalesAtencion from "../components/CanalesAtencion";

const canales = [canalesAtencion[1], canalesAtencion[3]];

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-content">

        {/* CONTACTOS IZQUIERDA */}
        <div className="top-bar-left">
          {canales.map((canal, idx) => (
            <div key={idx} className="topBar-contact">
              <a href={canal.href} className="top-link">
                {canal.icono}
                {canal.disponibilidad}
              </a>
            </div>
          ))}
        </div>

        <div className="top-bar-right">
          <div className="country">
            <img
              src="https://flagcdn.com/w20/co.png"
              alt="Colombia"
              width="20"
              height="15"
            />
            <span>COLOMBIA</span>

          </div>
        </div>

      </div>
    </div>
  );
}
