import React, { useState, useRef } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDateRangeLabel } from '../utils/orderTrackingUtils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function CustomStartEndText({ start, end }) {
  return (
    <div className="customStartEndLabel">
      <div>{getDictionaryValueOrKey(start)}</div>
      <div>{getDictionaryValueOrKey(end)}</div>
    </div>
  );
}

export default function OrderFilterCustomDatapicker({
  filtersRefs,
  customDateId,
  filterLabels,
}) {
  const [focusedInput, setFocusedInput] = useState('startDate');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const dark_teal = '#003031';
  const navIcons = {
    navPrev: <ChevronLeftIcon fill={dark_teal} />,
    navNext: <ChevronRightIcon fill={dark_teal} />,
  };

  const customFiltersChecked = useOrderTrackingStore(
    (state) => state.customFiltersChecked
  );
  const { setCustomFiltersChecked, setCustomizedFiltersSelectedAfter } =
    useOrderTrackingStore((state) => state.effects);

  const startDateFormatted = useRef('');
  const endDateFormatted = useRef('');

  const momentCustomStartDate = customStartDate
    ? moment(customStartDate)
    : null;
  const momentCustomEndDate = customEndDate ? moment(customEndDate) : null;

  const resetFilters = () => {
    filtersRefs.createdFrom.current = undefined;
    filtersRefs.createdTo.current = undefined;
    filtersRefs.shippedDateFrom.current = undefined;
    filtersRefs.shippedDateTo.current = undefined;
    filtersRefs.invoiceDateFrom.current = undefined;
    filtersRefs.invoiceDateTo.current = undefined;
  };

  const setDateRefs = (startDateFormatted, endDateFormatted) => {
    resetFilters();
    filtersRefs.createdFrom.current = startDateFormatted;
    filtersRefs.createdTo.current = endDateFormatted;
  };

  const setFilterDate = (startDate, endDate) => {
    const updateDate = (obj, label, startDate, endDate) => {
      obj.startDate = startDate?.toDate();
      obj.endDate = endDate?.toDate();
      obj.dataRangeLabel = label;
    };
    const dateLabel = getDateRangeLabel(startDate, endDate);
    let newList = customFiltersChecked;
    newList.map((custom) => {
      custom.id === customDateId &&
        updateDate(custom, dateLabel, startDate, endDate);
    });
    setCustomFiltersChecked([...newList]);
    setCustomizedFiltersSelectedAfter(structuredClone(newList));
    if (startDate && endDate) {
      const startDateMonth = startDate.format('MM');
      const startDateDay = startDate.format('DD');
      const startDateYear = startDate.format('YYYY');

      const endDateMonth = endDate.format('MM');
      const endDateDay = endDate.format('DD');
      const endDateYear = endDate.format('YYYY');
      startDateFormatted.current = `${startDateYear}-${startDateMonth}-${startDateDay}`;
      endDateFormatted.current = `${endDateYear}-${endDateMonth}-${endDateDay}`;

      setDateRefs(startDateFormatted.current, endDateFormatted.current);
    }
  };

  const onDatesChange = ({ startDate, endDate }) => {
    setCustomStartDate(startDate?.toISOString() || undefined);
    setCustomEndDate(endDate?.toISOString() || undefined);
    if ((startDate, endDate)) {
      setFilterDate(startDate, endDate);
    }
  };

  return (
    <>
      <CustomStartEndText
        start={filterLabels.startLabel}
        end={filterLabels.endLabel}
      />
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
          onFocusChange={(focusedInput) => {
            setFocusedInput(focusedInput || 'startDate');
          }}
        />
      </div>
    </>
  );
}
