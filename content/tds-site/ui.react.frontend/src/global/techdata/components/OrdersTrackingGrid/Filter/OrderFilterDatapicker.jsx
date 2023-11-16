import React, { useState, useRef } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates-gte-react-17';
import 'react-dates-gte-react-17/initialize';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';
import OrderFilterDateType from './OrderFilterDateType';
import { getDateRangeLabel } from '../utils/orderTrackingUtils';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function CustomStartEndText({ filterLabels }) {
  return (
    <div className="customStartEndLabel">
      <div className="customStartLabel">{getDictionaryValueOrKey(filterLabels.startLabel)}</div>
      <div className="customEndLabel">{getDictionaryValueOrKey(filterLabels.endLabel)}</div>
    </div>
  );
}

export default function OrderFilterDatePicker({
  filtersRefs,
  filterLabels,
  filterDateOptions,
}) {
  const [focusedInput, setFocusedInput] = useState('startDate');
  const {
    setDateType,
    setDateRangeFiltersChecked,
    setPredefinedFiltersSelectedAfter,
    setFilterClicked,
    setAreThereAnyFiltersSelectedButNotApplied,
    setCurrentStartDate,
    setCurrentEndDate,
  } = useOrderTrackingStore((state) => state.effects);
  const dateType = useOrderTrackingStore((state) => state.filter.dateType);
  const { dateFormat, datePlaceholder } = filterLabels;

  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const currentStartDate = useOrderTrackingStore(
    (state) => state.filter.currentStartDate
  );
  const currentEndDate = useOrderTrackingStore(
    (state) => state.filter.currentEndDate
  );
  const dark_teal = '#003031';
  const navIcons = {
    navPrev: <ChevronLeftIcon fill={dark_teal} />,
    navNext: <ChevronRightIcon fill={dark_teal} />,
  };

  const startDateFormatted = useRef('');
  const endDateFormatted = useRef('');

  const onChangeRadio = (value) => {
    setDateType(value);
    setDateRefs(startDateFormatted.current, endDateFormatted.current, value);
    if (currentStartDate && currentEndDate) {
      setDateRangeFiltersChecked([]);
      setPredefinedFiltersSelectedAfter([
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...dateRangeFiltersChecked,
      ]);
      setCurrentStartDate(undefined);
      setCurrentEndDate(undefined);
      setFilterClicked(true);
      setAreThereAnyFiltersSelectedButNotApplied();
      filtersRefs.current.createdFrom = undefined;
      filtersRefs.current.createdTo = undefined;
    }
  };

  const resetFilters = () => {
    filtersRefs.current.createdFrom = undefined;
    filtersRefs.current.createdTo = undefined;
    filtersRefs.current.shippedDateFrom = undefined;
    filtersRefs.current.shippedDateTo = undefined;
    filtersRefs.current.invoiceDateFrom = undefined;
    filtersRefs.current.invoiceDateTo = undefined;
  };

  const setDateRefs = (startDateFormatted, endDateFormatted, typeOfDate) => {
    if (typeOfDate === filterDateOptions[0].key) {
      resetFilters();
      filtersRefs.current.createdFrom = startDateFormatted;
      filtersRefs.current.createdTo = endDateFormatted;
    } else if (typeOfDate === filterDateOptions[1].key) {
      resetFilters();
      filtersRefs.current.shippedDateFrom = startDateFormatted;
      filtersRefs.current.shippedDateTo = endDateFormatted;
    } else if (typeOfDate === filterDateOptions[2].key) {
      resetFilters();
      filtersRefs.current.invoiceDateFrom = startDateFormatted;
      filtersRefs.current.invoiceDateTo = endDateFormatted;
    }
  };

  const setFilterDate = (startDate, endDate) => {
    if (startDate && endDate) {
      const startDateMonth = startDate.format('MM');
      const startDateDay = startDate.format('DD');
      const startDateYear = startDate.format('YYYY');
      startDateFormatted.current = `${startDateYear}-${startDateMonth}-${startDateDay}`;
      const endDateMonth = endDate.format('MM');
      const endDateDay = endDate.format('DD');
      const endDateYear = endDate.format('YYYY');
      endDateFormatted.current = `${endDateYear}-${endDateMonth}-${endDateDay}`;
      const dateLabel = getDateRangeLabel(startDate, endDate);
      const newDate = [
        {
          id: 1,
          filterOptionLabel: dateLabel,
          group: 'date',
          createdFrom: `${startDateYear}-${startDateMonth}-${startDateDay}`,
          createdTo: `${endDateYear}-${endDateMonth}-${endDateDay}`,
          dateType,
        },
      ];
      setDateRangeFiltersChecked(newDate);
      setPredefinedFiltersSelectedAfter([
        ...orderStatusFiltersChecked,
        ...orderTypeFiltersChecked,
        ...newDate,
      ]);

      setDateRefs(
        startDateFormatted.current,
        endDateFormatted.current,
        dateType
      );
    } else {
      setDateRangeFiltersChecked([]);
    }
  };

  const onDatesChange = ({ startDate, endDate }) => {
    startDate && setCurrentStartDate(startDate?.toISOString());
    endDate && setCurrentEndDate(endDate?.toISOString());
    !startDate && setCurrentStartDate(undefined);
    !endDate && setCurrentEndDate(undefined);
    setFilterClicked(true);
    setFilterDate(startDate, endDate);
    setAreThereAnyFiltersSelectedButNotApplied();
  };
  return (
    <>
      <OrderFilterDateType
        onChangeRadio={onChangeRadio}
        options={filterDateOptions}
        dateType={dateType}
      />
      <CustomStartEndText filterLabels={filterLabels} />
      <div className="order_datapicker">
        <DateRangePicker
          startDate={currentStartDate ? moment(currentStartDate) : null}
          startDateId="start-date"
          startDatePlaceholderText={getDictionaryValueOrKey(datePlaceholder)}
          endDatePlaceholderText={getDictionaryValueOrKey(datePlaceholder)}
          endDate={currentEndDate ? moment(currentEndDate) : null}
          {...navIcons}
          minimumNights={0}
          endDateId="end-date"
          verticalHeight={280}
          showDefaultInputIcon={true}
          customArrowIcon={<div className="customHyphen"></div>}
          reopenPickerOnClearDates
          keepOpenOnDateSelect={true}
          onDatesChange={onDatesChange}
          isOutsideRange={() => false}
          numberOfMonths={1}
          displayFormat="MM/DD/YYYY"
          // displayFormat={getDictionaryValueOrKey(dateFormat)} // TODO make dateformat translatable
          noBorder={true}
          regular={false}
          transitionDuration={300}
          daySize={30}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => {
            const start = document.querySelector('#start-date').value;
            const end = document.querySelector('#end-date').value;
            if (['startDate', 'endDate'].includes(focusedInput)) {
              setFocusedInput(focusedInput);
            } else if (!focusedInput && start === '') {
              setFocusedInput('startDate');
            } else if (end === '') {
              setFocusedInput('endDate');
            } else {
              setFocusedInput('startDate');
            }
          }}
        />
      </div>
    </>
  );
}
