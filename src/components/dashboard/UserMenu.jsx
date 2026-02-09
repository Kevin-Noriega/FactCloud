// components/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserMenu.css';

const UserMenu = ({ userName, userEmail, userPlan, userAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
    const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
   localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    sessionStorage.clear();
    
    navigate('/login');
    
    window.location.reload();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-button"
      >
        <span className="user-menu-name">{userName}</span>
        <ChevronDown 
          className={`user-menu-chevron ${isOpen ? 'rotated' : ''}`}
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
              <h4 className="user-menu-title">{userName}</h4>
              <p className="user-menu-email">{userEmail}</p>
              {userPlan && (
                <span className="user-menu-badge">{userPlan}</span>
              )}
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
