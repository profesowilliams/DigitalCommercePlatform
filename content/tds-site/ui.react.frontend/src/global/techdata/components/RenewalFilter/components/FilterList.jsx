import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import Filter from "./Filter";

function FilterList({ rootIds }) {
  const  filterList  = useRenewalGridState(state => state.filterList);
  return rootIds.map((id) => <Filter key={id} id={id} filters={filterList} />);
}

export default FilterList;
