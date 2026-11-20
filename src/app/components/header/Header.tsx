import { Navbar } from "../navbar/Navbar";
import "./Header.css";

export function Header() {
  return (
    <header className="site-header">
      {/* Logo */}
      <div>
        <a className="brand" href="#inicio" aria-label="Comparador de Precios, inicio">
          <span className="brand-icon" aria-hidden="true">
            🛒
          </span>
          <span>Comparador de Precios</span>
        </a>
      </div>
      {/* Componente de navegación */}
      <div className="componentes-navbar">
        <Navbar />

        {/* Botón de perfil */}
        <button className="profile-button" type="button" aria-label="Mi perfil">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
