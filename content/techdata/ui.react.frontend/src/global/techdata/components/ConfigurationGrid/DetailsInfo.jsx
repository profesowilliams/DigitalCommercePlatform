import { useEffect, useState } from 'react';
import React from 'react';

function QuoteDetailsLink({ configDetailUrl, quote }) {
  return (
    <a
      className="cmp-grid-url-underlined"
      href={
        configDetailUrl?.replace('{id}', quote.id)
      }
    >
      {quote.id}
    </a>
  );
}

function ShowMore({ statusConfiguration, quote, configDetailUrl, label, content, buttonIcon, buttonLabel }) {
  const invokeModalAction = () => {alert(1)}
  return (
    <div className='cmp-show-more'>
      <div className='cmp-show-more__content'>
        <div></div>
        <div>
          {quote.status === "Expired" && <div><QuoteDetailsLink quote={quote} configDetailUrl={configDetailUrl}></QuoteDetailsLink></div>}
          {content}
        </div>

        <div className='cmp-modal_footer'>
          {statusConfiguration.buttonLabel && <button className='cmp-modal_btn' onClick={invokeModalAction}>
            <span className='cmp-modal_btn_text'>
              <i className={`cmp-modal_btn-icon ${statusConfiguration.buttonIcon}`}></i>
              {statusConfiguration.buttonLabel}
            </span>
          </button>}
        </div>
      </div>
    </div>
  );
}

function QuoteItem({ line, configDetailUrl, statusLabelsList, quote }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {}, []);
  function onExpandCollapse() {
    setExpanded(!expanded);
  }
  const status = statusLabelsList.find((label) => label.labelKey === quote.status);
  return (
    <div>
      <div className='cmp-details-info__line'>
        <div>
          {status && <div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
            <span className={`icon ${expanded ? 'expanded' : ''}`}>
              {' '}
              <i className='fas fa-chevron-right'></i>
            </span>
          </div>}
        </div>
        <div className='date'>{quote.created ? new Date(quote.created).toLocaleDateString() : 'N/A'}</div>
        <div className="id">
          {!status ? (
            <QuoteDetailsLink quote={quote} configDetailUrl={configDetailUrl}></QuoteDetailsLink>
          ) : (
            status?.labelValue
          )}
        </div>
        <div className='value'>{line.currencySymbol ? line.currencySymbol : '$' + '' + quote.price}</div>
      </div>
      {expanded && <ShowMore statusConfiguration={status} quote={quote} configDetailUrl={configDetailUrl} label={status?.labelValue} content={status?.labelDescription}></ShowMore>}
    </div>
  );
}

function DetailsInfo({ line, info, statusLabelsList, configDetailUrl }) {
  return (
    <section>
      <div className='cmp-grid cmp-details-info'>
        <div className='cmp-details-info__info'>{info}</div>
        <div className='cmp-details-info__lines'>
          {line.quotes.map((quote, index) => {
            return (
              <QuoteItem key={index} line={line} quote={quote} index={index} configDetailUrl={configDetailUrl} statusLabelsList={statusLabelsList}></QuoteItem>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default DetailsInfo;
