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
				{label}{' '}
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

function DetailsInfo({ line, info, pendingInfo, pendingLabel }) {
	return (
		<section>
			<div className='cmp-details-info'>
				<div className='cmp-details-info__info'>{info}</div>
				<div className='cmp-details-info__lines'>
					{line.quotes.map((invoice, index) => (
						<div className='cmp-details-info__line' key={index}>
							<div className='date'>{invoice.created ? new Date(invoice.created).toLocaleDateString() : 'N/A'}</div>
							<div className={`id ${invoice.status !== 'Pending' ? 'ongoing' : 'pending'}`}>
								{invoice.status !== 'Pending' ? (
									invoice.id
								) : (
									<ShowMore label={pendingLabel} content={pendingInfo}></ShowMore>
								)}
							</div>
							<div className='value'>{line.currencySymbol + '' + invoice.price}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default DetailsInfo;
