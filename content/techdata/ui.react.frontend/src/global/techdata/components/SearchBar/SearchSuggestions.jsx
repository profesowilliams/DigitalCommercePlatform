import React from 'react';
import SearchRefinements from './SearchRefinements'

const SearchSuggestions = ({ suggestionsList, getSearchUrl }) => {
  if (!suggestionsList) {
    return null;
  }
  return (
    <ul className="cmp-searchsuggestions">
      {suggestionsList && suggestionsList.map((suggestion, index) => {
        return (
          <li className="cmp-searchsuggestions__suggestion" key={index}>
            <a className="cmp-searchsuggestions__link" href={getSearchUrl(suggestion.Keyword)}>
              {suggestion.Keyword}
            </a>

            <SearchRefinements refinements={suggestion.Refinements} getSearchUrl={getSearchUrl}></SearchRefinements>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchSuggestions;
