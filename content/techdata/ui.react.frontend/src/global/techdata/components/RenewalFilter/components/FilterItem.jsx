import produce from "immer";
import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";

const FilterItem = ({ id }) => {

  const { filterList, effects } = useRenewalGridState();
  if (!filterList) return null;
  const { setFilterList } = effects;
  const filter = filterList[id];
  const childIds = filter?.childIds;

  const isOneChecked = (filters, filter) =>
    filters[filter.parentId].childIds.some((id) => {
      return filters[id].checked === true;
    });

  const handleCheckBoxClick = () => {
    const filtersCopy = produce(filterList, (filterDraft) => {
      // toggle the checked state of filter
      const currentFilter = { ...filter, checked: !filter.checked };
      childIds.map((id) => {
        return (filterDraft[id].open = !filterDraft[id].open);
      });

      /**
       * if filter checked enable all children
       * else, viceversa
       */
      if (childIds.length > 0 && currentFilter.checked) {
        childIds.map((id) => {
          return (filterDraft[id].checked = true);
        });
      }

      if (childIds.length > 0 && !currentFilter.checked) {
        childIds.map((id) => {
          return (filterDraft[id].checked = false);
        });
      }

      /**
       * to handle checkbox logic for nested accordion.
       */
      if (childIds.length === 0 && "parentId" in currentFilter) {
        const oneChecked = isOneChecked(filterDraft, currentFilter);
        const parent = filterDraft[currentFilter.parentId];

        if (oneChecked) {
          parent.checked = true;
        }

        if (!oneChecked && "parentId" in parent) {
          parent.checked = false;
          // close only nested children
          parent.childIds.map((id) => {
            return (filterDraft[id].open = false);
          });
        }
      }

      const currentFilterIndex = filterDraft.findIndex(
        (filter) => filter.id === currentFilter.id
      );
      const currentFilterUpdate = filterDraft[currentFilterIndex];
      currentFilterUpdate.checked = !currentFilterUpdate.checked;
    });
    setFilterList(filtersCopy);
  };
  return (
    <li key={id}>
      <input
        name={filter.title}
        type="checkbox"
        className="filter-option__checkbox"
        checked={filter.checked}
        onChange={handleCheckBoxClick}
        id={filter.title}
      />
      <label className="filter-option__label" htmlFor={filter.title}>{filter.title}</label>
    </li>
  );
};

export default FilterItem;
