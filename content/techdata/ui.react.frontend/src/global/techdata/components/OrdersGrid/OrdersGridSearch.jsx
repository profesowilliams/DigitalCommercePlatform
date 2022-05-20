import React, { useRef, useState } from "react";
import QueryInput from "../Widgets/QueryInput";
import SimpleDropDown from "../Widgets/SimpleDropDown";
import SimpleDatePicker from "../Widgets/SimpleDatePicker";
import isNotEmpty from "../../helpers/IsNotNullOrEmpty";
import { useEffect } from "react";
import {
  formateDatePicker,
  validateDatePicker,
  isQueryValid,
  isNotEmptyValue,
  validateDatesForAnalytics,
  handleToDateFilter,
  handleFromDateFilter
} from "../../../../utils/utils";
import { 
  ORDER_GRID_SEARCH_FIELD_ALL_LINES_KEY,
  ORDER_GRID_SEARCH_FIELD_ALL_METHODS_KEY, 
  ORDER_GRID_SEARCH_FIELD_ALL_VENDORS_KEY
} from "../../../../utils/constants";

function OrdersGridSearch({
  componentProp,
  onQueryChanged,
  onKeyPress,
  onSearchRequest,
  uiServiceEndPoint,
  onClear,
  HeaderButtonOptions,
  onSearch,
  setExpanded,
  handleClickOptionsButton,
}) {
  const defaultKeywordDropdown = {
    label: "Keyword",
    items: [
      { key: "id", value: "TD Order #" },
      { key: "customerPO", value: "Customer PO" },
      { key: "confirmationNumber", value: "Confirmation # " },
      { key: "Vendor", value: "Vendor Name" },
    ],
  };
  const _query = useRef({});
  const idParam = useRef();
  const flagKeyword = useRef(false);
  const flagManufacturer = useRef(false);
  const flagMethod = useRef(false);
  const [toMinDate, setToMinDate] = useState();
  const [dateDefaultToValue, setDateDefaultToValue] = useState(true);
  const [dateDefaultFromValue, setDateDefaultFromValue] = useState(true);
  const [defaultAllVendor, setDefaultAllVendor] = useState(null);
  const [defaultAllMethod, setDefaultAllMethod] = useState(null);
  const [defaultAllLine, setDefaultAllLine] = useState(null);

  /**
   * Effect if there is a ID param in the URL catch and
   * create a filter URL to use and fetch the data
   * */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let _id = params.get("id");
    params.delete("id");
    if (_id && idParam.current === undefined) {
      const url = new URL(uiServiceEndPoint);
      let pathName = url.pathname ?? "";
      pathName.slice(-1) === "/" && (pathName = pathName.slice(0, -1));
      idParam.current = _id;
      const res = handleFilterChange({ key: "general", value: _id }, "general"); // Force the General key
      onSearchRequest({ queryString: res }); // execute the filter afther get the new filter value
    }
  }, [idParam, componentProp]);

  /**
   * Effect used to set the default value for the analytics key
   */
  useEffect(() => {
    setDefaultAllMethod(isNotEmptyValue(componentProp?.methodsDropdown?.items) ? componentProp?.methodsDropdown?.items[0].key : ORDER_GRID_SEARCH_FIELD_ALL_METHODS_KEY);
    setDefaultAllVendor(isNotEmptyValue(componentProp?.vendorsDropdown?.items) ? componentProp?.vendorsDropdown?.items[0].key : ORDER_GRID_SEARCH_FIELD_ALL_VENDORS_KEY);
    setDefaultAllLine(isNotEmptyValue(componentProp?.linesDropdown?.items) ? componentProp?.linesDropdown?.items[0].key : ORDER_GRID_SEARCH_FIELD_ALL_LINES_KEY);
  }, [componentProp]);

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

  /**
   * Function used to validate the key values with the constant
   * values in the dispatchAnalyticsChange
   * @param {string} keyValue 
   * @param {string} compareValue 
   * @returns 
   */
  const isEqual = (keyValue, compareValue) => {
    return keyValue === compareValue;
  };

  /**
   * handler that create and return and object 
   * @param {any} query 
   * @returns 
   */
  const dispatchAnalyticsChange = (query) => {
    return {
      searchTerm:
        query.keyword?.key && query.keyword?.value ? query.keyword?.value : "",
      searchOption: isNotEmptyValue(query.keyword?.value),
      vendorFilter: isNotEmptyValue(query.manufacturer?.key) && !isEqual(query.manufacturer?.key, defaultAllVendor),
      method: isNotEmptyValue(query.method?.key) && !isEqual(query.method?.key, defaultAllMethod),
      fromDate: validateDatesForAnalytics(query.from),
      toDate: validateDatesForAnalytics(query.to),
    };
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
        ? formateDatePicker(query.from.value, "&createdFrom=")
        : "";
    let to =
      query.to?.key && query.to?.value
        ? formateDatePicker(query.to.value, "&createdTo=")
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
      setToMinDate(query.from?.value)
      onQueryChanged(concatedQuery, dispatchAnalyticsChange(query));
    } else {
      onQueryChanged("");
    }
    return concatedQuery;
  }

  function handleFilterChange(change, filterName) {
    if (change) {
      _query.current[filterName] = change;
      const res = dispatchQueryChange(_query.current);
      return res;
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
            handleFilterChange(change, "keyword");
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
            handleFilterChange(change, "manufacturer");
          } else {
            flagManufacturer.current = true;
          }
        }}
      ></SimpleDropDown>
      <SimpleDropDown
        key={"method"}
        items={config.methodsDropdown.items}
        onItemSelected={(change) => {
          if (flagMethod.current) {
            handleFilterChange(change, "method");
          } else {
            flagMethod.current = true;
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
        filterDate={handleFromDateFilter}
      ></SimpleDatePicker>
      <SimpleDatePicker
        minDate={toMinDate}
        pickerKey={"to"}
        placeholder={config.datePlaceholder}
        label={config.toLabel}
        forceZeroUTC={false}
        onSelectedDateChanged={(change) => handleFilterChange(change, "to")}
        defaultValue={dateDefaultToValue}
        filterDate={handleToDateFilter}
      ></SimpleDatePicker>
      <HeaderButtonOptions 
        handleChange={onQueryChanged}
        onSearch={onSearch}
        onClear={onClear}
        expanded={false}
        setExpanded={setExpanded}
        handleClickOptionsButton={handleClickOptionsButton}
      />
      
    </div>
  );
}

export default OrdersGridSearch;
