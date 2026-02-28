import { Link} from "react-router-dom";
import { useEffect} from "react";
import "../styles/NavBarSecondary.css";

export default function NavBarSecondary() {
  useEffect(() => {
    document.body.style.background = "var(--bg-dark)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

 
  return (
    <nav className="navbarSecondary">
      <div className="navsec-content">
        <Link to="/">
          <img
            src="/img/LogoFC.png"
            alt="FactCloud"
            className="logo-navsec"
            style={{ cursor: "pointer" }}
          />
        </Link>

      </div>
    </nav>
  );
}
