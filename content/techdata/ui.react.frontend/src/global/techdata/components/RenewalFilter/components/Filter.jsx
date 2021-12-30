import produce from "immer";
import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import SubFilter from "./SubFilter";


const Count = ({ children }) => {
  return <div className="count">{children}</div>;
};

function Filter({ id }) {
  const {filterList, effects} = useRenewalGridState()
  const {setFilterList} = effects;
  if (!filterList) return null;
  const filter = filterList[id];
  const childIds = filter.childIds;

  const handleFilterClick = () => {
    const filtersCopy = produce(filterList, (draft) => {
      if (!("parentId" in filter)) {
        draft[filter.id].open = !draft[filter.id].open;
      } 
      childIds.map((id) => {
        return (draft[id].open = !draft[id].open);
      });
    });
    setFilterList(filtersCopy);
  };

  const SubFilterList = () =>
    childIds.map((childId) => (
      <SubFilter
        key={childId}
        id={childId}
      />
    ));

  const checkCount = (f) => {
    let c = [];
    let k = 0;
    if (f.childIds.length > 0) {
      f.childIds.forEach((id) => {
        if (filterList[id].childIds.length > 0) {
          filterList[id].childIds.forEach((id) => {
            c.push(id);
          });
          k = c.filter((id) => {
            return filterList[id].checked === true;
          }).length;
        } else {
          k = filterList[filterList[id].parentId].childIds.filter((id) => {
            return filterList[id].checked === true;
          }).length;
        }
      });
    }
    return k === 0 ? null : k;
  };

  return (
    <>
      <li
        onClick={handleFilterClick}
        className="filter-accordion__item"
      >
        <div className="filter-accordion__item--group">
          <h3 className={`${filter.open ? "active" : ""}`}>{filter.title}</h3>
          <Count>{checkCount(filter)}</Count>
        </div>
      </li>

      {childIds.length > 0 && (
        <ul className="filter-option__options">
          <SubFilterList />
        </ul>
      )}
    </>
  );
}

export default Filter;
