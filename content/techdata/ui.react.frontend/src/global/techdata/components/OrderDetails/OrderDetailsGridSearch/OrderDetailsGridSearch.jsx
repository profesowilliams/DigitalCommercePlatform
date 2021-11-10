import React, { useRef, useState } from "react";
import isNotEmpty from "../../../helpers/IsNotNullOrEmpty";
import SimpleQueryInput from "../../Widgets/SimpleQueryInput";
import SimpleDropDown from "../../Widgets/SimpleDropDown";

function OrdersDetailsGridSearch({ componentProp, onQueryChanged, onSearch, setFilterActive, setExternalFilterActive }) {
  const [flag, setFlag] = useState(false);
  const [queryState, setQueryState] = useState('');
  const [flagDescription, setFlagDescription] = useState(false);
  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "id", value: "TD Order #" },
      { key: "customerPO", value: "Customer PO" },
    ],
  };

  const defaultVendorsDropdown = {
    label: "Vendors",
    items: [
      { key: "allVendors", value: "All Vendors" },
      { key: "cisco", value: "Cisco" },
    ],
  };

  const defaultMethodsDropdown = {
    label: "Order Method",
    items: [
      { key: "allMethods", value: "All Order Methods" },
      { key: "web", value: "Web" },
      { key: "b2b", value: "EDI/XML" },
      { key: "PE", value: "Phone/Email" },
    ],
  };

  const defaultSearchBydDropdown = {
    label: "SearchBy",
    items: [
      { key: "allLines", value: "All Lines" },
      { key: "contractNo", value: "Contracts" },
      { key: "licenses", value: "Licenses" },
    ],
  };

  const config = {
    keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
      ? componentProp?.keywordDropdown
      : defaultKeywordDropdown,
    vendorsDropdown: isNotEmpty(componentProp?.vendorsDropdown)
      ? componentProp?.vendorsDropdown
      : defaultVendorsDropdown,
    searchByDropdown: isNotEmpty(componentProp?.searchbyDropdown)
      ? componentProp?.searchbyDropdown
      : defaultSearchBydDropdown,
    methodsDropdown: isNotEmpty(componentProp?.methodsDropdown)
      ? componentProp?.methodsDropdown
      : defaultMethodsDropdown,
    inputPlaceholder: componentProp?.inputPlaceholder ?? "Enter Your Search",
    fromLabel: componentProp?.fromLabel ?? "From",
    toLabel: componentProp?.toLabel ?? "To",
    datePlaceholder: componentProp?.datePlaceholder ?? "MM/DD/YYYY",
  };
  const _query = useRef({});

  function dispatchQueryChange(query) {
    let keyword =
      query.keyword?.key && query.keyword?.value
        ? `&${query.keyword.key}=${query.keyword.value}`
        : "";
    let manufacturer =
      query.manufacturer?.key && query.manufacturer?.key !== "allVendors"
        ? `&vendor=${query.manufacturer.key}`
        : "";
    let method =
      query.method?.key && query.method?.key !== "allMethods"
        ? `&orderMethod=${query.method.key}`
        : "";
    let from =
      query.from?.key && query.from?.value
        ? `&createdFrom=${new Date(
            query.from.value.setUTCHours(0, 0, 0)
          ).toISOString()}`
        : "";
    let to =
      query.to?.key && query.to?.value
        ? `&createdTo=${new Date(
            query.to.value.setUTCHours(23, 59, 59)
          ).toISOString()}`
        : "";
    let searchby =
      query.searchby?.key && query.searchby?.key !== "allLines"
        ? `&searchBy=${query.searchby.key}`
        : "";
    let description =
      query.description?.key && query.description?.value.length >= 3
        ? `&description=${query.description.value}`
        : "";
    // If the value match with the default value, prepare a query value to filter and keep the flow
    if (query.searchby?.key === 'allLines') {
      searchby = `&searchBy=${query.searchby.key}`;
    }
    
    let concatedQuery = `${keyword}${manufacturer}${method}${from}${to}${searchby}${description}`;
    if (isQueryValid(query)) {
      setQueryState(query)
      onQueryChanged(concatedQuery);
    } else {
      onQueryChanged("");
    }
  }
  

  function handleFilterChange(change, filterName) {
    if (change) {
      _query.current[filterName] = change;
      dispatchQueryChange(_query.current);
    }
  }
  
  function isQueryValid(query) {
    if (
      query.from?.value &&
      query.to?.value &&
      query.to?.value < query.from?.value
    ) {
      return false;
    } else {
      return true;
    }
  }

  const onKeyPress = (event) => {
    if (event && queryState.description.value?.length >= 3) {
        onSearch(); 
    }
  };

  return (
    <div className="cmp-orders-grid__search">
      <SimpleDropDown
        key={"keyword"}
        items={config.searchByDropdown.items}
        placeholder={config.inputPlaceholder}
        onItemSelected={(change) => {
          if (flag) {
            handleFilterChange(change, "searchby")
          }
          setFlag(true);
        }}
      ></SimpleDropDown>
      <SimpleQueryInput
        key={"keyword"}
        filterKey={'description'}        
        items={config.keywordDropdown.items}
        placeholder={config.inputPlaceholder}
        onQueryChanged={(change) => {
          if (flagDescription) {
            if (change.value.length >= 3) {
              setFilterActive(true)
              setExternalFilterActive(true)
              
            } else {
              setFilterActive(false)
              setExternalFilterActive(false)
            }
            handleFilterChange(change, "description")
          }
          setFlagDescription(true);
          
        }}
        onKeyPress={(isEnter) => onKeyPress(isEnter)}
      ></SimpleQueryInput>
    </div>
  );
}

export default OrdersDetailsGridSearch;
