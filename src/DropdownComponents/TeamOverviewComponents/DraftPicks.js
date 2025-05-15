import React, { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import TradePickModal from './TradePickModal'; // Add this import
import './DraftPicks.css';

const DraftPicks = ({ teamId }) => {
  const [teamPicks, setTeamPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedPick, setSelectedPick] = useState(null);

  useEffect(() => {
    const fetchTeamPicks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/team-picks/${teamId}`);
        const data = await response.json();
        
        console.log('Fetched picks data:', data);
        
        // data now contains array of team IDs that own each pick, or null if no pick
        const formattedPicks = Array.isArray(data) ? data : [null, null, null, null, null, null, null];
        setTeamPicks(formattedPicks);
      } catch (err) {
        console.error('Error fetching team picks:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamPicks();
  }, [teamId]);

  const handlePickClick = (round, originalOwner) => {
    if (originalOwner) {
      setSelectedPick({ round: round + 1, originalOwner });
      setShowTradeModal(true);
    }
  };

  const getPickLabel = (round, originalOwner) => {
    if (!originalOwner) return `${round}`;
    if (originalOwner === parseInt(teamId)) return `${round}`;
    return `${round}*`; // Asterisk indicates it's another team's pick
  };

  if (isLoading) return <div>Loading picks...</div>;
  if (error) return <div>Error loading picks: {error}</div>;

  return (
    <div className="section picks">
      <h3>Draft Picks</h3>
      <div className="picks-content">
        {[1, 2, 3, 4, 5, 6, 7].map((number, index) => (
          <div key={number} className="pick-item">
            {teamPicks[index] ? (
              <div 
                className="pick-with-logo"
                onClick={() => handlePickClick(index, teamPicks[index])}
              >
                <span className="pick-number">
                  {getPickLabel(number, teamPicks[index])}
                </span>
                <TeamLogo 
                  teamId={teamPicks[index]} 
                  className="pick-logo" 
                  alt={`Round ${number} pick`}
                />
                {teamPicks[index] !== parseInt(teamId) && (
                  <span className="traded-pick-indicator">Traded</span>
                )}
              </div>
            ) : (
              <div className="pick-empty">
                <span className="pick-number">{number}</span>
                <div className="empty-pick-placeholder" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showTradeModal && (
        <TradePickModal
          pick={selectedPick}
          currentTeam={teamId}
          onClose={() => setShowTradeModal(false)}
          onTrade={() => {
            setShowTradeModal(false);
            // Refresh picks after trade
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default DraftPicks;