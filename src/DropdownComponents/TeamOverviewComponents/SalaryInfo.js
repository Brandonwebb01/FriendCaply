import React, { useState, useEffect } from 'react';
//import './SalaryInfo.css';

const SalaryInfo = ({ teamId }) => {
  const [teamRoster, setTeamRoster] = useState([]);
  const salaryCap = 88000000;

  useEffect(() => {
    const fetchTeamRoster = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/team-roster/${teamId}`);
        const data = await response.json();
        setTeamRoster(data);
      } catch (error) {
        console.error('Error fetching team roster:', error);
      }
    };

    fetchTeamRoster();
  }, [teamId]);

  const teamSalaryCap = teamRoster.reduce((total, player) => total + (player.salary || 0), 0);
  const capSpace = salaryCap - teamSalaryCap;

  return (
    <div className="salary-info">
      <h3>Salary Information</h3>
      <p>2024-2024 Salary Cap: ${salaryCap.toLocaleString()}</p>
      <p>Team Salary Cap: ${teamSalaryCap.toLocaleString()}</p>
      <p>Cap Space: ${capSpace.toLocaleString()}</p>
    </div>
  );
};

export default SalaryInfo;