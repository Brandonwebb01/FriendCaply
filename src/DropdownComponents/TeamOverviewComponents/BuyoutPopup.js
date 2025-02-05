import React, { useState, useEffect } from 'react';
//import './BuyoutPopup.css';

const BuyoutPopup = ({ player, onClose }) => {
  const [buyoutDetails, setBuyoutDetails] = useState({ retainAmount: 0, years: 0 });

  useEffect(() => {
    if (player) {
      const yearsLeft = player.years;
      const retainFraction = player.age < 26 ? 1/3 : 2/3;
      const retainAmount = Math.round(player.salary * retainFraction);
      const buyoutYears = yearsLeft * 2;

      setBuyoutDetails({
        retainAmount,
        years: buyoutYears
      });
    }
  }, [player]);

  const handleConfirmBuyout = async () => {
    try {
      // API call to process buyout
      const response = await fetch('http://localhost:3001/api/buyout-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: player.player_id,
          ...buyoutDetails
        }),
      });

      if (!response.ok) throw new Error('Failed to process buyout');

      onClose(); // Close popup after successful buyout
    } catch (error) {
      console.error('Error processing buyout:', error);
    }
  };

  return (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Buyout {player.name}</h2>
      <p>
        {player.age < 26 
          ? `Retain (1/3rd of the contract amount: $${buyoutDetails.retainAmount}) over (${buyoutDetails.years} years)?`
          : `Retain (2/3rds of contract amount: $${buyoutDetails.retainAmount}) over (${buyoutDetails.years} years)?`
        }
      </p>
      <div className="modal-buttons">
        <button onClick={handleConfirmBuyout}>Confirm Buyout</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  </div>
);
};

export default BuyoutPopup;