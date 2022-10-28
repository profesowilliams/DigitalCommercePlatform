import React, { useEffect, useState } from "react";
import { If } from "../../../helpers/If";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import capitalizeFirstLetter, {
  getLocaleFormattedDate,
} from '../../../../../utils/utils';
import useFilteringSelected from "../hooks/useIsFilteringSelected";
import useIsTDSynnexClass from "./useIsTDSynnexClass";

function CustomDatePill({ clearDateFilters }) {
  const datePickerState = useRenewalGridState( state => state.datePickerState);
  const customStartDate = useRenewalGridState( state => state.customStartDate);
  const customEndDate   = useRenewalGridState( state => state.customEndDate);
  const { computeClassName } = useIsTDSynnexClass();
  if (!datePickerState) return null;
  const [startDate, endDate] = datePickerState;

  return customStartDate && customEndDate ? (
    <div className={computeClassName("filter-tags")}>
      <span className="filter-tags__title">
        {getLocaleFormattedDate(startDate)}
        {" - "}
        {getLocaleFormattedDate(endDate)}{" "}
      </span>
      <span onClick={() => clearDateFilters()}>
        <i className="fas fa-times filter-tags__close"></i>
      </span>
    </div>
  ) : null;
}

function FilterTags() {

  const [showMore, setShowMore] = useState(false); 
  const effects = useRenewalGridState((state) => state.effects);
  const {hasAnyFilterSelected, filterList, dateSelected} = useFilteringSelected()
  const { setFilterList, clearDateFilters } = effects;
  const { computeClassName } = useIsTDSynnexClass();
  
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (filterList && filterList.length > 4){
      setShowMore(true)
    }
  },[filterList])

  const isOneChecked = (filters, filter) =>
    filters[filter.parentId].childIds.some((id) => {
      return filters[id].checked === true;
    });

  const handleTagsCloseClick = (filter) => {
    const filtersCopy = [...filterList].map((item) => {
      const {id} = item;
      if ( id === filter.id ) return {...item,checked:false};
      return {...item}
    }); 
    /**
     * to handle checkbox logic for nested accordion when u interact with tags.
     */
    if (filter.childIds.length === 0 && "parentId" in filter) {
      const oneChecked = isOneChecked(filtersCopy, filter);
      const parent = filtersCopy[filter.parentId];
      if (!oneChecked && "parentId" in parent) {
        parent.checked = false;
        // close only nested children
        parent.childIds.map((id) => {
          return (filtersCopy[id].open = false);
        });
      }
    }
    /**
     * to uncheck vendor childs as soon as we toggle off.
     */
    if (filter.field === 'ProgramName'){
      const vendorChilds = filter.childIds;
      for(const vendor of vendorChilds){
        filtersCopy[vendor].open = false;
        filtersCopy[vendor].checked = false;
      }
    }

    setFilterList(filtersCopy);
  };

  const formatDatePill = (selectedDate) => {
    switch (selectedDate) {
      case "today":
      case "overdue":
        return capitalizeFirstLetter(selectedDate);
      case "30":
        return `0 - ${selectedDate} days`;
      case "60":
      case "90":
        return `${selectedDate - 29} - ${selectedDate} days`;
      case "91":
        return `${selectedDate}+ days`;
      default:
        return selectedDate;
    }
  };

  return (
    <If condition={hasAnyFilterSelected()}>
      <div className={`filter-tags-container ${showMore ? "active" : ""}`}>
        <span onClick={handleShowMore} className="filter-tags-more"></span>
        {filterList &&
          filterList.map((filter, index) => {
            if (filter.childIds?.length === 0 && filter.checked) {
              return (
                <div className={computeClassName("filter-tags")} key={index}>
                  <span className="filter-tags__title" key={index}>
                    {filter.title}{" "}
                  </span>
                  <span onClick={() => handleTagsCloseClick(filter)}>
                    <i className="fas fa-times filter-tags__close"></i>
                  </span>
                </div>
              );
            } else if (filter.field === "ProgramName" && filter.checked) {
              return (
                <div className={computeClassName("filter-tags")} key={index}>
                  <span className="filter-tags__title" key={index}>
                    {filter.title}{" "}
                  </span>
                  <span onClick={() => handleTagsCloseClick(filter)}>
                    <i className="fas fa-times filter-tags__close"></i>
                  </span>
                </div>
              );
            }
          })}
        <If
          condition={dateSelected && dateSelected !== "custom"}
          Else={<CustomDatePill clearDateFilters={clearDateFilters} />}
        >
          <div className={computeClassName("filter-tags")}>
            <span className="filter-tags__title">
              {formatDatePill(dateSelected)}{" "}
            </span>
            <span onClick={() => clearDateFilters()}>
              <i className="fas fa-times filter-tags__close"></i>
            </span>
          </div>
        </If>
      </div>
    </If>
  );
}

export default FilterTags;
