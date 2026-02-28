import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from '../../hooks/useUsuarios'; 
import "../../styles/UserMenu.css";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const {data: usuario, isLoading} = useUsuarios();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    
  }, [isOpen]);

  const handleLogout = () => {
     localStorage.clear();
    sessionStorage.clear();
    
    navigate('/login', { replace: true });

    window.location.reload();
  };

  const getInitials = (name) => {
    if (!name) return 'UD';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const userName = usuario?.nombreCompleto || 'Usuario';
  const businessNit = usuario?.negocioNit;
  const userEmail = usuario?.usuario?.correo ||  'email@ejemplo.com';
  const userPlan = usuario?.planNombre || "Demo";
  const userAvatar = usuario?.usuario?.avatar || usuario?.avatar;

  if (isLoading) {
    return (
      <div className="user-menu-loading">
        <div className="avatar-skeleton"></div>
        <span>Cargando...</span>
      </div>
    );
  }
  return (
    <div className="user-menu-container" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="user-menu-button">
        <span className="user-menu-name">{userName}</span>
        <ChevronDown
          className={`user-menu-chevron ${isOpen ? "rotated" : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-menu-avatar">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} />
              ) : (
                <div className="user-menu-initials">
                  {getInitials(userName)}
                </div>
              )}
            </div>

            <div className="user-menu-info">
              <h4 className="user-menu-title">{userName} {businessNit}</h4>
              <p className="user-menu-email">{userEmail}</p>
              {userPlan && <span className="user-menu-badge">{userPlan}</span>}
            </div>
          </div>

          <div className="user-menu-links">
            <a href="/perfil" className="user-menu-link">
              Mi perfil
            </a>
            <a href="/cambio-clave" className="user-menu-link">
              Cambio de clave
            </a>
          </div>

          <div className="user-menu-footer">
            <button onClick={handleLogout} className="user-menu-logout">
              <span>Cerrar sesión</span>
              <BoxArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
