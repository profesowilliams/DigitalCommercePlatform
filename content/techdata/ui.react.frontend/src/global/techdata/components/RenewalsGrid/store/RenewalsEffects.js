export const renewalsEffects = (set, get) => {
  function setFilterList(newFilterList = []) {
    set({ filterList: [...newFilterList] });
  }

  function toggleFilterModal(options = {}) {
    const { justClose = false } = options;
    const { isFilterModalOpen } = get();
    if (justClose) return set({ isFilterModalOpen: false });
    set({ isFilterModalOpen: !isFilterModalOpen });
  }

  function finalResults(filteredList = []) {
    set({finalResults:filteredList})
  }

  return {
    setFilterList,
    toggleFilterModal,
    finalResults,
  };
};
