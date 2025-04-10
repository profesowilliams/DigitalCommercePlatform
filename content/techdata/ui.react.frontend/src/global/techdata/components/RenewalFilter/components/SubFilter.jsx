import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import FilterItem from "./FilterItem";

function SubFilter({ id }) {
  const filterList = useRenewalGridState(state => state.filterList);

  if (!filterList) return null;
  const filter = filterList[id];
  const childIds = filter?.childIds;
  return (
    <>
      {filter.open === true ? (
        <>
          <FilterItem id={id} />
          {childIds.length > 0 && (
            <ul className="sub-filter">
              {childIds.map((childId, index) => {
                return <SubFilter key={index} id={childId} />;
              })}
            </ul>
          )}
        </>
      ) : null}
      {filter.field === 'Archives' && (
        <>
          <FilterItem
            id={id}
            key={id}
            isStandalone={filter.field === 'Archives'}
          />
        </>
      )}
    </>
  );
}

export default SubFilter;
