/**
 * FilterModal component for managing and displaying filters in a flyout.
 *
 * @module FilterModal
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FILTER_LOCAL_STORAGE_KEY } from '../../../../utils/constants';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import FilterList from './components/FilterList';
import FilterTags from './components/FilterTags';
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

/**
 * FilterDialog component for wrapping filter children elements.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} The FilterDialog component.
 */
const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

/**
 * Main FilterModal component for managing and rendering filters.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.aemData - Data for rendering filters.
 * @param {Function} props.onQueryChanged - Callback triggered on filter changes.
 * @param {string} props.analyticsCategory - Analytics category for tracking events.
 * @returns {JSX.Element|null} The FilterModal component.
 */
const FilterModal = ({ aemData, onQueryChanged, analyticsCategory }) => {
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

  const { setAppliedFilter } = useRenewalGridState((state) => state.effects);
  const { hasFilterChangeAvailable, dateSelected } = useFilteringSelected();

  const [DOMLoaded, setDOMLoaded] = useState(false);

  /**
   * Memoized computation of filter data based on the provided AEM data.
   */
  const aemFilterData = useMemo(() => {
    if (
      aemData.filterType === 'dynamic' &&
      filterData?.refinements &&
      !filterData.refinements.some(
        (refinement) => refinement.searchKey === 'Archives'
      )
    ) {
      if (aemData.enableArchiveQuote) {
        filterData.refinements.push({
          name: getDictionaryValue(aemData.showArchive, 'Show archives only'),
          searchKey: 'Archives',
        });
      }
      return normaliseAPIData(filterData.refinements);
    } else if (
      aemData.filterType === 'static' &&
      aemData.enableArchiveQuote &&
      !aemData.filterListValues.some((filter) =>
        filter.options?.some((option) => option.searchKey === 'archives')
      )
    ) {
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
      return normaliseState(aemData.filterListValues);
    }
    return aemData.filterType === 'dynamic'
      ? normaliseAPIData(filterData?.refinements || [])
      : normaliseState(aemData.filterListValues || []);
  }, [aemData, filterData]);

  const {
    setFilterList,
    clearDateFilters,
    toggleFilterModal,
    clearUnappliedDateRange,
    setCustomState,
  } = effects;

  useEffect(() => {
    if (!filterList || filterList.length === 0) {
      setFilterList([...aemFilterData]);
    }
  }, [aemFilterData, filterList, setFilterList]);

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

  /**
   * Clears all filters and resets date filters.
   */
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

  const flyoutRef = useRef(null);

  /**
   * Toggles body scroll based on the modal state.
   *
   * @param {boolean} disable - Whether to disable scrolling.
   */
  const toggleBodyScroll = (disable) => {
    document.body.style.overflow = disable ? 'hidden' : 'auto';
  };

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
   * Closes the filter modal flyout and resets filters.
   */
  const closeFlyout = () => {
    toggleFilterModal({ justClose: true });
    setFilterList([...aemFilterData]); // Reset the filter state
    clearDateFilters();
  };

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
   * Applies filters and triggers the query change callback.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    setAppliedFilter(optionFields);
    toggleFilterModal();
    if (resetFilter) setCustomState({ key: 'resetFilter', value: false });
    onQueryChanged();
    clearUnappliedDateRange();
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
          onClose={closeFlyout}
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
