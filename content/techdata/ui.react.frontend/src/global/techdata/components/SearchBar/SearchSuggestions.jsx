import React from 'react';
import SearchRefinements from './SearchRefinements'

const SearchSuggestions = ({ suggestionsList, getTypeAheadSearchUrl, handlerAnalyticEvent }) => {
  if (!suggestionsList) {
    return null;
  }

  /**
   * 
   * Event to handler the analytic
   * data recolected by the searchBar component
   * @param {string} searchString 
   */
  const analyticEventHandler = (searchString) => {
    const splitParams = searchString.split(' ');
    const searchTearm = splitParams[0];
    const categoryTearm = splitParams[1];
    handlerAnalyticEvent(searchTearm, categoryTearm, 1);
  };

  return (
    <ul className="cmp-searchsuggestions">
      {suggestionsList && suggestionsList.map((suggestion, index) => {
        return (
          <li
            onClick={() => analyticEventHandler(suggestion.Keyword)}
            className={`cmp-searchsuggestions__suggestion ${suggestion.Refinements?.length > 0 ? "cmp-searchsuggestions__suggestion-withRefinement" : ""}`}
            key={index}
          >
            <a className="cmp-searchsuggestions__link" href={getTypeAheadSearchUrl(suggestion.Keyword, index)}>
              {suggestion.Keyword}
            </a>

            <SearchRefinements 
              originalKeyword={suggestion.Keyword} 
              refinements={suggestion.Refinements}
              itemIndex={index}
              getTypeAheadSearchUrl={getTypeAheadSearchUrl}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default SearchSuggestions;
