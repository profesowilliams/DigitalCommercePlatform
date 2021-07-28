import React, { useState } from 'react';

const SearchRefinements = ({ originalKeyword, refinements, itemIndex, getTypeAheadSearchUrl }) => {
  if (!refinements) {
    return null;
  }
  return (
    <ul className="cmp-searchrefinements">
      {refinements.map((refinement, index) => {
        const descriptionItems = refinement.Description.split(' > ');

        return (
          <li className="cmp-searchrefinements__refinement" key={index}>
            <a className="cmp-searchrefinements__link" href={getTypeAheadSearchUrl(originalKeyword, itemIndex, refinement.RefinementId)}>
              {descriptionItems.map((item, index) => {
                return (
                  <>
                    <span key={index} className="cmp-searchrefinements__item">{`in ${item}`}</span>
                    <i className="cmp-searchrefinements__item-icon fas	fa-chevron-right"></i>
                  </>
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
