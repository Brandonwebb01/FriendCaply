import React, { useState } from 'react';
import './AddPlayer.css';

function AddPlayer({ isOpen, onClose }) {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerData, setPlayerData] = useState({
    name: '',
    age: '',
    height: '',
    handed: '',
    position: '',
    salary: '',
    contract_type: '',
    contract_way: '',
    years: '',
    points: '',
    goals: '',
    assists: '',
    pim: '',
    teamid: ''
  });

  const handleInputChange = (e) => {
    setPlayerData({
      ...playerData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPlayer = async () => {
    try {
      const formattedData = {
        ...playerData,
        teamid: playerData.teamid === '' ? null : parseInt(playerData.teamid)
      };
  
      const response = await fetch('http://localhost:3001/api/add-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Player added successfully!');
        setPlayerData({
          name: '',
          age: '',
          height: '',
          handed: '',
          position: '',
          salary: '',
          contract_type: '',
          contract_way: '',
          years: '',
          points: '',
          goals: '',
          assists: '',
          pim: '',
          teamid: ''
        });
      } else {
        alert('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-modal">
        <h2>Admin Commands</h2>
        
        {!showAddPlayer ? (
          <div className="admin-buttons">
            <button onClick={() => setShowAddPlayer(true)}>Add Player</button>
          </div>
        ) : (
          <div className="add-player-form">
            <input
              name="name"
              placeholder="Name"
              value={playerData.name}
              onChange={handleInputChange}
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={playerData.age}
              onChange={handleInputChange}
            />
            <input
              name="height"
              placeholder="Height"
              value={playerData.height}
              onChange={handleInputChange}
            />
            <select
              name="handed"
              value={playerData.handed}
              onChange={handleInputChange}
            >
              <option value="">Select Handedness</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
            <select
              name="position"
              value={playerData.position}
              onChange={handleInputChange}
            >
              <option value="">Select Position</option>
              <option value="C">Center</option>
              <option value="LW">Left Wing</option>
              <option value="RW">Right Wing</option>
              <option value="LD">Left Defense</option>
              <option value="RD">Right Defense</option>
              <option value="G">Goalie</option>
            </select>
            <input
              name="salary"
              type="number"
              placeholder="Salary"
              value={playerData.salary}
              onChange={handleInputChange}
            />
            <input
              name="contract_type"
              placeholder="Contract Type"
              value={playerData.contract_type}
              onChange={handleInputChange}
            />
            <input
              name="contract_way"
              placeholder="Contract Way"
              value={playerData.contract_way}
              onChange={handleInputChange}
            />
            <input
              name="years"
              type="number"
              placeholder="Years"
              value={playerData.years}
              onChange={handleInputChange}
            />
            <input
              name="points"
              type="number"
              placeholder="Points"
              value={playerData.points}
              onChange={handleInputChange}
            />
            <input
              name="goals"
              type="number"
              placeholder="Goals"
              value={playerData.goals}
              onChange={handleInputChange}
            />
            <input
              name="assists"
              type="number"
              placeholder="Assists"
              value={playerData.assists}
              onChange={handleInputChange}
            />
            <input
              name="pim"
              type="number"
              placeholder="PIM"
              value={playerData.pim}
              onChange={handleInputChange}
            />
            <select
            name="teamid"
            value={playerData.teamid}
            onChange={handleInputChange}
            >
            <option value="">No Team</option>
            <option value="1">Team 1</option>
            <option value="2">Team 2</option>
            <option value="3">Team 3</option>
            <option value="4">Team 4</option>
            <option value="5">Team 5</option>
            <option value="6">Team 6</option>
            <option value="7">Team 7</option>
            <option value="8">Team 8</option>
            <option value="9">Team 9</option>
            <option value="10">Team 10</option>
            <option value="11">Team 11</option>
            <option value="12">Team 12</option>
            <option value="13">Team 13</option>
            <option value="14">Team 14</option>
            <option value="15">Team 15</option>
            <option value="16">Team 16</option>
            </select>

            <div className="button-container">
              <button onClick={handleAddPlayer}>Add</button>
              <button onClick={onClose}>Exit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPlayer;