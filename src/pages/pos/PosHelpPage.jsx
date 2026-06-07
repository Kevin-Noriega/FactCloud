import React from "react";
import {
  MessageCircle,
  HelpCircle,
  GraduationCap,
  PlayCircle,
  Wifi,
  Monitor,
} from "lucide-react";

const CARDS = [
  {
    icon: <HelpCircle size={22} color="#1565C0" />,
    title: "Soporte en línea",
    desc: "Resuelve tus dudas o inquietudes vía chat.",
    action: "Iniciar conversación",
    href: "https://wa.me/573000000000",
  },
  {
    icon: <MessageCircle size={22} color="#25D366" />,
    title: "WhatsApp",
    desc: "Resuelve tus consultas vía WhatsApp.",
    action: "Iniciar conversación",
    href: "https://wa.me/573000000000",
  },
  {
    icon: <GraduationCap size={22} color="#1565C0" />,
    title: "Capacitaciones",
    desc: "Inscríbete y conoce más sobre el POS.",
    action: "Inscribirse",
    href: "#",
  },
  {
    icon: <PlayCircle size={22} color="#1565C0" />,
    title: "Guías y videos",
    desc: "Accede a contenido sobre cada funcionalidad.",
    action: "Ver guías y videos",
    href: "#",
  },
];

const TOOLS = [
  {
    icon: <Wifi size={22} color="#1565C0" />,
    title: "Prueba de velocidad de internet",
    desc: "Verifica la velocidad y el estado de tu conexión.",
    action: "Iniciar prueba",
    href: "https://fast.com",
  },
  {
    icon: <Monitor size={22} color="#1565C0" />,
    title: "Soporte virtual",
    desc: "Instala un software para recibir asistencia virtual.",
    action: "Descargar",
    href: "https://www.anydesk.com/es",
  },
];

export default function PosHelpPage() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f8fbff" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "16px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Ayuda y soporte</h1>
      </div>

      <div style={{ padding: 24 }}>
        <h2 style={heading}>¿Necesitas ayuda?</h2>
        <p style={{ fontSize: 14, color: "#666", marginTop: 0 }}>
          A continuación encontrarás diferentes opciones para resolver tus dudas.
        </p>
        <Grid cards={CARDS} />

        <h2 style={{ ...heading, marginTop: 28 }}>Herramientas</h2>
        <Grid cards={TOOLS} />
      </div>
    </div>
  );
}

function Grid({ cards }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
      {cards.map((c) => (
        <div key={c.title} style={card}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div>{c.icon}</div>
            <div>
              <strong style={{ color: "#1a1a2e" }}>{c.title}</strong>
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>{c.desc}</p>
            </div>
          </div>
          <a href={c.href} target="_blank" rel="noopener noreferrer" style={linkBtn}>
            {c.action}
          </a>
        </div>
      ))}
    </div>
  );
}

const heading = { fontSize: 18, fontWeight: 700, color: "#1a1a2e" };
const card = {
  background: "#fff",
  border: "1px solid #e8f0fe",
  borderRadius: 12,
  padding: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
};
const linkBtn = {
  border: "1.5px solid #1565C0",
  color: "#1565C0",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
};
