import React, { useState, useEffect } from 'react';
import './TradePickModal.css';

const TradePickModal = ({ pick, currentTeam, onClose, onTrade }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/teams');
        const data = await response.json();
        // Filter out current team
        const otherTeams = data.filter(team => team.team_id !== parseInt(currentTeam));
        setTeams(otherTeams);
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };

    fetchTeams();
  }, [currentTeam]);

  const handleTrade = async () => {
    if (!selectedTeam) return;

    setIsTrading(true);
    try {
      const response = await fetch('http://localhost:3001/api/trade-pick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromTeam: currentTeam,
          toTeam: selectedTeam,
          round: pick.round,
          originalOwner: pick.originalOwner
        }),
      });

      const data = await response.json();
      if (data.success) {
        onTrade();
      } else {
        alert('Trade failed: ' + data.error);
      }
    } catch (err) {
      console.error('Error trading pick:', err);
      alert('Trade failed');
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="trade-modal">
        <h3>Trade Round {pick.round} Pick</h3>
        <p>Original Owner Team ID: {pick.originalOwner}</p>
        
        <div className="form-group">
          <label htmlFor="team-select">Trade to:</label>
          <select 
            id="team-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            {teams.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="modal-buttons">
          <button 
            onClick={handleTrade} 
            disabled={!selectedTeam || isTrading}
            className="trade-button"
          >
            {isTrading ? 'Trading...' : 'Trade Pick'}
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePickModal;