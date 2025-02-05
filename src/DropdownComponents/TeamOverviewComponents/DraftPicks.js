import React, { useState, useEffect } from 'react';
import { TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5, TbNumber6, TbNumber7 } from 'react-icons/tb';

const DraftPicks = ({ teamId }) => {
  const [teamPicks, setTeamPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamPicks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/team-picks/${teamId}`);
        const data = await response.json();
        
        // Log the data to see its structure
        console.log('Fetched picks data:', data);
        
        // Ensure data is in the correct format
        const formattedPicks = Array.isArray(data) ? data : [0, 0, 0, 0, 0, 0, 0];
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

  const renderPickIcon = (number, isOwned) => {
    const IconComponent = {
      1: TbNumber1,
      2: TbNumber2,
      3: TbNumber3,
      4: TbNumber4,
      5: TbNumber5,
      6: TbNumber6,
      7: TbNumber7
    }[number];

    return (
      <div className={`pick-icon ${isOwned ? 'active' : 'inactive'}`}>
        <IconComponent />
      </div>
    );
  };

  if (isLoading) return <div>Loading picks...</div>;
  if (error) return <div>Error loading picks: {error}</div>;

  return (
    <div className="section picks">
      <h3>Draft Picks</h3>
      <div className="picks-content">
        {[1, 2, 3, 4, 5, 6, 7].map((number, index) => (
          <div key={number} className="pick-item">
            {renderPickIcon(number, teamPicks[index] === 1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftPicks;