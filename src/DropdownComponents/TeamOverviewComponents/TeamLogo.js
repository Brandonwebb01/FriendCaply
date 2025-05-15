import React, { useState, useEffect } from 'react';
import './TeamLogo.css';

const TeamLogo = ({ teamId, className = '', style = {}, alt = 'Team Logo' }) => {
  const [logoSrc, setLogoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      if (!teamId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/team-logo/${teamId}`);
        if (!response.ok) {
          throw new Error('Logo not found');
        }
        const data = await response.json();
        setLogoSrc(data.logo);
      } catch (err) {
        console.error('Error fetching team logo:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [teamId]);

  if (isLoading) {
    return <div className={`team-logo-placeholder ${className}`} style={style} />;
  }

  if (error || !logoSrc) {
    return <div className={`team-logo-error ${className}`} style={style} />;
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`team-logo ${className}`}
      style={style}
    />
  );
};

export default TeamLogo;