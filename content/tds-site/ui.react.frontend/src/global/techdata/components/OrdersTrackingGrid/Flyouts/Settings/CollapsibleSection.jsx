import React, { useState } from 'react';

const CollapsibleSection = ({ title, content, expanded }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleSectionClick = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="collapsible-section">
      <h3
        onClick={handleSectionClick}
        className={`${isExpanded ? 'active' : ''}`}
      >
        {title}
      </h3>
      {isExpanded ? content : null}
    </div>
  );
};

export default CollapsibleSection;
