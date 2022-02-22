import React, { useState, useRef } from "react";
import { handlerAnalyticsClearClickEvent } from "../../../../utils/dataLayerUtils";
import { isNotEmptyValue } from "../../../../utils/utils";
import Button from "../Widgets/Button";

/**
 * 
 * @param {Object} props
 * @param {string} props.label
 * @param {any} props.componentProp
 * @param {JSX.Element} props.Filters
 * @param {({queryString: string}) => void} props.onSearchRequest
 * @param {() => void} props.onClearRequest
 * @param {JSX.Element} props.HeaderButtonOptions
 * @param {JSX.Element} props.ButtonsComponentHeader
 * @param {string} props.category
 * @returns 
 */
function GridSearchCriteria({
  label,
  componentProp,
  Filters,
  onSearchRequest,
  onClearRequest,
  HeaderButtonOptions,
  ButtonsComponentHeader,
  uiServiceEndPoint,
  category = '',
  handleClickOptionsButton,
  labelFilterGrid,
  flagOpenOrder,
}) {
	const filter = useRef(null);
	const analyticsData = useRef(null); // ref for the analytics data to adobeData layer in case of be necessary
	let [filterActive, setFilterActive] = useState(false);
	const [externalFilterActive, setExternalFilterActive] = useState(false);
	const [reset, setReset] = useState(false);
	const [expanded, setExpanded] = useState(true); // Forcing to be open in the first load
	const flagOpenButton = HeaderButtonOptions !== null ? true : false; // Prop from config data 
	function isEmptyOrSpaces(str) {
		return str === null || str.match(/^ *$/) !== null;
	}

  function handleChange(change, analyticObject) {
    if (change && !isEmptyOrSpaces(change)) {
      filter.current = change;
	  analyticsData.current = analyticObject;
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }

  function onSearch() {
    if (typeof onSearchRequest === "function" && filter.current) {
		onSearchRequest(
			isNotEmptyValue(analyticsData.current) ?
				{ queryString: filter.current, analyticsData: analyticsData.current } :
				{ queryString: filter.current }
		);
    }
  }

	function onClear() {
		if (typeof onClearRequest === 'function') {
			onClearRequest();
			handlerAnalyticsClearClickEvent(category)	// Analytic event handler
		}
		setReset(!reset);
		setFilterActive(false);
		setExternalFilterActive(false)
	}

	return (
		<div className={`cmp-search-criteria ${expanded ? 'cmp-search-criteria--expanded' : 'option-button-container'}  `}>
			<div className={'cmp-search-criteria__content-header'}>
				<div
					className='cmp-search-criteria__header'
					onClick={() => {
						setExpanded(!expanded);
					}}
				>	
					<i className='fas fa-sliders-h'></i>
					<div className='cmp-search-criteria__header__title'>{label ?? 'Filter'}</div>
				</div>
        
			<div
				onClick={() => {
					setExpanded(!expanded);
				}}
			className={` ${!flagOpenButton && expanded ? 'hidden' : ''}`}>
				{
				ButtonsComponentHeader ? (<ButtonsComponentHeader 
											handleChange={handleChange}
											onSearch={onSearch}
											expanded={flagOpenOrder}
											onClear={onClear}
											labelFilterGrid={labelFilterGrid}
											handleClickOptionsButton={handleClickOptionsButton}
										 />) : null  
				}
			</div>
        
			
      </div>
			<div className={`cmp-search-criteria__content  ${!expanded ? 'cmp-search-criteria__content--hidden' : ''}`}>
				<div className='cmp-search-criteria__content__query-input'>
					<Filters
						key={reset}
						componentProp={componentProp}
						onSearch={onSearch}
						onQueryChanged={(query, analyticObject) => handleChange(query, analyticObject)}
						setFilterActive={setFilterActive}
						setExternalFilterActive={setExternalFilterActive}
						onKeyPress={(isEnter) => isEnter && onSearch()}
						onSearchRequest={onSearchRequest}
						uiServiceEndPoint={uiServiceEndPoint}
						onClear={onClear}
						HeaderButtonOptions={HeaderButtonOptions}
						expanded={expanded}
						setExpanded={setExpanded}
						handleClickOptionsButton={handleClickOptionsButton}
					></Filters>
				</div>
				<div className='cmp-search-criteria__content__query-input__search'>
					<Button disabled={!filterActive && !externalFilterActive} onClick={() => onSearch()}>
						{componentProp?.searchButtonLabel ?? 'Apply'}
					</Button>
					<div className='cmp-search-criteria__content__query-input__search__clear' onClick={() => onClear()}>
						{componentProp?.clearButtonLabel ?? 'Clear All Filters'}
					</div>
					
				</div>
			</div>			
		</div>
	);
}

export default GridSearchCriteria;
