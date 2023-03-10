import { getDictionaryValue } from '../../../../../utils/utils';
export const DATE_DEFAULT_OPTIONS = [
    {
      DueDateFrom: new Date(),
      label: getDictionaryValue("grids.common.label.filterOverdue", "overdue"),
      field: "overdue",
    },
    {
      label: getDictionaryValue("grids.common.label.filterToday", "Today"),
      field: "today",
    },
    {
      label: getDictionaryValue("grids.common.label.filterRange1", "0 - 30 days"),
      field: "30",
    },
    {
      label: getDictionaryValue("grids.common.label.filterRange2", "31 - 60 days"),
      field: "60",
    },
    {
      label: getDictionaryValue("grids.common.label.filterRange3", "61 - 90 days"),
      field: "90",
    },
    {
      label: getDictionaryValue("grids.common.label.filterRange4", "91+ days"),
      field: "91",
    },
    {
      label: getDictionaryValue("grids.common.label.filterCustom", "Custom date range"),
      field: "custom",
    },
  ];