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
      <div className="customStartLabel">
        {getDictionaryValueOrKey(filterLabels.startLabel)}
      </div>
      <div className="customEndLabel">
        {getDictionaryValueOrKey(filterLabels.endLabel)}
      </div>
    </div>
  );
}

export default function OrderFilterDatePicker({ filtersRefs, filterLabels }) {
  const [focusedInput, setFocusedInput] = useState('startDate');
  const {
    setDateType,
    setDateRangeFiltersChecked,
    setPredefinedFiltersSelectedAfter,
    setFilterClicked,
    setAreThereAnyFiltersSelectedButNotApplied,
  } = useOrderTrackingStore((state) => state.effects);
  const dateType = useOrderTrackingStore((state) => state.filter.dateType);
  const { orderDateLabel, shipDateLabel, invoiceDateLabel, addDateLabel } =
    filterLabels;

  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const dateRangeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.dateRangeFiltersChecked
  );
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.filter.orderTypeFiltersChecked
  );
  const dark_teal = '#003031';
  const navIcons = {
    navPrev: <ChevronLeftIcon fill={dark_teal} />,
    navNext: <ChevronRightIcon fill={dark_teal} />,
  };

  const startDateFormatted = useRef('');
  const endDateFormatted = useRef('');
  const orderDate = getDictionaryValueOrKey(orderDateLabel);
  const shipDate = getDictionaryValueOrKey(shipDateLabel);
  const invoiceDate = getDictionaryValueOrKey(invoiceDateLabel);
  const [currentStartDate, setCurrentStartDate] = useState(null);
  const [currentEndDate, setCurrentEndDate] = useState(null);

  const onChangeRadio = (ev) => {
    setDateType(ev.target.value);
    setDateRefs(
      startDateFormatted.current,
      endDateFormatted.current,
      ev.target.value
    );
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
    if (typeOfDate === orderDate) {
      resetFilters();
      filtersRefs.current.createdFrom = startDateFormatted;
      filtersRefs.current.createdTo = endDateFormatted;
    } else if (typeOfDate === shipDate) {
      resetFilters();
      filtersRefs.current.shippedDateFrom = startDateFormatted;
      filtersRefs.current.shippedDateTo = endDateFormatted;
    } else if (typeOfDate === invoiceDate) {
      resetFilters();
      filtersRefs.current.invoiceDateFrom = startDateFormatted;
      filtersRefs.current.invoiceDateTo = endDateFormatted;
    }
  };

  const setFilterDate = (startDate, endDate) => {
    const startDateMonth = startDate.format('MM');
    const startDateDay = startDate.format('DD');
    const startDateYear = startDate.format('YYYY');

    const endDateMonth = endDate.format('MM');
    const endDateDay = endDate.format('DD');
    const endDateYear = endDate.format('YYYY');
    startDateFormatted.current = `${startDateYear}-${startDateMonth}-${startDateDay}`;
    endDateFormatted.current = `${endDateYear}-${endDateMonth}-${endDateDay}`;
    if (startDate && endDate) {
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
    }
  };

  const onDatesChange = ({ startDate, endDate }) => {
    startDate && setCurrentStartDate(startDate?.toISOString());
    endDate && setCurrentEndDate(endDate?.toISOString());
    if (startDate && endDate) {
      setFilterDate(startDate, endDate);
      setFilterClicked(true);
      setAreThereAnyFiltersSelectedButNotApplied();
    }
  };

  const translationSwapMonth = (month) => {
    return getDictionaryValueOrKey(filterLabels[months[month]]);
  };

  return (
    <>
      <OrderFilterDateType
        onChangeRadio={onChangeRadio}
        dateType={dateType}
        orderDate={orderDate}
        shipDate={shipDate}
        invoiceDate={invoiceDate}
      />
      <CustomStartEndText filterLabels={filterLabels} />
      <div className="order_datapicker">
        <DateRangePicker
          renderMonthText={(data) => {
            return `${translationSwapMonth(
              data._d.getMonth()
            )} ${data._d.getFullYear()}`;
          }}
          startDate={currentStartDate ? moment(currentStartDate) : null}
          startDateId="start-date"
          startDatePlaceholderText={getDictionaryValueOrKey(addDateLabel)}
          endDatePlaceholderText={getDictionaryValueOrKey(addDateLabel)}
          endDate={currentEndDate ? moment(currentEndDate) : null}
          {...navIcons}
          endDateId="end-date"
          verticalHeight={280}
          showDefaultInputIcon={true}
          customArrowIcon={<div className="customHyphen"></div>}
          reopenPickerOnClearDates
          keepOpenOnDateSelect={true}
          onDatesChange={onDatesChange}
          isOutsideRange={() => false}
          numberOfMonths={1}
          displayFormat="MMM D, YYYY"
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
