import React, { useState, useEffect } from 'react';
//import './FreeAgencyList.css';

const FreeAgencyList = ({ teamId, onSignPlayer }) => {
  const [freeAgents, setFreeAgents] = useState([]);

  useEffect(() => {
    const fetchFreeAgents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/free-agents');
        const data = await response.json();
        setFreeAgents(data);
      } catch (error) {
        console.error('Error fetching free agents:', error);
      }
    };

    fetchFreeAgents();
  }, []);
    
  return (
  <div className="free-agency-list">
    <h2>Free Agents</h2>
    <table className="roster-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Height</th>
          <th>Hand</th>
          <th>Pos</th>
          <th>Points</th>
          <th>Goals</th>
          <th>Assists</th>
          <th>PIM</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {freeAgents.map((player, index) => (
          <tr key={player.player_id} className={index % 2 === 0 ? 'even' : 'odd'}>
            <td>{player.name}</td>
            <td>{player.age}</td>
            <td>{player.height}</td>
            <td>{player.handed === 'Right' ? 'R' : 'L'}</td>
            <td>{player.position}</td>
            <td>{player.points}</td>
            <td>{player.goals}</td>
            <td>{player.assists}</td>
            <td>{player.pim}</td>
            <td>
              <button onClick={() => onSignPlayer(player)}>Sign</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default FreeAgencyList;