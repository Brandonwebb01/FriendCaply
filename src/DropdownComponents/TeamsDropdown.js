import React, { useState, useMemo } from 'react';
import './TeamsDropdown.css';

const TeamsDropdown = ({ show, teams, onSelectTeam }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const groupedTeams = useMemo(() => {
    const grouped = {
      Atlantic: [],
      Metropolitan: [],
      Central: [],
      Pacific: []
    };
    teams.forEach(team => {
      if (grouped[team.division]) {
        grouped[team.division].push(team);
      }
    });
    return grouped;
  }, [teams]);

  if (!show) return null;

  return (
    <div className="teams-dropdown">
      <div className="teams-dropdown-inner">
        {Object.entries(groupedTeams).map(([division, divisionTeams]) => (
          <div key={division} className="division-column">
            <h3 className="division-title">{division}</h3>
            {divisionTeams.map((team) => (
              <div
                key={team.team_id}
                className={`team-item ${hoveredItem === team.team_id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredItem(team.team_id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onSelectTeam(team)}
              >
                <div className="team-item-content">
                  {team.logo && (
                    <img 
                      src={team.logo} 
                      alt={`${team.team_name} logo`}
                      className="team-dropdown-logo"
                    />
                  )}
                  <span className="team-name">{team.team_name}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsDropdown;