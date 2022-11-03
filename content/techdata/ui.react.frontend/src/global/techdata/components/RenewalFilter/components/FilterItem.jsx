import produce from "immer";
import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import useComputeBranding from "../../../hooks/useComputeBranding";

const FilterItem = ({ id }) => {

  const filterList = useRenewalGridState(state => state.filterList);
  const effects = useRenewalGridState(state => state.effects);
  const { computeClassName } = useComputeBranding(useRenewalGridState);
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
      filterDraft[id].checked = !filterDraft[id].checked;
      const filter = filterDraft[id];
      childIds.forEach((id) => {
        return (filterDraft[id].open = !filterDraft[id].open);
      });

      /**
       * if filter checked enable all children
       * else, viceversa
       */
      if (childIds.length > 0 && filter.checked) {
        childIds.map((id) => {
          return (filterDraft[id].checked = true);
        });
      }

      if (childIds.length > 0 && !filter.checked) {
        childIds.map((id) => {
          return (filterDraft[id].checked = false);
        });
      }

      /**
       * to handle checkbox logic for nested accordion.
       */
      if (childIds.length === 0 && "parentId" in filter) {
        const oneChecked = isOneChecked(filterDraft, filter);
        const parent = filterDraft[filter.parentId];

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

      const filterIndex = filterDraft.findIndex(
        (filter) => filter.id === filter.id
      );
      const filterUpdate = filterDraft[filterIndex];
      filterUpdate.checked = !filterUpdate.checked;
    });
    setFilterList(filtersCopy);
  };
  return (
    <li key={id}>
      <input
        name={filter.title}
        type="checkbox"
        className={computeClassName("filter-option__checkbox")}
        checked={filter.checked}
        onChange={handleCheckBoxClick}
        id={filter.title}
      />
      <label className={computeClassName("filter-option__label")} htmlFor={filter.title}>{filter.title}</label>
    </li>
  );
};

export default FilterItem;
