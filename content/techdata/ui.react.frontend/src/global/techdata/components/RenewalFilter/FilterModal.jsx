import React, { useEffect, useState, useRef } from 'react';
import { FILTER_LOCAL_STORAGE_KEY } from '../../../../utils/constants';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import FilterList from './components/FilterList';
import FilterTags from './components/FilterTags';
import useComputeBranding from '../../hooks/useComputeBranding';
import normaliseAPIData from './filterUtils/normaliseAPIData';
import normaliseState from './filterUtils/normaliseData';
import { useMultiFilterSelected } from './hooks/useFilteringState';
import useFilteringSelected from './hooks/useIsFilteringSelected';

import Flyout, {
  FlyoutHeader,
  FlyoutTitle,
  FlyoutBody,
  FlyoutFooter,
  FlyoutButton,
} from '../web-components/Flyout';

import { RenewalErrorBoundary } from './renewalErrorBoundary';
import { getDictionaryValue } from '../../../../utils/utils';
import { getLocalValueOrDefault } from '../BaseGrid/store/GridStore';
import { getFilterAnalytics } from '../Analytics/analytics';

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({
  aemData,
  handleFilterCloseClick,
  onQueryChanged,
  topReference,
  analyticsCategory,
}) => {
  const {
    filterList,
    resetFilter,
    effects,
    filterData,
    _generateFilterFields,
  } = useMultiFilterSelected();

  const appliedFilterCount = useRenewalGridState(
    (state) => state.appliedFilterCount
  );
  const isFilterModalOpen = useRenewalGridState(
    (state) => state.isFilterModalOpen
  );

  useEffect(() => {
    const value = getLocalValueOrDefault(
      FILTER_LOCAL_STORAGE_KEY,
      'filterList',
      null
    );
    value && effects.setCustomState({ key: 'filterList', value });
  }, [resetFilter, filterData, appliedFilterCount, isFilterModalOpen]);

  const { computeClassName, isTDSynnex } =
    useComputeBranding(useRenewalGridState);

  const { setAppliedFilter } = useRenewalGridState((state) => state.effects);

  const { hasFilterChangeAvailable, dateSelected } = useFilteringSelected();

  const [DOMLoaded, setDOMLoaded] = useState(false);
  const customStartDate = useRenewalGridState((state) => state.customStartDate);
  const customEndDate = useRenewalGridState((state) => state.customEndDate);

  let aemFilterData;
  aemData.filterType =
    aemData.filterType === null ? 'static' : aemData.filterType;

  if (aemData.filterType === 'dynamic' && filterData?.refinements) {
    if (
      aemData.enableArchiveQuote &&
      !JSON.stringify(filterData.refinements).includes('archives')
    )
      filterData.refinements.push({
        name: getDictionaryValue(aemData.showArchive, 'Show archives only'),
        searchKey: 'Archives',
        childIds: [11],
      });
    aemFilterData = normaliseAPIData(filterData.refinements);
  } else if (aemData.filterType === 'static') {
    if (
      aemData.enableArchiveQuote &&
      !JSON.stringify(aemData.filterListValues).includes('archives')
    )
      aemData.filterListValues.push({
        name: getDictionaryValue(aemData.showArchive, 'Show archives only'),
        searchKey: 'archives',
        options: [
          {
            searchKey: 'archives',
            text: getDictionaryValue(aemData.showArchive, 'Show archives only'),
          },
        ],
      });
    aemFilterData = normaliseState(aemData.filterListValues);
  } else {
    aemFilterData = [];
  }

  const {
    setFilterList,
    clearDateFilters,
    toggleFilterModal,
    clearUnappliedDateRange,
    setCustomState,
    resetFilterToState,
  } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  useEffect(() => {
    const onPageLoad = () => setDOMLoaded(true);
    if (!document.querySelector('.subheader')) return;
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  const handleClearFilter = () => {
    const filtersCopy = [...filterList].map((filter, index) => {
      if (index !== 0) {
        return { ...filter, open: false, checked: false };
      }
      return filter;
    });
    setFilterList(filtersCopy);
    clearDateFilters();
  };

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];
  const filterDom = useRef();
  const filterBodyDom = useRef();

  const flyoutRef = useRef(null);

  // Function to toggle body scroll
  const toggleBodyScroll = (disable) => {
    document.body.style.overflow = disable ? 'hidden' : 'auto';
  };

  // Manage body scroll based on modal state
  useEffect(() => {
    if (isFilterModalOpen) {
      toggleBodyScroll(true);
    } else {
      toggleBodyScroll(false);
      if (flyoutRef.current && !flyoutRef.current.show) {
        toggleFilterModal({ justClose: true });
      }
    }

    return () => {
      toggleBodyScroll(false);
    };
  }, [isFilterModalOpen]);

  /**
   * Closes the import flyout.
   *
   * @function
   */
  const closeFlyout = () => {
    toggleFilterModal({ justClose: true }); // Explicitly set state
  };
  /**
   * Adds a listener to close the flyout gracefully when the event fires.
   * Cleans up the listener on component unmount.
   *
   * @function
   */
  useEffect(() => {
    const flyoutElement = flyoutRef.current;

    if (flyoutElement) {
      const handleFlyoutHidden = () => {
        toggleFilterModal({ justClose: true });
      };

      const handleFlyoutClose = (e) => {
        toggleFilterModal({ justClose: true });
      };

      flyoutElement.addEventListener('flyoutHidden', handleFlyoutHidden);
      flyoutElement.addEventListener('close', handleFlyoutClose);

      return () => {
        flyoutElement.removeEventListener('flyoutHidden', handleFlyoutHidden);
        flyoutElement.removeEventListener('close', handleFlyoutClose);
      };
    }
  }, [flyoutRef, toggleFilterModal]);

  useEffect(() => {
    if (flyoutRef.current) {
      if (isFilterModalOpen) {
        flyoutRef.current.setAttribute('show', 'true');
      } else {
        flyoutRef.current.removeAttribute('show');
      }
    }
  }, [isFilterModalOpen]);

  /**
   * Triggerred when the "show results" button is clicked on
   * Renewal filter.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    setAppliedFilter(optionFields);
    toggleFilterModal();
    if (resetFilter) setCustomState({ key: 'resetFilter', value: false });
    onQueryChanged();
    clearUnappliedDateRange();
  };

  const handleCloseModalClick = () => {
    resetFilterToState();
    handleFilterCloseClick();
  };

  if (!filterList) return null;

  return (
    DOMLoaded && (
      <>
        <Flyout
          ref={flyoutRef}
          {...(isFilterModalOpen ? { show: '' } : {})}
          size="sm"
          placement="end"
          id="filter-flyout"
          aria-labelledby="offcanvasLabel"
          scrollable
          backdrop="true"
          onClose={() => {
            closeFlyout();
          }}
        >
          <FlyoutHeader>
            <FlyoutTitle>
              {getDictionaryValue('grids.common.label.filterTitle', 'Filters')}
            </FlyoutTitle>
          </FlyoutHeader>

          <FlyoutBody>
            <RenewalErrorBoundary>
              <FilterDialog>
                <FilterList rootIds={rootIds} />
              </FilterDialog>

              <FilterTags />
            </RenewalErrorBoundary>
          </FlyoutBody>

          <FlyoutFooter>
            <FlyoutButton
              type="button"
              variant="tertiary"
              theme="light"
              onClick={handleClearFilter}
              color="teal"
              analyticsCallback={getFilterAnalytics.bind(
                null,
                analyticsCategory,
                _generateFilterFields()
              )}
            >
              {getDictionaryValue(
                'grids.common.label.clearAllFilters',
                'Clear all filters'
              )}
            </FlyoutButton>
            <FlyoutButton
              type="button"
              variant="primary"
              theme="light"
              label={getDictionaryValue(
                'grids.common.label.filterSearch',
                'Show results'
              )}
              color="teal"
              onClick={showResult}
              {...(!hasFilterChangeAvailable() ? { disabled: '' } : {})}
              analyticsCallback={getFilterAnalytics.bind(
                null,
                analyticsCategory,
                _generateFilterFields()
              )}
            >
              {getDictionaryValue(
                'grids.common.label.filterSearch',
                'Show results'
              )}
            </FlyoutButton>
          </FlyoutFooter>
        </Flyout>
      </>
    )
  );
};

export default FilterModal;
