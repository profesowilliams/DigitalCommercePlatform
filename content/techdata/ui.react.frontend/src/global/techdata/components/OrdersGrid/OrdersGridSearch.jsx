import React, { useRef } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";

function OrdersGridSearch({ componentProp, onQueryChanged }) {
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
      { key: "edi", value: "EDI" },
      { key: "xml", value: "XML" },
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

  const _query = useRef({});

  function dispatchQueryChange(query) {
    let keyword =
      query.keyword?.key && query.keyword?.value
        ? `&${query.keyword.key}=${query.keyword.value}`
        : "";
    let manufacturer =
      query.manufacturer?.key && query.manufacturer?.key !== "allVendors"
        ? `&manufacturer=${query.manufacturer.key}`
        : "";
    let method =
      query.method?.key && query.method?.key !== "allMethods"
        ? `&orderMethod=${query.method.key}`
        : "";
    let from =
      query.from?.key && query.from?.value
        ? `&createdFrom=${new Date(query.from.value).toISOString()}`
        : "";
    let to =
      query.to?.key && query.to?.value
        ? `&createdTo=${new Date(query.to.value).toISOString()}`
        : "";
    let concatedQuery = `${keyword}${manufacturer}${method}${from}${to}`;
    if (isQueryValid(query)) {
      onQueryChanged(concatedQuery);
    } else {
      onQueryChanged("");
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

  function handleFilterChange(change, filterName) {
    if (change) {
      _query.current[filterName] = change;
      dispatchQueryChange(_query.current);
    }
  }

  return (
    <div className="cmp-orders-grid__search">
      <QueryInput
        key={"keyword"}
        items={config.keywordDropdown.items}
        placeholder={config.inputPlaceholder}
        onQueryChanged={(change) => handleFilterChange(change, "keyword")}
      ></QueryInput>
      <SimpleDropDown
        key={"manufacturer"}
        items={config.vendorsDropdown.items}
        onItemSelected={(change) => handleFilterChange(change, "manufacturer")}
      ></SimpleDropDown>
      <SimpleDropDown
        key={"method"}
        items={config.methodsDropdown.items}
        onItemSelected={(change) => handleFilterChange(change, "method")}
      ></SimpleDropDown>
      <SimpleDatePicker
        pickerKey={"from"}
        placeholder={config.datePlaceholder}
        label={config.fromLabel}
        onSelectedDateChanged={(change) => handleFilterChange(change, "from")}
      ></SimpleDatePicker>
      <SimpleDatePicker
        pickerKey={"to"}
        placeholder={config.datePlaceholder}
        label={config.toLabel}
        onSelectedDateChanged={(change) => handleFilterChange(change, "to")}
      ></SimpleDatePicker>
    </div>
  );
}

export default OrdersGridSearch;
