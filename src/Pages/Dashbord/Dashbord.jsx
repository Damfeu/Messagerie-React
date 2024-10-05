import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Components/Button/Button';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données de session (token, user info, etc.)
    localStorage.removeItem('authToken');

    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Passer la fonction de déconnexion dans le bouton */}
      <Button text={'Se déconnecter'} onClick={handleLogout} />
    </div>
  );
}