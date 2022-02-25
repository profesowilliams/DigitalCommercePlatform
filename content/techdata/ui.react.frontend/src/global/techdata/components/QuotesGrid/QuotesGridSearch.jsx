import React, { useEffect, useRef, useState } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";
import { formateDatePicker, validateDatePicker, isQueryValid, setTimestamps, isNotEmptyValue } from "../../../../utils/utils";

function QuotesGridSearch({ componentProp, onQueryChanged, onKeyPress, onSearchRequest, uiServiceEndPoint}) {
  const _query = useRef({});
  const idParam = useRef();
  const [dateDefaultToValue, setDateDefaultToValue] = useState(true);
  const [dateDefaultFromValue, setDateDefaultFromValue] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let _id = params.get('id');
    
    params.delete('id');
    if (_id) {    
        const url = new URL(uiServiceEndPoint);
        let pathName = url.pathname ?? "";
            pathName.slice(-1) === "/" && (pathName = pathName.slice(0, -1));
        idParam.current = _id;
        handleFilterChange({key:'quoteIdFilter', value: _id}, "keyword");
        const res = dispatchQueryChange(_query.current)
        onSearchRequest({ queryString: res })
    }
  }, [idParam])

  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "quoteIdFilter", value: "TD Quote ID" },
      { key: "endUserName", value: "End User Name" },
      { key: "vendorReference", value: "Deal ID" },
    ],
  };

  const defaultVendorsDropdown = {
    label: "Vendors",
    items: [
      { key: "allVendors", value: "All Vendors" },
      { key: "cisco", value: "Cisco" },
    ],
  };

  const config = {
    keywordDropdown: isNotEmpty(componentProp?.keywordDropdown)
      ? componentProp?.keywordDropdown
      : defaultKeywordDropdown,
    vendorsDropdown: isNotEmpty(componentProp?.vendorsDropdown)
      ? componentProp?.vendorsDropdown
      : defaultVendorsDropdown,
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
        ? `&manufacturer=${query.manufacturer.key}`
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
    
    let concatedQuery = `${keyword}${manufacturer}${from}${to}`;
    if (isQueryValid(query)) {
      const analyticObject = dispatchAnalyticsChange(query);
      onQueryChanged(concatedQuery, analyticObject);
    } else {
      onQueryChanged("");
    }
    return concatedQuery;
  }

  function handleFilterChange(change, filterName) {
    if (change) {
      _query.current[filterName] = change;
      dispatchQueryChange(_query.current);
    }
  }
  
  const dispatchAnalyticsChange = (query) => {
    return {
      searchTerm: query.keyword?.key && query.keyword?.value ? query.keyword?.value : '',
      searchOption: isNotEmptyValue(query.keyword?.value),
      vendorFilter: query.manufacturer?.value === 'All Vendors' ? false : true,
      fromDate: isNotEmptyValue(query.from?.key),
      toDate: isNotEmptyValue(query.to?.key)
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
        key={"manufacturer"}
        items={config.vendorsDropdown.items}
        onItemSelected={(change) => handleFilterChange(change, "manufacturer")}
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

export default QuotesGridSearch;
