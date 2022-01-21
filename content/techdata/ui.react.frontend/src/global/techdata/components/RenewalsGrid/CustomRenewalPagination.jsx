import React, { useMemo, useState } from "react";
import {   maxCounterCalculator,
    minCounterCalculator, pageCalculator } from "../../../../utils/paginationUtil";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination() {
  const paginationData = useRenewalGridState(state => state.pagination);
  const setPaginationData = useRenewalGridState(state => state.effects.setCustomState);

  const { totalCounter, stepBy, currentPage, currentResultsInPage } =
    paginationData;

  const totalPaginationCounter = useMemo(
    () => pageCalculator(totalCounter, stepBy),
    [totalCounter]
  );

  const minPaginationCounter = useMemo(
    () => minCounterCalculator(stepBy, currentPage),
    [currentPage]
  );

  const maxPaginationCounter = useMemo(
    () =>
      maxCounterCalculator(
        minPaginationCounter,
        totalCounter,
        stepBy,
        currentResultsInPage
      ),
    [minPaginationCounter, totalCounter, currentResultsInPage]
  );

    const incrementHandler = () => {
      const value = {
        ...paginationData,
        currentPage: (paginationData.currentPage += 1),
      }
        setPaginationData({key:'pagination',value});
    };

  const decrementHandler = () => {
    const value = {
      ...paginationData,
      currentPage: (paginationData.currentPage -= 1),
    }
    setPaginationData({key:'pagination',value});
  };

  return (
    <div className="navigation">
      <p>
        {minPaginationCounter}-{maxPaginationCounter} of {totalCounter} results
      </p>
      <p>
        <button disabled={currentPage === 1} onClick={decrementHandler}>
          <i className="fas fa-chevron-left"></i>
        </button>
        {currentPage} of {totalPaginationCounter}{" "}
        <button
          disabled={
            currentPage === totalPaginationCounter || !totalPaginationCounter
          }
          onClick={incrementHandler}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </p>
    </div>
  );
}

export default CustomRenewalPagination;
