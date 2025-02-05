import React, { useState, useEffect } from 'react';
import InteractiveDropdown from '../DropdownComponents/InteractiveDropdown';
import TeamsDropdown from '../DropdownComponents/TeamsDropdown';
import TeamOverview from '../DropdownComponents/TeamOverview';
import Login from '../AuthLogin/Login';
import AddPlayer from '../AdminCommands/AddPlayer';
import './Navbar.css';

const Navbar = () => {
  const [showInteractiveDropdown, setShowInteractiveDropdown] = useState(false);
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null); // New state for selected team
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!user;
  const isAdmin = user?.admin === 1;

  useEffect(() => {
    fetch('http://localhost:3001/api/teams')
      .then(response => response.json())
      .then(data => setTeams(data))
      .catch(error => console.error('Error fetching teams:', error));
  }, []);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowTeamsDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">FriendCaply</div>
        {isLoggedIn ? (
        <>
          {isAdmin && (
            <button onClick={() => setIsAdminOpen(true)}>Admin Commands</button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => setIsLoginOpen(true)}>Login</button>
      )}

      <Login 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      
      <AddPlayer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
        <div className="menu-items">
          <div 
            className="dropdown" 
            onMouseEnter={() => setShowInteractiveDropdown(true)} 
            onMouseLeave={() => setShowInteractiveDropdown(false)}
          >
            Interactive ▼
            <InteractiveDropdown show={showInteractiveDropdown} />
          </div>
          <div 
            className="dropdown" 
            onMouseEnter={() => setShowTeamsDropdown(true)} 
            onMouseLeave={() => setShowTeamsDropdown(false)}
          >
            Teams ▼
            <TeamsDropdown 
              show={showTeamsDropdown} 
              teams={teams} 
              onSelectTeam={handleTeamSelect}   // Pass the handler!
            />
          </div>
          <div className="dropdown">Players ▼</div>
          <div className="dropdown">Tools ▼</div>
          <div className="dropdown">Fantasy-Tools ▼</div>
          <div className="dropdown">Calculators ▼</div>
          <button className="button">Scouting</button>
          <button className="button">Forums</button>
        </div>
      </nav>
      
      {/* Conditionally render TeamOverview */}
      {selectedTeam && (
        <TeamOverview team={selectedTeam} />
      )}
    </>
  );
};

export default Navbar;