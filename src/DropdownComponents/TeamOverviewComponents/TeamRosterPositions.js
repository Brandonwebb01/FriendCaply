import React from 'react';
//import { Droppable, Draggable } from 'react-beautiful-dnd';

const TeamRosterPositions = ({ 
  rosterPositions, 
  teamRoster, 
  renderPositionColumn, 
  formatSalary 
}) => (
  <div className="middle-column">
    <h2>Team Roster Positions</h2>
    <div className="positions-container">
      <div className="position-section forwards">
        <h3>Forwards</h3>
        <div className="position-columns">
          {['LW', 'C', 'RW'].map(pos => renderPositionColumn(pos))}
        </div>
      </div>
      <div className="position-section defensemen">
        <h3>Defensemen</h3>
        <div className="position-columns">
          {['LD', 'RD'].map(pos => renderPositionColumn(pos))}
        </div>
      </div>
      <div className="position-section goalies">
        <h3>Goalies</h3>
        <div className="position-columns">
          {['G'].map(pos => renderPositionColumn(pos))}
        </div>
      </div>
    </div>
  </div>
);

export default TeamRosterPositions;