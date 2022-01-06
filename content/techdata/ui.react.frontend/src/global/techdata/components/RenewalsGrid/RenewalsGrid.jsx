import React, { useState, useMemo } from "react";
import {
  pageCalculator,
  maxCounterCalculator,
  minCounterCalculator,
} from "../../../../utils/paginationUtil";
import useGridFiltering from "../../hooks/useGridFiltering";
import GridRenewal from "../Grid/GridRenewal";
import RenewalFilter from "../RenewalFilter/RenewalFilter";
import VerticalSeparator from "../Widgets/VerticalSeparator";
import DropdownFilter from "./DropdownFilter";
import { RENEWALS } from "./FilterOptions";
import { getColumnDefinitions } from "./GenericColumnTypes";

function RenewalsGrid(props) {
  const [paginationData, setPaginationData] = useState({
    totalCounter: 0,
    stepBy: 25,
    currentPage: 1,
    currentResultsInPage: 0,
  });
  const {onAfterGridInit, onQueryChanged, requestInterceptor} = useGridFiltering();
  const { totalCounter, stepBy, currentPage, currentResultsInPage } = paginationData; 
  const componentProp = JSON.parse(props.componentProp);
  const options = {
    defaultSortingColumnKey: "dueDate",
    defaultSortingDirection: "asc",
  };

  const columnDefs = getColumnDefinitions(componentProp.columnList);

  const onRowFilter = () => {
    console.log("this is where the filtering logic goes");
  };

  const totalPaginationCounter = useMemo(
    () => pageCalculator(totalCounter, stepBy),
    [totalCounter]
  );

  const minPaginationCounter = useMemo(
    () => minCounterCalculator(stepBy, currentPage),
    [currentPage]
  );

  const maxPaginationCounter = useMemo(
    () => maxCounterCalculator(minPaginationCounter, totalCounter, stepBy, currentResultsInPage),
    [minPaginationCounter, totalCounter, currentResultsInPage]
  );

  const incrementHandler = () => {
    setPaginationData((prevSt) => {
      return {
        ...prevSt,
        currentPage: (prevSt.currentPage += 1),
      };
    });
  };

  const decrementHandler = () => {
    setPaginationData((prevSt) => {
      return {
        ...prevSt,
        currentPage: (prevSt.currentPage -= 1),
      };
    });
  };

  const gridConfig = {
    ...componentProp,
    paginationStyle: "none",
  };

  return (
    <section>
      <div className="cmp-renewals-subheader">
        <div className="navigation">
          <p>
            {minPaginationCounter}-{maxPaginationCounter} of {totalCounter}{" "}
            results
          </p>
          <p>
            <button disabled={currentPage === 1} onClick={decrementHandler}>
              <i className="fas fa-chevron-left"></i>
            </button>
            {currentPage} of {totalPaginationCounter}{" "}
            <button
              disabled={currentPage === totalPaginationCounter}
              onClick={incrementHandler}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </p>
        </div>
        <div className="renewal-filters">
          <div className="cmp-renewal-search">
            <DropdownFilter callback={onRowFilter} options={RENEWALS} />
          </div>
          <VerticalSeparator />
          <div className="cmp-renewal-filter">
            <RenewalFilter aemData={componentProp} onQueryChanged={onQueryChanged} />
          </div>
        </div>
      </div>

      <div className="cmp-renewals-grid">
        <GridRenewal
          getPaginationData={setPaginationData}         
          columnDefinition={columnDefs}
          options={options}
          config={gridConfig}
          onAfterGridInit={onAfterGridInit}
          requestInterceptor={requestInterceptor}
        />
      </div>
    </section>
  );
}

export default RenewalsGrid;
