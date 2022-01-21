import React, { useRef, useState } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";
import { useEffect } from "react";
import { formateDatePicker, validateDatePicker } from "../../../../utils/utils";

function OrdersGridSearch({ componentProp, onQueryChanged, onKeyPress, onSearchRequest, uiServiceEndPoint}) {
  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "id", value: "TD Order #" },
      { key: "customerPO", value: "Customer PO" },
    ],
  };
  const _query = useRef({});
  const idParam = useRef();
  const flagKeyword = useRef(false);
  const flagManufacturer = useRef(false);
  const flagMethod = useRef(false);
  const [dateDefaultToValue, setDateDefaultToValue] = useState(true);
  const [dateDefaultFromValue, setDateDefaultFromValue] = useState(true);

  /**
   * Effect if there is a ID param in the URL catch and
   * create a filter URL to use and fetch the data
   * */ 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let _id = params.get('id');
    params.delete('id');
    if (_id && idParam.current === undefined) {
        const url = new URL(uiServiceEndPoint);
        let pathName = url.pathname ?? "";
            pathName.slice(-1) === "/" && (pathName = pathName.slice(0, -1));
        idParam.current = _id;
        const res = handleFilterChange({key:'general', value: _id}, "general"); // Force the General key
        onSearchRequest({ queryString: res }) // execute the filter afther get the new filter value
    }
  }, [idParam, componentProp])

  
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
const config = {
    keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
      ? componentProp?.keywordDropdown
      : defaultKeywordDropdown,
    vendorsDropdown: isNotEmpty(componentProp?.vendorsDropdown)
      ? componentProp?.vendorsDropdown
      : defaultVendorsDropdown,
    methodsDropdown: isNotEmpty(componentProp?.methodsDropdown)
      ? componentProp?.methodsDropdown
      : defaultMethodsDropdown,
    inputPlaceholder: componentProp?.inputPlaceholder ?? "Enter Your Search",
    fromLabel: componentProp?.fromLabel ?? "From",
    toLabel: componentProp?.toLabel ?? "To",
    datePlaceholder: componentProp?.datePlaceholder ?? "MM/DD/YYYY",
  };

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
        ? formateDatePicker(query.from.value)
        : "";
    let to =
      query.to?.key && query.to?.value
        ?  formateDatePicker(query.to.value)
        : "";
    // Filters by URL
    let general =    
      query.general?.key && query.general?.value
        ? `&idType=GENERAL&id=${query.general.value}`
        : "";

    // From DatePicker Validation
    validateDatePicker(query.from, query.to, setDateDefaultToValue);
    // To DatePicker Validation
    validateDatePicker(query.to, query.from, setDateDefaultFromValue);

    let concatedQuery = `${keyword}${manufacturer}${method}${from}${to}${general}`;
    if (isQueryValid(query)) {
      onQueryChanged(concatedQuery);
    } else {
      onQueryChanged("");
    }
    return concatedQuery;
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

  function handleFilterChange(change, filterName) {
    if (change) {
      _query.current[filterName] = change;
      const res = dispatchQueryChange(_query.current);
      return res
    }
  }
 
  return (
    <div className="cmp-orders-grid__search">
      <QueryInput
        key={"keyword"}
        items={config.keywordDropdown.items}
        placeholder={config.inputPlaceholder}
        onQueryChanged={(change) => {
          if (flagKeyword.current) {
            handleFilterChange(change, "keyword")
          } else {
            flagKeyword.current = true;     
          }
        }}
        onKeyPress={(isEnter) => onKeyPress(isEnter)}
      ></QueryInput>
      <SimpleDropDown
        key={"manufacturer"}
        items={config.vendorsDropdown.items}
        onItemSelected={(change) => {
          if (flagManufacturer.current) {
            handleFilterChange(change, "manufacturer")
          } else {
            flagManufacturer.current = true
          }
        }}
      ></SimpleDropDown>
      <SimpleDropDown
        key={"method"}
        items={config.methodsDropdown.items}
        onItemSelected={(change) => {
          if (flagMethod.current) {
            handleFilterChange(change, "method")
          } else {
            flagMethod.current = true
          }
        }}
      ></SimpleDropDown>
      <SimpleDatePicker
        pickerKey={"from"}
        placeholder={config.datePlaceholder}
        label={config.fromLabel}
        forceZeroUTC={false}
        onSelectedDateChanged={(change) => handleFilterChange(change, "from")}
        isDateFrom={true}
        defaultValue={dateDefaultFromValue}
      ></SimpleDatePicker>
      <SimpleDatePicker
        pickerKey={"to"}
        placeholder={config.datePlaceholder}
        label={config.toLabel}
        forceZeroUTC={false}
        onSelectedDateChanged={(change) => handleFilterChange(change, "to")}
        defaultValue={dateDefaultToValue}
      ></SimpleDatePicker>
    </div>
  );
}

export default OrdersGridSearch;
