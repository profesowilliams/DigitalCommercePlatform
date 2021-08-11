import React, { useRef } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";

function ConfigurationGridSearch({ componentProp, onQueryChanged }) {
  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "endUserName", value: "End User" },
      { key: "configId", value: "Config ID" },
      { key: "configName", value: "Config Name" },
    ],
  };

  const defaultConfigurationTypesDropdown = {
    label: "Configuration Types",
    items: [
      { key: "estimate", value: "Estimate" },
      { key: "vendorQuote", value: "Vendor Quote" },
      { key: "deal", value: "Deal" },
    ],
  };

  const config = {
    keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
      ? componentProp?.keywordDropdown
      : defaultKeywordDropdown,
    configurationTypesDropdown: isNotEmpty(componentProp?.configurationTypesDropdown)
      ? componentProp?.configurationTypesDropdown
      : defaultConfigurationTypesDropdown,
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
    let from =
      query.from?.key && query.from?.value
        ? `&createdFrom=${new Date(query.from.value.setUTCHours(0, 0, 0)).toISOString()}`
        : "";
    let to =
      query.to?.key && query.to?.value
        ? `&createdTo=${new Date(query.to.value.setUTCHours(23, 59, 59)).toISOString()}`
        : "";
    let concatedQuery = `${keyword}${manufacturer}${from}${to}`;
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
        items={config.configurationTypesDropdown.items}
        onItemSelected={(change) => handleFilterChange(change, "manufacturer")}
      ></SimpleDropDown>
      <SimpleDatePicker
        pickerKey={"from"}
        placeholder={config.datePlaceholder}
        label={config.fromLabel}
        forceZeroUTC={true}
        onSelectedDateChanged={(change) => handleFilterChange(change, "from")}
      ></SimpleDatePicker>
      <SimpleDatePicker
        pickerKey={"to"}
        placeholder={config.datePlaceholder}
        label={config.toLabel}
        forceZeroUTC={true}
        onSelectedDateChanged={(change) => handleFilterChange(change, "to")}
      ></SimpleDatePicker>
    </div>
  );
}

export default ConfigurationGridSearch;
