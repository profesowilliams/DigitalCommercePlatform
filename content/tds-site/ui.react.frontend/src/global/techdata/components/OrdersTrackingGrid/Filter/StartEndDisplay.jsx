import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

export default function StartEndDisplay({ filterLabels, startDate, endDate }) {
  return (
    <div className="start-end-display">
      <div className="start-end-display__start">
        <div className="start-end-display__start__label">
          {getDictionaryValueOrKey(filterLabels.startLabel)}
        </div>
        <div className="start-end-display__start__date">
          {startDate ? startDate : '-'}
        </div>
      </div>
      <div className="start-end-display__hyphen"></div>
      <div className="start-end-display__end">
        <div className="start-end-display__end__label">
          {getDictionaryValueOrKey(filterLabels.endLabel)}
        </div>
        <div className="start-end-display__end__date">
          {endDate ? endDate : '-'}
        </div>
      </div>
    </div>
  );
}
