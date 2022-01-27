export const pageCalculator = (totalItems, step) =>
  parseInt(Math.floor(totalItems / step), 10);

export const maxCounterCalculator = (currentResultsInPage, getCurrentPage) => {
  return (currentResultsInPage * getCurrentPage)
};

export const minCounterCalculator = (getCurrentPage, currentResultsInPage) => {
  return getCurrentPage === 1 ? getCurrentPage : ((currentResultsInPage * (getCurrentPage - 1)) +1)
};
