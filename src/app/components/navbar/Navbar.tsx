
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
    return (
        <nav className="main-nav" aria-label="Navegación principal">
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                Inicio
            </NavLink>

            <NavLink to="/carrito" className={({ isActive }) => isActive ? "active" : ""}>
                Mi carrito
            </NavLink>
        </nav>
    );
}
