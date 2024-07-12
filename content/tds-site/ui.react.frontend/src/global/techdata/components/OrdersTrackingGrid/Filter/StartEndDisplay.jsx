import React from 'react';

export default function StartEndDisplay({ translations, startDate, endDate }) {
  return (
    <div className="start-end-display">
      <div className="start-end-display__start">
        <div className="start-end-display__start__label">
          {translations?.Start}
        </div>
        <div className="start-end-display__start__date">
          {startDate ? startDate : '-'}
        </div>
      </div>
      <div className="start-end-display__hyphen"></div>
      <div className="start-end-display__end">
        <div className="start-end-display__end__label">
          {translations?.End}
        </div>
        <div className="start-end-display__end__date">
          {endDate ? endDate : '-'}
        </div>
      </div>
    </div>
  );
}