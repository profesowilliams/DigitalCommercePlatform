import React, { useRef, useState } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";
import { formateDatePicker, isNotEmptyValue, validateDatePicker, isQueryValid } from "../../../../utils/utils";

function ConfigurationGridSearch({
  componentProp,
  onQueryChanged,
  onKeyPress,
}) {
  //Optional values to make limitations on the ranges of dates selected on datepicker//
  const [toMinDate, setToMinDate] = useState()
  const [fromMinDate, setFromMinDate] = useState()
  const currentDate = new Date();

  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "EndUser", value: "End User" },
      { key: "Id", value: "Config ID" },
      { key: "ConfigName", value: "Config Name" },
    ],
  };

  const defaultConfigurationTypesDropdown = {
    label: "Configuration Types",
    items: [
      { key: "AllConfigurationTypes", value: "All Configuration Types" },
      { key: "Estimate", value: "Estimate" },
      { key: "VendorQuote", value: "Vendor Quote" },
      { key: "Deal", value: "Deal" },
    ],
  };

  const config = {
    keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
      ? componentProp?.keywordDropdown
      : defaultKeywordDropdown,
    configurationTypesDropdown: isNotEmpty(
      componentProp?.configurationTypesDropdown
    )
      ? componentProp?.configurationTypesDropdown
      : defaultConfigurationTypesDropdown,
    inputPlaceholder: componentProp?.inputPlaceholder ?? "Enter Your Search",
    fromLabel: componentProp?.fromLabel ?? "From",
    toLabel: componentProp?.toLabel ?? "To",
    datePlaceholder: componentProp?.datePlaceholder ?? "MM/DD/YYYY",
  };
    
  const _query = useRef({});
  const [dateDefaultToValue, setDateDefaultToValue] = useState(true);
  const [dateDefaultFromValue, setDateDefaultFromValue] = useState(true);

  const dispatchAnalyticsChange = (query) => {
    return {
      searchTerm: query.keyword?.key && query.keyword?.value ? query.keyword?.value : '',
      searchOption: isNotEmptyValue(query.keyword?.value),
      configFilter: isNotEmptyValue(query.configurations.key),
      fromDate: isNotEmptyValue(query.from?.key),
      toDate: isNotEmptyValue(query.to?.key),
    };
  }

  function dispatchQueryChange(query) {
    let keyword =
      query.keyword?.key && query.keyword?.value
        ? `&${query.keyword.key}=${query.keyword.value}`
        : "";
    let configurations =
      query.configurations?.key &&
      query.configurations?.key !== "AllConfigurationTypes"
        ? `&ConfigurationType=${query.configurations.key}`
        : "";
    let from =
      query.from?.key && query.from?.value
        ? formateDatePicker(query.from.value, '&createdFrom=')
        : "";
    let to =
      query.to?.key && query.to?.value
        ? formateDatePicker(query.to.value, '&createdTo=')
        : "";

    // From DatePicker Validation
    validateDatePicker(query.from, query.to, setDateDefaultToValue);
    // To DatePicker Validation
    validateDatePicker(query.to, query.from, setDateDefaultFromValue);

    let concatedQuery = `${keyword}${configurations}${from}${to}`;
    if (isQueryValid(query)) {
      setToMinDate(query.from?.value)
      setFromMinDate(currentDate)
      onQueryChanged(concatedQuery, dispatchAnalyticsChange(query));

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

  return (
    <div className="cmp-orders-grid__search">
      <QueryInput
        key={"keyword"}
        items={config.keywordDropdown.items}
        placeholder={config.inputPlaceholder}
        onQueryChanged={(change) => handleFilterChange(change, "keyword")}
        onKeyPress={(isEnter) => onKeyPress(isEnter)}
      ></QueryInput>
      <SimpleDropDown
        key={"configurations"}
        items={config.configurationTypesDropdown.items}
        onItemSelected={(change) =>
          handleFilterChange(change, "configurations")
        }
      ></SimpleDropDown>
      <SimpleDatePicker
        maxDate={fromMinDate}
        pickerKey={"from"}
        placeholder={config.datePlaceholder}
        label={config.fromLabel}
        forceZeroUTC={false}
        onSelectedDateChanged={(change) => handleFilterChange(change, "from")}
        isDateFrom={true}
        defaultValue={dateDefaultFromValue}
      ></SimpleDatePicker>
      <SimpleDatePicker
        minDate={toMinDate}
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

export default ConfigurationGridSearch;
