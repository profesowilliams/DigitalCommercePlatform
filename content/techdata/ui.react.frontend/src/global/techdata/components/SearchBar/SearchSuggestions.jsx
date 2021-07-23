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
          <li className="cmp-searchsuggestions__suggestion" key={index}>
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
