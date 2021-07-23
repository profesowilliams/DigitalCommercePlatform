import React, { useState } from 'react';

const SearchRefinements = ({ refinements, getSearchUrl }) => {
  if (!refinements) {
    return null;
  }
  return (
    <ul className="cmp-searchrefinements">
      {refinements.map((refinement, index) => {
        const descriptionItems = refinement.Description.split(' > ');

        return (
          <li className="cmp-searchrefinements__refinement" key={index}>
            <a className="cmp-searchrefinements__link" href={getSearchUrl('test')}>
              {descriptionItems.map((item, index) => {
                return (
                  <span key={index} className="cmp-searchrefinements__item">{item}</span>
                )
              })}
            </a>
          </li>
        )
      })}
    </ul>
  );
}

export default SearchRefinements;
