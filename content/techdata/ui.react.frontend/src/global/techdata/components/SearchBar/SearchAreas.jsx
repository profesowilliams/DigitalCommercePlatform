import React, { useState } from "react";

const SearchAreas = ({
  areaList,
  selectedArea,
  changeSelectedArea,
  toggleSearchIcon,
  isMobile,
}) => {
  const [areaSelectionOpen, setAreaSelectionOpen] = useState(false);
  const [activeId, setActiveId] = useState();

  const toggleAreaSelection = () => {
    setAreaSelectionOpen(!areaSelectionOpen);
  };

  const onAreaClick = (areaConfiguration) => {
    toggleAreaSelection();

    changeSelectedArea(areaConfiguration);
  };

  const classSelectedAreaString = "cmp-searcharea__selectedarea  cmp-searcharea__selectedarea--checked";

  return (
    <>
      <div
        className={
          areaSelectionOpen === true
            ? isMobile == true ? 'cmp-searcharea__selectedarea--mobile' + classSelectedAreaString : classSelectedAreaString
            : "cmp-searcharea__selectedarea"
        }
      >
        <button
          className="cmp-searcharea__selectedarea-button"
          onClick={() => {
            toggleAreaSelection();
            toggleSearchIcon(areaSelectionOpen);
          }}
        >
          {" "}
          {selectedArea.areaLabel}
          <i className="cmp-searcharea__selectedarea-icon fas	fa-chevron-down"></i>
        </button>
      </div>
      <ul
        className={
          areaSelectionOpen === true || isMobile
            ? "cmp-searcharea cmp-searcharea--checked"
            : "cmp-searcharea"
        }
      >
        {areaSelectionOpen &&
          areaList.map((areaConfiguration, index) => {
            return (
              <li
                className={
                  activeId === areaConfiguration.area
                    ? "cmp-searcharea__area activeClass"
                    : "cmp-searcharea__area"
                }
                key={areaConfiguration.area}
                onClick={() => setActiveId(areaConfiguration.area)}
              >
                <button
                  className="cmp-searcharea__button"
                  onClick={() => onAreaClick(areaConfiguration)}
                >
                  {areaConfiguration.areaLabel}
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default SearchAreas;
