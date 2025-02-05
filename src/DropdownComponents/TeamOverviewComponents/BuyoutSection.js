import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const BuyoutSection = ({ buyoutPlayers, undoBuyout }) => (
  <>
    <div className="section buyout-retain">
      <h3>Buyout</h3>      
      <Droppable droppableId="buyout">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="buyout-area"
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
    <div className="buyout-players">
      {buyoutPlayers.map(player => (
        <div key={player.player_id} className="buyout-player">
          <span>{player.name}</span>
          <span>${player.buyoutAmount}</span>
          <button onClick={() => undoBuyout(player.player_id)}>Undo</button>
        </div>
      ))}
    </div>
  </>
);

export default BuyoutSection;