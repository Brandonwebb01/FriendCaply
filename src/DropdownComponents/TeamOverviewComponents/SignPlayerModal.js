import React, { useState } from 'react';

const SignPlayerModal = ({ player, teamId, onClose }) => {
    const [contractOffer, setContractOffer] = useState({ salary: '', years: '' });

  const handleSignPlayer = async () => {
    try {
      const updatedPlayer = {
        ...player,
        team_id: teamId,
        salary: parseInt(contractOffer.salary),
        contract_years: parseInt(contractOffer.years)
      };

      // API call to sign player
      const response = await fetch('http://localhost:3001/api/sign-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlayer),
      });

      if (!response.ok) throw new Error('Failed to sign player');

      onClose(); // Close modal after successful signing
    } catch (error) {
      console.error('Error signing player:', error);
    }
  };

  return (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Sign {player.name}</h2>
      <div className="form-group">
        <label>Salary:</label>
        <input
          type="number"
          value={contractOffer.salary}
          onChange={(e) => setContractOffer({ ...contractOffer, salary: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Years:</label>
        <input
          type="number"
          value={contractOffer.years}
          onChange={(e) => setContractOffer({ ...contractOffer, years: e.target.value })}
        />
      </div>
      <div className="modal-buttons">
        <button onClick={handleSignPlayer}>Sign Player</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  </div>
);
};

export default SignPlayerModal;