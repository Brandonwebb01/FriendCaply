import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TeamOverview.css';
import RosterTable from './TeamOverviewComponents/RosterTable'
import FreeAgencyList from './TeamOverviewComponents/FreeAgencyList';
import TeamRosterPositions from './TeamOverviewComponents/TeamRosterPositions';
import SalaryInfo from './TeamOverviewComponents/SalaryInfo';
import DraftPicks from './TeamOverviewComponents/DraftPicks';
import BuyoutSection from './TeamOverviewComponents/BuyoutSection';
import SignPlayerModal from './TeamOverviewComponents/SignPlayerModal';
import BuyoutPopup from './TeamOverviewComponents/BuyoutPopup';
import TeamLogo from './TeamOverviewComponents/TeamLogo';

const TeamOverview = ({ team }) => {
  const { team_id, team_name } = team;
  const [teamRoster, setTeamRoster] = useState([]);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showRoster, setShowRoster] = useState(true);
  const [rosterPositions, setRosterPositions] = useState({
    LW: [], C: [], RW: [],
    LD: [], RD: [],
    G: []
  });
  const [buyoutPlayers, setBuyoutPlayers] = useState([]);
  const [showBuyoutPopup, setShowBuyoutPopup] = useState(false);
  const [currentBuyoutPlayer, setCurrentBuyoutPlayer] = useState(null);
  const [buyoutDetails, setBuyoutDetails] = useState({ retainAmount: 0, years: 0 });

  useEffect(() => {
    const fetchTeamRoster = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/team-roster/${team_id}`);
        const data = await response.json();
        setTeamRoster(data);
        initializeRosterPositions(data);
      } catch (error) {
        console.error('Error fetching team roster:', error);
      }
    };

    fetchTeamRoster();
  }, [team_id]);

  const renderPositionColumn = (position) => (
    <Droppable droppableId={position} key={position}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="player-list"
        >
          {rosterPositions[position].map((playerId, index) => (
            <Draggable 
              key={playerId} 
              draggableId={playerId.toString()} 
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`player-slot ${snapshot.isDragging ? 'dragging' : ''}`}
                >
                  <div className="player-info">
                    {renderPlayerContent(playerId)}
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
  
  const renderPlayerContent = (playerId) => {
    const player = teamRoster.find(p => p.player_id === playerId);
    if (!player) return <div className="player-placeholder">▢</div>;
    
    return (
      <>
        <div className="player-name">{player.name}</div>
        <div className="player-details">
          <span>{player.handed}</span> | 
          <span>{formatSalary(player.salary)}</span>
        </div>
      </>
    );
  };

  const TeamTitleWithLogo = ({ teamName, teamId }) => {
  return (
    <div className="team-title-container">
      <TeamLogo 
        teamId={teamId} 
        className="team-title-background-logo"
        style={{ 
          position: 'absolute',
          width: '200px',
          height: '200px',
          opacity: 0.1,
          zIndex: 0
        }}
      />
      <h1 className="team-title">{teamName} Overview</h1>
    </div>
  );
};

  const formatSalary = (salary) => {
    return salary ? `$${salary.toLocaleString()}` : 'N/A';
  };

  const initializeRosterPositions = (rosterData) => {
    const newRosterPositions = {
      LW: [], C: [], RW: [],
      LD: [], RD: [],
      G: []
    };

    rosterData.forEach(player => {
      if (newRosterPositions[player.position]) {
        newRosterPositions[player.position].push(player.player_id);
      }
    });

    setRosterPositions(newRosterPositions);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourcePosition = source.droppableId;
    const destPosition = destination.droppableId;

    if (destPosition === 'buyout') {
      const player = teamRoster.find(p => p.player_id.toString() === result.draggableId);
      if (player) {
        handleBuyoutDrop(player);
      }
      return;
    }

    const newRosterPositions = { ...rosterPositions };

    // Remove from the source position
    const [playerId] = newRosterPositions[sourcePosition].splice(source.index, 1);

    // Add to the destination position
    newRosterPositions[destPosition].splice(destination.index, 0, playerId);

    setRosterPositions(newRosterPositions);

    // Update the player's position in the teamRoster array
    setTeamRoster(prevRoster => 
      prevRoster.map(player => 
        player.player_id === playerId 
          ? { ...player, position: destPosition } 
          : player
      )
    );
  };

  const handleBuyoutDrop = (player) => {
    setCurrentBuyoutPlayer(player);
    
    const yearsLeft = player.years; // Assuming this exists in player data
    const retainFraction = player.age < 26 ? 1/3 : 2/3;
    const retainAmount = Math.round(player.salary * retainFraction);
    const buyoutYears = yearsLeft * 2;
  
    setBuyoutDetails({
      retainAmount,
      years: buyoutYears
    });
  
    setShowBuyoutPopup(true);
  };

  const confirmBuyout = () => {
    // Update buyout players
    setBuyoutPlayers(prev => [...prev, {
      ...currentBuyoutPlayer,
      buyoutAmount: buyoutDetails.retainAmount,
      buyoutYears: buyoutDetails.years
    }]);
  
    // Remove player from roster
    setTeamRoster(prev => prev.filter(p => p.player_id !== currentBuyoutPlayer.player_id));
  
    // Close popup and reset state
    setShowBuyoutPopup(false);
    setCurrentBuyoutPlayer(null);
    setBuyoutDetails({ retainAmount: 0, years: 0 });
  };

  const undoBuyout = (playerId) => {
    const playerToRestore = buyoutPlayers.find(p => p.player_id === playerId);
    
    // Remove from buyout list
    setBuyoutPlayers(prev => prev.filter(p => p.player_id !== playerId));
    
    // Add back to roster
    setTeamRoster(prev => [...prev, playerToRestore]);
  };

  const handleSignPlayer = (player) => {
    setSelectedPlayer(player);
    setShowSignModal(true);
  };

  const confirmSignPlayer = (signedPlayer) => {
    setTeamRoster(prevRoster => [...prevRoster, signedPlayer]);
    setRosterPositions(prevPositions => ({
      ...prevPositions,
      [signedPlayer.position]: [...prevPositions[signedPlayer.position], signedPlayer.player_id]
    }));
    setShowSignModal(false);
    setSelectedPlayer(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="team-overview">
        <TeamTitleWithLogo teamName={team_name} teamId={team_id} />

        <div className="main-content">
          {/* Left Column: Roster / Free Agency */}
          <div className="left-column">
            <div className="toggle-container">
              <button 
                className={`toggle-button ${showRoster ? 'active' : ''}`} 
                onClick={() => setShowRoster(true)}
              >
                Roster
              </button>
              <button 
                className={`toggle-button ${!showRoster ? 'active' : ''}`} 
                onClick={() => setShowRoster(false)}
              >
                Free Agency
              </button>
            </div>

            {showRoster ? (
              <RosterTable teamRoster={teamRoster} />
            ) : (
              <FreeAgencyList 
                teamId={team_id} 
                onSignPlayer={handleSignPlayer} 
              />
            )}
          </div>

          {/* Middle Column: Roster Positions */}
          <TeamRosterPositions 
          rosterPositions={rosterPositions}
          teamRoster={teamRoster}
          renderPositionColumn={renderPositionColumn}
          renderPlayerContent={renderPlayerContent}
        />

          {/* Right Column: Additional Sections */}
          <div className="right-column">
            <SalaryInfo teamId={team_id} />
            <DraftPicks teamId={team_id} />
            <BuyoutSection 
              buyoutPlayers={buyoutPlayers}
              undoBuyout={undoBuyout}
            />
            <div className="trade-section">
              <h3>Trade</h3>
              {/* Add trade functionality here */}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showSignModal && (
          <SignPlayerModal
            player={selectedPlayer}
            onClose={() => setShowSignModal(false)}
            onConfirm={confirmSignPlayer}
          />
        )}

        {showBuyoutPopup && (
          <BuyoutPopup 
            player={currentBuyoutPlayer}
            buyoutDetails={buyoutDetails}
            onConfirm={confirmBuyout}
            onCancel={() => setShowBuyoutPopup(false)}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default TeamOverview;