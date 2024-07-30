import { useEffect, useState } from 'react';
import React from 'react';
import { QuoteDetailsLink } from './QuotesModals'

function ShowMore({ statusConfiguration, quote, quoteDetailUrl, label, content, buttonIcon, buttonLabel }) {
  const invokeModalAction = () => { console.log("Call the service required for the quote"); }
  return (
    <div className='cmp-show-more'>
      <div className='cmp-show-more__content'>
        <div></div>
        <div className='cmp-modal_quote-details'>
          {quote.status === "Expired" && <div><QuoteDetailsLink label="Quote: " quote={quote} quoteDetailUrl={quoteDetailUrl}></QuoteDetailsLink></div>}
          {content}
        </div>

        <div className='cmp-modal_btn_container'>
          {statusConfiguration?.buttonLabel && <button className='cmp-modal_btn' onClick={invokeModalAction}>
            <span className='cmp-modal_btn_text'>
              <i className={`cmp-modal_btn-icon ${statusConfiguration?.buttonIcon}`}></i>
              {statusConfiguration?.buttonLabel}
            </span>
          </button>}
        </div>
      </div>
    </div>
  );
}

function QuoteItem({ line, quoteDetailUrl, statusLabelsList, quote, alwaysExpanded, extraClass }) {
  const [expanded, setExpanded] = useState(!!alwaysExpanded);
  useEffect(() => {}, []);
  function onExpandCollapse() {
    setExpanded(!expanded);
  }
  const status = statusLabelsList.find((label) => label.labelKey === quote.status);
  return (
    <div>
      <div className={'cmp-details-info__line ' + extraClass}>
        {!alwaysExpanded && <div>
          {status && <div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
            <span className={`icon ${expanded ? 'expanded' : ''}`}>
              {' '}
              <i className='fas fa-chevron-right'></i>
            </span>
          </div>}
        </div>}
        <div className='date'>{quote.created ? new Date(quote.created).toLocaleDateString() : 'N/A'}</div>
        <div className="id">
          {!status ? (
            <QuoteDetailsLink label="Quote: " quote={quote} quoteDetailUrl={quoteDetailUrl}></QuoteDetailsLink>
          ) : (
            status?.labelValue
          )}
        </div>
        <div className='value'>{line.currencySymbol ? line.currencySymbol : '$' + '' + quote.price}</div>
      </div>
      {expanded && <ShowMore statusConfiguration={status} quote={quote} quoteDetailUrl={quoteDetailUrl} label={status?.labelValue} content={status?.labelDescription}></ShowMore>}
    </div>
  );
}

function QuoteDetailsInfo({ line, info, statusLabelsList, quoteDetailUrl, alwaysExpanded }) {
  const singleVsMultipleClassName = 'cmp-details-info__lines' + (line.quotes.length > 1 ? '--multiple' : '--single');

  return (
    <section>
      <div className='cmp-grid cmp-details-info'>
        <div className='cmp-details-info__info'>{info}</div>
        <div className='cmp-details-info__lines'>
          {line.quotes.map((quote, index) => {
            return (
              <QuoteItem
                key={index}
                line={line}
                quote={quote}
                index={index}
                quoteDetailUrl={quoteDetailUrl}
                statusLabelsList={statusLabelsList}
                alwaysExpanded={alwaysExpanded}
                extraClass={singleVsMultipleClassName}
              ></QuoteItem>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default QuoteDetailsInfo;
