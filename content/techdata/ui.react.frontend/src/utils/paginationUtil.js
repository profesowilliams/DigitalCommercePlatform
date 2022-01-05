export const pageCalculator = (totalItems, step) =>
  parseInt(Math.floor(totalItems / step), 10);

export const maxCounterCalculator = (minCounter, totalCount, step, resultsInPage) => {
  const maxCounter = (minCounter += step);
  return totalCount > maxCounter ? minCounter : resultsInPage;
};

export const minCounterCalculator = (step, currentPage) => {
  return currentPage === 1 ? currentPage : step * currentPage
};
