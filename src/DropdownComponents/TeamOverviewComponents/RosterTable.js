import React from 'react';

const RosterTable = ({ teamRoster }) => (
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
);

export default RosterTable;