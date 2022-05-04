import { addDays, removeDays } from "../../../helpers/formatting";

export function areAllFiltersUnchecked(filterList) {
  return !filterList.some((item) => item.checked);
}

function mapMultipleValues(uniqueField, filteredResult) {
  let list = [];
  for (let { field, title } of filteredResult) {
    if (field === uniqueField) list.push(title);
  }
  return list;
}

function mapToObject(dateList = []) {
  const [DueDateFrom, DueDateTo] = dateList;
  if ((DueDateFrom, DueDateTo)) return { DueDateFrom, DueDateTo };
  if (!DueDateFrom) return { DueDateTo };
  if (!DueDateTo) return { DueDateFrom };
}

export function generateFilterFields(
  filterList,
  dateSelected,
  datePickerState
) {

  if(!filterList) return null

  const [startRangeDate, endRangeDate] = datePickerState || [
    new Date(),
    new Date(),
  ];

  const MAP_OPTIONS = {
    today: [new Date()],
    30: [new Date(), addDays(30)],
    60: [addDays(31), addDays(60)],
    90: [addDays(61), addDays(90)],
    91: [addDays(90)],
    overdue: [null, addDays(-1)],
    custom: [startRangeDate, endRangeDate],
  };

  const filteredResult = filterList.filter(
    (item) => !item.childIds.length && item.parentId && item.checked
  );

  const vendorsList = filterList
    .filter((item) => item.field === "ProgramName" && item.checked && item.childIds.length)
    .map((item) => ({ ...item, field: "VendorName" }));
    
  const filterRequestList = [...filteredResult,...vendorsList];

  const uniqueFieldList = [
    ...new Set(filterRequestList.map((item) => item.field)),
  ];

  const POSTDATA = uniqueFieldList.reduce(
    (ac, field) => ({
      ...ac,
      [field]: mapMultipleValues(field, filterRequestList),
    }),
    {}
  );
  
  const postDataWithDate = {
    ...POSTDATA,
    ...mapToObject(MAP_OPTIONS[dateSelected]),
    "WithPaginationInfo":true,
    "Details":false,
    "Type":["Renewal"],   
  };
  return postDataWithDate;
}
