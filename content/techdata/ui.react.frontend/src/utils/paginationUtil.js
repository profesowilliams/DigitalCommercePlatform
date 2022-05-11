export const pageCalculator = (totalItems, step) =>
  parseInt(Math.floor(totalItems / step), 10);

export const maxCounterCalculator = (currentResultsInPage, getCurrentPage) => {
  return  (currentResultsInPage * getCurrentPage)
};

export const minCounterCalculator = (currentResultsInPage, getCurrentPage) => {
  /**
   * Since currentResultsInPage is nothing but "ItemsPerPage" configured in AEM, it'll
   * always be 25 or some positive number. This can result in negative number when
   * getCurrentPage is 0. So when getCurrentPage is 0, simply return 0.
   *
   * Improvements pending:
   * 1. Hide pagination when there are 0 results.
   * 2. Rename "currentResultsInPage" to "ItemsPerPage" or something less confusing.
   */
  if (getCurrentPage === 0) return 0;

  return getCurrentPage === 1 ? getCurrentPage : ((currentResultsInPage * (getCurrentPage - 1)) +1)
};
