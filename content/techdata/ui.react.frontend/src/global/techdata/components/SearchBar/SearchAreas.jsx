import React, { useState } from 'react';

const SearchAreas = ({ areaList, selectedArea, changeSelectedArea }) => {
  const [areaSelectionOpen, setAreaSelectionOpen] = useState(false);

  const toggleAreaSelection = () => {
    setAreaSelectionOpen(!areaSelectionOpen);
  }

  const onAreaClick = (areaConfiguration) => {
    toggleAreaSelection();

    changeSelectedArea(areaConfiguration);
  }

  return (
    <ul className="cmp-searcharea">
      <li className="cmp-searcharea__selectedarea">
        <button
          className="cmp-searcharea__selectedarea"
          onClick={toggleAreaSelection}>
          {selectedArea.areaLabel}
        </button>
      </li>
      {areaSelectionOpen && areaList.map((areaConfiguration, index) => {
        return (
          <li className="cmp-searcharea__area" key={areaConfiguration.area} key={index}>
            <button className="cmp-searcharea__button" onClick={() => onAreaClick(areaConfiguration)}>
              {areaConfiguration.areaLabel}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchAreas;
