import React, { useState } from "react";

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
		<div>
			<div>
				

				<div className='cmp-show-more'>
					<div className='cmp-show-more__label' onClick={() => onExpandCollapse()}>
					{expanded ? 
						(<div className='cmp-show-more__content'>
							{content}
						</div>) : null}
					</div>	
				</div>
			</div>
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
 const InvoiceRowComponent = ({tracking, label, pendingInfo, trackingIcons, pendingValue, showMoreFlag = false}) => {
	const [expanded, setExpanded] = useState(false);
	function onExpandCollapse() {
		if (showMoreFlag) {
			setExpanded(!expanded);
		}
	}

	const getIcon = (carrier) => {
		let iconFound = undefined;
		iconFound = trackingIcons.find(trackingIconItem => {
			return trackingIconItem.carrier == carrier;
		})
		return iconFound ? (iconFound.logoPath ? iconFound.logoPath : "") : "" ;
	}

	const trackingStatus = tracking.trackingNumber ? "In Transit" : "Pending"; // dev validation need to resolve when the data are available
	
	return(
		<div className="cmp-track-my-order-modal">
			<div className="cmp-track-my-order-modal__line">
				<div className="cmp-track-my-order-modal__line__show-more">
					<div className="cmp-track-my-order-modal__line__show-more__label" onClick={() => onExpandCollapse()}>
					<span className={`cmp-track-my-order-modal__line__show-more__label__icon ${expanded ? 'expanded' : ''} `}>
						<i className="fas fa-chevron-right"></i>
					</span>
					</div>
				</div>
				<div className="cmp-track-my-order-modal__line__logo">
					{getIcon(tracking.carrier) ?
					<img src={getIcon(tracking.carrier)} />
						: tracking.carrier}
				</div>
				<div className="cmp-track-my-order-modal__line__tracking-number">
					<a href={tracking.trackingLink}>{tracking.trackingNumber ?? "Pending"}</a>
				</div>
				<div className="cmp-track-my-order-modal__line__status">
					{trackingStatus}
				</div>
			</div>

			<ShowMore expanded={expanded} label={label} onExpandCollapse={onExpandCollapse} content={pendingInfo}></ShowMore>
		</div>
		
	);
};


function MyOrderTrackings({ tracking, trackingIcons, pendingInfo, info, showMoreFlag }) {
	return(
		<div>
			
			<InvoiceRowComponent 
				tracking={tracking}
				index={0}
				label={'pendingLabel'}
				trackingIcons={trackingIcons}
				pendingInfo={pendingInfo}
				showMoreFlag={showMoreFlag}
			/>
		</div>
		
	)
}
export default MyOrderTrackings;
