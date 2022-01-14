import React, { useMemo, useState } from "react";
import {   maxCounterCalculator,
    minCounterCalculator, pageCalculator } from "../../../../utils/paginationUtil";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination() {
  const paginationData = useRenewalGridState(state => state.pagination);
  const setPaginationData = useRenewalGridState(state => state.effects.setPagination);

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
        setPaginationData({
            ...paginationData,
            currentPage: (paginationData.currentPage += 1),
        }
        );
    };

  const decrementHandler = () => {
    setPaginationData({
        ...paginationData,
        currentPage: (paginationData.currentPage -= 1),
      }
    );
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
