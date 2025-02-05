import React, { useState } from 'react';
import './InteractiveDropdown.css'; // Import the CSS file

const InteractiveDropdown = ({ show }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const items = ['Armchair GM', 'Mock Draft Simulator', 'Trade Simulator'];

  return (
    show && (
      <div className="dropdown-menu">
        {items.map((item, index) => (
          <div
            key={index}
            className={`dropdown-item ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {item}
          </div>
        ))}
      </div>
    )
  );
};

export default InteractiveDropdown;