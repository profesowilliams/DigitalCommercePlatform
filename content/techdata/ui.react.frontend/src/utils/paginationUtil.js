export const pageCalculator = (totalItems, step) =>
  parseInt(Math.floor(totalItems / step), 10);

export const maxCounterCalculator = (minCounter, totalCount, step) => {
  const maxCounter = (minCounter += step);
  return totalCount > maxCounter ? minCounter : totalCount;
};

export const minCounterCalculator = (step, currentPage) => {
  return currentPage === 1 ? currentPage : step * currentPage
};
