import React from 'react';
import SearchRefinements from './SearchRefinements'

const SearchSuggestions = ({ suggestionsList, getTypeAheadSearchUrl }) => {
  if (!suggestionsList) {
    return null;
  }
  return (
    <ul className="cmp-searchsuggestions">
      {suggestionsList && suggestionsList.map((suggestion, index) => {
        return (
          <li className={`cmp-searchsuggestions__suggestion ${suggestion.Refinements?.length > 0 ? "cmp-searchsuggestions__suggestion-withRefinement" : ""}`} key={index}>
            <a className="cmp-searchsuggestions__link" href={getTypeAheadSearchUrl(suggestion.Keyword, index)}>
              {suggestion.Keyword}
            </a>

            <SearchRefinements originalKeyword={suggestion.Keyword} refinements={suggestion.Refinements} itemIndex={index} getTypeAheadSearchUrl={getTypeAheadSearchUrl}></SearchRefinements>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchSuggestions;
