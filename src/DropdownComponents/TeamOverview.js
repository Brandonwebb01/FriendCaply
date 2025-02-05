import React, { useState, useEffect } from 'react';
import { TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5, TbNumber6, TbNumber7 } from 'react-icons/tb';
import './TeamOverview.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TeamOverview = ({ team }) => {
  const { team_id, team_name } = team;
  const [teamRoster, setTeamRoster] = useState([]);
  const [freeAgents, setFreeAgents] = useState([]);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [contractOffer, setContractOffer] = useState({ salary: '', years: '' });
  const [rosterPositions, setRosterPositions] = useState({
    LW: [], C: [], RW: [],
    LD: [], RD: [],
    G: []
  });
  const [teamPicks, setTeamPicks] = useState([]);
  const [showRoster, setShowRoster] = useState(true);

  const [buyoutPlayers, setBuyoutPlayers] = useState([]);
  const [showBuyoutPopup, setShowBuyoutPopup] = useState(false);
  const [currentBuyoutPlayer, setCurrentBuyoutPlayer] = useState(null);
  const [buyoutDetails, setBuyoutDetails] = useState({ retainAmount: 0, years: 0 });

  const formatSalary = (salary) => {
    return salary ? `$${salary.toLocaleString()}` : 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team roster
        const rosterResponse = await fetch(`http://localhost:3001/api/team-roster/${team_id}`);
        const rosterData = await rosterResponse.json();
        setTeamRoster(rosterData);
        initializeRosterPositions(rosterData);
  
        // Fetch free agents
        const freeAgencyResponse = await fetch('http://localhost:3001/api/free-agents');
        const freeAgencyData = await freeAgencyResponse.json();
        setFreeAgents(freeAgencyData);

        // Fetch team picks
        const picksResponse = await fetch(`http://localhost:3001/api/team-picks/${team_id}`);
        const picksData = await picksResponse.json();
        console.log('Received picks data:', picksData); // Debug log
        setTeamPicks(picksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [team_id]);

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

  // Create a helper function to render pick icons
// Helper function to render pick icons
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

  const BuyoutPopup = ({ player, buyoutDetails, onConfirm, onCancel }) => (
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
          <button onClick={onConfirm}>Confirm Buyout</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const confirmBuyout = () => {
    // Update buyout players
    setBuyoutPlayers(prev => [...prev, {
      ...currentBuyoutPlayer,
      buyoutAmount: buyoutDetails.retainAmount,
      buyoutYears: buyoutDetails.years
    }]);
  
    // Remove player from roster
    setTeamRoster(prev => prev.filter(p => p.player_id !== currentBuyoutPlayer.player_id));
  
    // Update salary cap (you'll need to implement this calculation)
    updateSalaryCap(buyoutDetails.retainAmount);
  
    // Close popup and reset state
    setShowBuyoutPopup(false);
    setCurrentBuyoutPlayer(null);
    setBuyoutDetails({ retainAmount: 0, years: 0 });
  };
  
  const updateSalaryCap = (buyoutAmount) => {
    // Implement your salary cap update logic here
  };

  const undoBuyout = (playerId) => {
    const playerToRestore = buyoutPlayers.find(p => p.player_id === playerId);
    
    // Remove from buyout list
    setBuyoutPlayers(prev => prev.filter(p => p.player_id !== playerId));
    
    // Add back to roster
    setTeamRoster(prev => [...prev, playerToRestore]);
    
    // Update salary cap
    updateSalaryCap(-playerToRestore.buyoutAmount);
  };

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

  const SalaryInfo = ({ teamRoster }) => {
    const salaryCap = 88000000;
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

  const FreeAgencyList = ({ freeAgents, onSignPlayer }) => (
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
  
  const SignPlayerModal = ({ player, onClose, onConfirm, contractOffer, setContractOffer }) => (
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
          <button onClick={onConfirm}>Sign Player</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
  <div className="team-overview">
    <h1 className="team-title">{team_name} Overview</h1>

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
          <div className="roster-list">
            <h2>Team Roster</h2>
            {teamRoster.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {teamRoster.map((player, index) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="roster-placeholder">
                Roster coming soon! 🏒
              </div>
            )}
          </div>
        ) : (
          <FreeAgencyList 
            freeAgents={freeAgents} 
            onSignPlayer={(player) => {
              setSelectedPlayer(player);
              setShowSignModal(true);
            }} 
          />
        )}
      </div>

      {/* Middle Column: Roster Positions */}
        <div className="middle-column">
          <h2>Team Roster Positions</h2>
          <div className="positions-container">
            <div className="position-section forwards">
              <h3>Forwards</h3>
              <div className="position-columns">
                {['LW', 'C', 'RW'].map(renderPositionColumn)}
              </div>
            </div>
            <div className="position-section defensemen">
              <h3>Defensemen</h3>
              <div className="position-columns">
                {['LD', 'RD'].map(renderPositionColumn)}
              </div>
            </div>
            <div className="position-section goalies">
              <h3>Goalies</h3>
              <div className="position-columns">
                {['G'].map(renderPositionColumn)}
              </div>
            </div>
          </div>
        </div>

      {/* Right Column: Additional Sections */}
      <div className="right-column">
        <div className="section salary-cap">
          <SalaryInfo teamRoster={teamRoster} />
        </div>
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
        {showBuyoutPopup && (
        <BuyoutPopup 
          player={currentBuyoutPlayer}
          buyoutDetails={buyoutDetails}
          onConfirm={confirmBuyout}
          onCancel={() => setShowBuyoutPopup(false)}
        />
      )}

      {/* In the buyout section */}
      <div className="buyout-players">
        {buyoutPlayers.map(player => (
          <div key={player.player_id} className="buyout-player">
            <span>{player.name}</span>
            <span>${player.buyoutAmount}</span>
            <button onClick={() => undoBuyout(player.player_id)}>Undo</button>
          </div>
        ))}
      </div>
        <div className="section buyout-retain">
      <h3>Buyout</h3>      
      <Droppable droppableId="buyout">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="buyout-area"
          >
            {/* Buyout players will be listed here */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
    <div className="trade-section">
      <h3>Trade</h3>
      {/* Add trade functionality here */}
    </div>
      </div>
    </div>

    {showSignModal && (
      <SignPlayerModal
        player={selectedPlayer}
        onClose={() => {
          setShowSignModal(false);
          setSelectedPlayer(null);
          setContractOffer({ salary: '', years: '' });
        }}
        onConfirm={() => {
          // Logic to sign the player
          const updatedPlayer = {
            ...selectedPlayer,
            team_id: team_id,
            salary: parseInt(contractOffer.salary),
            contract_years: parseInt(contractOffer.years)
          };
          setTeamRoster(prevRoster => [...prevRoster, updatedPlayer]);
          setFreeAgents(prevFreeAgents => prevFreeAgents.filter(p => p.player_id !== selectedPlayer.player_id));
          setRosterPositions(prevPositions => ({
            ...prevPositions,
            [selectedPlayer.position]: [...prevPositions[selectedPlayer.position], selectedPlayer.player_id]
          }));
          setShowSignModal(false);
          setSelectedPlayer(null);
          setContractOffer({ salary: '', years: '' });
        }}
        contractOffer={contractOffer}
        setContractOffer={setContractOffer}
      />
    )}
  </div>
  </DragDropContext>
);
};

export default TeamOverview;