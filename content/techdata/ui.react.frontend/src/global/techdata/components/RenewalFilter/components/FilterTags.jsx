import React, { useEffect, useState } from 'react';
import { If } from '../../../helpers/If';
import { useRenewalGridState } from '../../RenewalsGrid/store/RenewalsStore';
import capitalizeFirstLetter from '../../../../../utils/utils';
import useFilteringSelected from '../hooks/useIsFilteringSelected';
import useComputeBranding from '../../../hooks/useComputeBranding';
import { dateToString } from '../../../helpers/formatting';
import { FILTER_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { getLocalStorageData } from '../../RenewalsGrid/utils/renewalUtils';

// Reusable Close Icon Component
const CloseIcon = ({ onClick }) => (
  <span onClick={onClick}>
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
);

// Reusable FilterTag Component
const FilterTag = ({ title, onClose, className }) => (
  <div className={className}>
    <span className="filter-tags__title">{title}</span>
    <CloseIcon onClick={onClose} />
  </div>
);

// CustomDatePill Component
function CustomDatePill({ clearDateFilters }) {
  const datePickerState = useRenewalGridState((state) => state.datePickerState);
  const customStartDate = useRenewalGridState((state) => state.customStartDate);
  const customEndDate = useRenewalGridState((state) => state.customEndDate);
  const { computeClassName } = useComputeBranding(useRenewalGridState);

  if (!datePickerState) return null;

  const [startDate, endDate] = datePickerState;

  return customStartDate && customEndDate ? (
    <FilterTag
      title={`${dateToString(startDate, "MMM d',' y")} - ${dateToString(
        endDate,
        "MMM d',' y"
      )}`}
      onClose={clearDateFilters}
      className={computeClassName('filter-tags')}
    />
  ) : null;
}

// Main FilterTags Component
function FilterTags() {
  const [showMore, setShowMore] = useState(false);
  const effects = useRenewalGridState((state) => state.effects);
  const { hasAnyFilterApplied, filterList, dateSelected } =
    useFilteringSelected();
  const { setFilterList, clearDateFilters, setCustomState } = effects;
  const { computeClassName } = useComputeBranding(useRenewalGridState);

  useEffect(() => {
    if (filterList?.length > 4) {
      setShowMore(true);
    }
  }, [filterList]);

  useEffect(() => {
    const hasDateApplied = getLocalStorageData(
      FILTER_LOCAL_STORAGE_KEY
    )?.dateSelected;
    if (hasDateApplied) {
      setCustomState({ key: 'dateSelected', value: hasDateApplied });
    }
  }, []);

  const handleTagsCloseClick = (filter) => {
    const filtersCopy = filterList.map((item) => {
      if (item.id === filter.id) return { ...item, checked: false };
      return item;
    });

    // Handle nested accordions
    if (filter.childIds.length === 0 && filter.parentId) {
      const parent = filtersCopy[filter.parentId];
      if (
        !filtersCopy[filter.parentId].childIds.some(
          (id) => filtersCopy[id].checked
        )
      ) {
        parent.checked = false;
        parent.childIds.forEach((id) => (filtersCopy[id].open = false));
      }
    }

    // Handle vendor children
    if (filter.field === 'ProgramName') {
      filter.childIds.forEach((id) => {
        filtersCopy[id].open = false;
        filtersCopy[id].checked = false;
      });
    }

    setFilterList(filtersCopy);
  };

  const formatDatePill = (selectedDate) => {
    const ranges = {
      today: 'Today',
      overdue: 'Overdue',
      30: '0 - 30 days',
      60: '31 - 60 days',
      90: '61 - 90 days',
      91: '91+ days',
    };
    return ranges[selectedDate] || capitalizeFirstLetter(selectedDate);
  };

  return (
    <If condition={hasAnyFilterApplied()}>
      <div className={`filter-tags-container ${showMore ? 'active' : ''}`}>
        <span
          onClick={() => setShowMore(!showMore)}
          className="filter-tags-more"
        />
        {filterList?.map((filter) => {
          if (filter.checked && filter.title !== '(root)') {
            // Exclude "(root)" tag
            return (
              <FilterTag
                key={filter.id}
                title={
                  filter.field === 'ProgramName' ? filter.title : filter.title
                }
                onClose={() => handleTagsCloseClick(filter)}
                className={computeClassName('filter-tags')}
              />
            );
          }
          return null; // Ensure unwanted filters are skipped
        })}
        {dateSelected && dateSelected !== 'custom' ? (
          <FilterTag
            title={formatDatePill(dateSelected)}
            onClose={clearDateFilters}
            className={computeClassName('filter-tags')}
          />
        ) : (
          <CustomDatePill clearDateFilters={clearDateFilters} />
        )}
      </div>
    </If>
  );
}

export default FilterTags;
