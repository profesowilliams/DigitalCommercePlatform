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
      <Button btnClass="btn-temporary" onClick={handleFilterClick}>
        Filter
      </Button>
      {showModal && (
        <FilterModal
          aemData={aemData}
          handleFilterCloseClick={handleFilterCloseClick}
        />
      )}
    </div>
  );
}
