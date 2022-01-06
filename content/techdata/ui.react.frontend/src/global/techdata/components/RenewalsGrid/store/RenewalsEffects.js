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
    set({ finalResults: filteredList })
  }

  function closeAllSections() {
    const keepOpenList = ['date'];
    const keepOpened = ({ field }) => keepOpenList.includes(field);
    const filterList = get().filterList.map(filter => ({ ...filter, open: keepOpened(filter) }));
    set({ filterList })
  }

  function setDateOptionsList(itemIndex) {
    const { dateOptionsList } = get();
    const indexFound = dateOptionsList.findIndex((_, index) => index === itemIndex);
    if (indexFound !== -1) {
      const options = dateOptionsList.slice().map(item => ({ ...item, checked: false }));
      options[indexFound].checked = true;    
      const dateSelected = options[indexFound].field;
      set({ dateOptionsList: options, dateSelected })
    }
  }

  function setDatePickerState(fromDate, toDate){
    set({datePickerState:[fromDate, toDate]})
  }

  function clearDateFilters(){
    const {dateOptionsList} = get();
    const allOptionsFalse = dateOptionsList.slice().map(item => ({...item,checked:false}));
    set({datePickerState:null,dateOptionsList:allOptionsFalse})
  }

  return {
    setFilterList,
    toggleFilterModal,
    finalResults,
    closeAllSections,
    setDateOptionsList,
    setDatePickerState,
    clearDateFilters
  };
};
