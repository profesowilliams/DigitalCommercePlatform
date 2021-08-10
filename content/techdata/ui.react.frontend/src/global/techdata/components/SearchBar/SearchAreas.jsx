import React, { useState } from 'react';

const SearchAreas = ({ areaList, selectedArea, changeSelectedArea, toggleSearchIcon }) => {
  const [areaSelectionOpen, setAreaSelectionOpen] = useState(false);

  const toggleAreaSelection = () => {
      setAreaSelectionOpen(!areaSelectionOpen);
    }

  const onAreaClick = (areaConfiguration) => {
    toggleAreaSelection();

    changeSelectedArea(areaConfiguration);
  }

  return (
    <>
    <div className={areaSelectionOpen === true ? 
      "cmp-searcharea__selectedarea  cmp-searcharea__selectedarea--checked" : 
      "cmp-searcharea__selectedarea"}>
      <button
        className="cmp-searcharea__selectedarea-button"
        onClick={() => { toggleAreaSelection();
          toggleSearchIcon(areaSelectionOpen)
        }}>
        {' '}{selectedArea.areaLabel}
        <i className="cmp-searcharea__selectedarea-icon fas	fa-chevron-down"></i>
      </button>
    </div>
      <ul className={areaSelectionOpen === true ? "cmp-searcharea cmp-searcharea--checked" : "cmp-searcharea"}>
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
    </>
  );
}

export default SearchAreas;
