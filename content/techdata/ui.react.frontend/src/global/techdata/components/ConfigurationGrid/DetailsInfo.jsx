import { useEffect, useState } from 'react';
import React from 'react';

function ShowMore({ label, content }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {}, []);
  function onExpandCollapse() {
    setExpanded(!expanded);
  }
  const buttonIcon = 'fas fa-download';
  const buttonLabel = 'Duplicate';
  const invokeModalAction = () => {alert(1)}
  return (
    <div className='cmp-show-more'>
      <div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
        <span className={`icon ${expanded ? 'expanded' : ''}`}>
          {' '}
          <i className='fas fa-chevron-right'></i>
        </span>
      </div>
      {expanded ? <div className='cmp-show-more__content'>{content}

          {true ? (
            <div className='cmp-modal_footer'>
              <button className='cmp-modal_btn' onClick={invokeModalAction}>
                <span className='cmp-modal_btn_text'>
                  <i className={`cmp-modal_btn-icon ${buttonIcon}`}></i>
                  {buttonLabel}
                </span>
              </button>
            </div>
          ) : null}
          </div> : null}
    </div>
  );
}

function DetailsInfo({ line, info, statusLabelsList, configDetailUrl }) {
  return (
    <section>
      <div className='cmp-details-info'>
        <div className='cmp-details-info__info'>{info}</div>
        <div className='cmp-details-info__lines'>
          {line.quotes.map((quote, index) => {
            const status = statusLabelsList.find((label) => label.labelKey === quote.status);
            return (
            <div className='cmp-details-info__line' key={index}>
              <ShowMore label={status?.labelValue} content={status?.labelDescription}></ShowMore>
              <div className='date'>{quote.created ? new Date(quote.created).toLocaleDateString() : 'N/A'}</div>
              <div className={`id ${quote.status !== 'Pending' ? 'ongoing' : 'pending'}`}>
                {quote.status !== 'Pending' ? (
                  <a
                    className="cmp-grid-url-underlined"
                    href={
                      configDetailUrl?.replace('{id}', quote.id)
                    }
                  >
                    {quote.id}
                  </a>
                ) : (
                  status?.labelValue
                )}
              </div>
              <div className='value'>{line.currencySymbol + '' + quote.price}</div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default DetailsInfo;
