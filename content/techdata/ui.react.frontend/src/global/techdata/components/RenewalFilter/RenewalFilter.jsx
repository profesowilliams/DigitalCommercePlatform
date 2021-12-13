import React, { useState } from "react";
import FilterModal from "./FilterModal";
import Button from "../Widgets/Button";

export default function RenewalFilter({ aemData }) {
  const [showModal, setShowModal] = useState(false);
  const handleFilterClick = () => {
    setShowModal(true);
  };

  const handleFilterCloseClick = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="cmp-renewals-filter-container">
      <Button btnClass="cmp-renewals-filter__button" onClick={handleFilterClick}>
        Filter
      </Button>
      <i class="fas fa-sliders-h"></i>
      </div>
      {showModal && (
        <FilterModal
          aemData={aemData}
          handleFilterCloseClick={handleFilterCloseClick}
        />
      )}
    </div>
  );
}
