import { useState } from 'react';
import React from 'react';

/**
 * 
 * @param {Object} props
 * @param {string} props.label
 * @param {any} props.content
 * @param {() => void} props.onExpandCollapse
 * @param {boolean} props.expanded 
 * @returns 
 */
function ShowMore({ label, content, onExpandCollapse, expanded }) {
	return (
		<div className='cmp-show-more'>
			<div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
				{label}{' '}
			</div>
			{expanded ? <div className='cmp-show-more__content'>{content}</div> : null}
		</div>
	);
}

/**
 * 
 * @param {Object} props 
 * @param {any} props.invoice
 * @param {string} props.label
 * @param {string} props.pendingLabel
 * @param {number} props.index
 * @param {any} props.pendingInfo
 * @param {any} props.line
 * @param {any} props.invokeAction
 * @returns 
 */
const InvoiceRowComponent = ({invoice, index, label, pendingInfo, line, invokeAction, pendingValue}) => {
	const [expanded, setExpanded] = useState(false);
	function onExpandCollapse() {
		setExpanded(!expanded);
	}
	
	return(
		<div
			className='cmp-details-info__line'
			style={{'grid-template-columns': '5% 25% 40% 25%'}}
			key={index}
		>
			{invoice.id === pendingValue ? (
				<div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
					<span style={{'marginTop': '0.3rem'}} className={`icon ${expanded ? 'expanded' : ''}`}>
						{' '}
						<i className='fas fa-chevron-right'></i>
					</span>
				</div>
			) : <div></div>}
			
			<div className='date'>{invoice.created ? new Date(invoice.created).toLocaleDateString() : 'N/A'}</div>
			<div className={`id ${invoice.id !== pendingValue ? 'ongoing' : 'pending'}`}>
				{invoice.id !== pendingValue ? (
					<div onClick={async() => await invokeAction(invoice.id, line.id)}>
							{invoice.id}
					</div>
				) : (
					<ShowMore expanded={expanded} label={label} onExpandCollapse={onExpandCollapse} content={pendingInfo}></ShowMore>
				)}
			</div>
			<div className='value'>{line.currencySymbol + '' + invoice.price}</div>
		</div>
	);
};

/**
 * @param {Object} props
 * @param {any} props.line
 * @param {string} props.info
 * @param {string} props.pendingInfo
 * @param {string} props.pendingLabel
 * @param {(id) => void} props.downloadInvoiceFunction
 */
function DetailsInfo({ line, info, pendingInfo, pendingLabel, downloadInvoiceFunction, pendingValue }) {

	const invokeAction = async (id, orderId) => {
		if (typeof downloadInvoiceFunction === "function") {
			await downloadInvoiceFunction(id, orderId);
		}
	};

	return (
		<section>
			<div className='cmp-details-info'>
				<div className='cmp-details-info__info'>{info}</div>
				<div className='cmp-details-info__lines'>
					{line.invoices.map((invoice, index) => (
						<InvoiceRowComponent 
							invoice={invoice}
							index={index}
							label={pendingLabel}
							invokeAction={invokeAction}
							pendingInfo={pendingInfo}
							line={line}
							pendingValue={pendingValue}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default DetailsInfo;
