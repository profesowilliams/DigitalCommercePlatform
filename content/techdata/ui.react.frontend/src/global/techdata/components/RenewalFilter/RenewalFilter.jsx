import React, { useRef } from 'react';
import FilterModal from './FilterModal';
import Button from '../web-components/Button';
import Icon from '../web-components/Icon';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { pushEvent, ANALYTICS_TYPES } from '../../../../utils/dataLayerUtils';
import Count from './components/Count';
import { OptionsIcon } from '../../../../fluentIcons/FluentIcons';
import { getDictionaryValue } from '../../../../utils/utils';
import { useMultiFilterSelected } from './hooks/useFilteringState';

export default function RenewalFilter({ aemData, onQueryChanged }) {
  const isFilterModalOpen = useRenewalGridState(
    (state) => state.isFilterModalOpen
  );

  const {
    filterList,
    resetFilter,
    effects,
    _generateFilterFields,
  } = useMultiFilterSelected();

  const appliedFilterCount = useRenewalGridState(
    (state) => state.appliedFilterCount
  );
  const isFilterButtonDisable = useRenewalGridState(
    (state) => state.isFilterButtonDisable
  );
  const topReference = useRef();
  const analyticsCategory = useRenewalGridState((st) => st.analyticsCategory);

  const {
    setFilterList,
    clearDateFilters,
    toggleFilterModal,
    closeAndCleanToaster,
    clearUnappliedDateRange,
    setCustomState,
  } = effects;

  const handleFilterClick = () => {
    //pushEvent(ANALYTICS_TYPES.events.click, {
    //  type: ANALYTICS_TYPES.types.button,
    //  category: ANALYTICS_TYPES.category.renewalsTableInteraction,
    //  name: ANALYTICS_TYPES.name.filterIcon,
    //});
    toggleFilterModal();
    window.scrollTo(0, 0);
    closeAndCleanToaster();
  };

  const { setAppliedFilter } = useRenewalGridState((state) => state.effects);
  
  /**
   * Triggerred when the "show results" button is clicked on
   * Renewal filter.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    setAppliedFilter(optionFields);
    if (resetFilter) setCustomState({ key: 'resetFilter', value: false });
    onQueryChanged();
    clearUnappliedDateRange();
  };

  const handleClearFilter = () => {
    const filtersCopy = [...filterList].map((filter, index) => {
      if (index !== 0) {
        return { ...filter, open: false, checked: false };
      }
      return filter;
    });
    setFilterList(filtersCopy);
    clearDateFilters();

    showResult();
  };

  const handleFilterCloseClick = () => {
    toggleFilterModal({ justClose: true });
  };

  return (
    <div className="cmp-renewal-filter">
      <div
        className={
          isFilterButtonDisable
            ? 'cmp-renewals-filter-container disabled'
            : 'cmp-renewals-filter-container'
        }
      >
        <Button
          id="renewals-filter-button"
          type="button"
          theme="light"
          variant="link"
          color="teal"
          onClick={handleFilterClick}
        >
          <Icon name="options" state="default" />
          {getDictionaryValue('grids.common.label.filter', 'Filter')}
        </Button>
        {appliedFilterCount !== 0 && (
          <Count>
            <span className="filter-count">{appliedFilterCount} </span>
            <span className="filter-close" onClick={handleClearFilter}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2.58859 2.71569L2.64645 2.64645C2.82001 2.47288 3.08944 2.4536 3.28431 2.58859L3.35355 2.64645L8 7.293L12.6464 2.64645C12.8417 2.45118 13.1583 2.45118 13.3536 2.64645C13.5488 2.84171 13.5488 3.15829 13.3536 3.35355L8.707 8L13.3536 12.6464C13.5271 12.82 13.5464 13.0894 13.4114 13.2843L13.3536 13.3536C13.18 13.5271 12.9106 13.5464 12.7157 13.4114L12.6464 13.3536L8 8.707L3.35355 13.3536C3.15829 13.5488 2.84171 13.5488 2.64645 13.3536C2.45118 13.1583 2.45118 12.8417 2.64645 12.6464L7.293 8L2.64645 3.35355C2.47288 3.17999 2.4536 2.91056 2.58859 2.71569L2.64645 2.64645L2.58859 2.71569Z"
                  fill="white"
                />
              </svg>
            </span>
          </Count>
        )}
      </div>
      {isFilterModalOpen && (
        <FilterModal
          aemData={aemData}
          handleFilterCloseClick={handleFilterCloseClick}
          onQueryChanged={onQueryChanged}
          topReference={topReference}
          analyticsCategory={analyticsCategory}
        />
      )}
    </div>
  );
}
