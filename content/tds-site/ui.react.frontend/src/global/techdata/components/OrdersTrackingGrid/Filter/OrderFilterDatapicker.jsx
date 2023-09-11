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
import { QuerySelector } from 'ag-grid-community';

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
    setCustomState,
    setDateRangeFiltersChecked,
    setPredefinedFiltersSelectedAfter,
    setFilterClicked,
  } = useOrderTrackingStore((state) => state.effects);
  const dateType = useOrderTrackingStore((state) => state.dateType);
  const customStartDate = useOrderTrackingStore(
    (state) => state.customStartDate
  );
  const customEndDate = useOrderTrackingStore((state) => state.customEndDate);
  const orderStatusFiltersChecked = useOrderTrackingStore(
    (state) => state.orderStatusFiltersChecked
  );
  const orderTypeFiltersChecked = useOrderTrackingStore(
    (state) => state.orderTypeFiltersChecked
  );
  const dark_teal = '#003031';
  const navIcons = {
    navPrev: <ChevronLeftIcon fill={dark_teal} />,
    navNext: <ChevronRightIcon fill={dark_teal} />,
  };

  const startDateFormatted = useRef('');
  const endDateFormatted = useRef('');
  const orderDate = getDictionaryValueOrKey(filterLabels.orderDateLabel);
  const shipDate = getDictionaryValueOrKey(filterLabels.shipDateLabel);
  const invoiceDate = getDictionaryValueOrKey(filterLabels.invoiceDateLabel);
  const momentCustomStartDate = customStartDate
    ? moment(customStartDate)
    : null;
  const momentCustomEndDate = customEndDate ? moment(customEndDate) : null;

  const onChangeRadio = (ev) => {
    setDateType(ev.target.value);
    setDateRefs(
      startDateFormatted.current,
      endDateFormatted.current,
      ev.target.value
    );
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
    const dateLabel = getDateRangeLabel(startDate, endDate);
    const newDate = [
      {
        id: 1,
        filterOptionLabel: dateLabel,
        group: 'date',
        createdFrom: startDate?.toDate(),
        createdTo: endDate?.toDate(),
      },
    ];
    setDateRangeFiltersChecked(newDate);
    setPredefinedFiltersSelectedAfter([
      ...orderStatusFiltersChecked,
      ...orderTypeFiltersChecked,
      ...newDate,
    ]);
    if (startDate && endDate) {
      const startDateMonth = startDate.format('MM');
      const startDateDay = startDate.format('DD');
      const startDateYear = startDate.format('YYYY');

      const endDateMonth = endDate.format('MM');
      const endDateDay = endDate.format('DD');
      const endDateYear = endDate.format('YYYY');
      startDateFormatted.current = `${startDateYear}-${startDateMonth}-${startDateDay}`;
      endDateFormatted.current = `${endDateYear}-${endDateMonth}-${endDateDay}`;

      setDateRefs(
        startDateFormatted.current,
        endDateFormatted.current,
        dateType
      );
      setFilterClicked(true);
    }
  };

  const onDatesChange = ({ startDate, endDate }) => {
    setCustomState({
      key: 'customStartDate',
      value: startDate?.toISOString() || undefined,
    });
    setCustomState({
      key: 'customEndDate',
      value: endDate?.toISOString() || undefined,
    });
    if ((startDate, endDate)) {
      setFilterDate(startDate, endDate);
    }
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
          startDate={momentCustomStartDate}
          startDateId="start-date"
          startDatePlaceholderText={getDictionaryValueOrKey(
            filterLabels.addDateLabel
          )}
          endDatePlaceholderText={getDictionaryValueOrKey(
            filterLabels.addDateLabel
          )}
          endDate={momentCustomEndDate}
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
          onFocusChange={() => {
            const start = document.querySelector('#start-date').value;
            setFocusedInput(start !== '' ? 'endDate' : 'startDate');
          }}
        />
      </div>
    </>
  );
}
