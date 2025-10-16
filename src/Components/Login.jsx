
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
     if (email && password) {
      // Lógica de autenticación (aquí puedes validar o llamar una API)
      navigate("/dashboard");
    }
   
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold" style={{ color: "#007bff" }}>
            Fact<span style={{ color: "#198754" }}>Cloud</span>
          </h2>
          <p className="text-muted small">
            Accede a tu panel de facturación electrónica
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-info text-white fw-semibold">
              Ingresar
            </button>
          </div>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Proyecto prototipo · FactCloud
        </p>
      </div>
    </div>
  );
}
