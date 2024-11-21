import produce from 'immer';
import React, { useEffect } from 'react';
import { If } from '../../../helpers/If';
import { useRenewalGridState } from '../../RenewalsGrid/store/RenewalsStore';
import FilterDatePicker from './FilterDatepicker';
import SubFilter from './SubFilter';
import Count from './Count';
import {
  ANALYTICS_TYPES,
  pushEvent,
} from '../../../../../utils/dataLayerUtils';
import useComputeBranding from '../../../hooks/useComputeBranding';

function Filter({ id }) {
  const filterList = useRenewalGridState((state) => state.filterList);
  const dateSelected = useRenewalGridState((state) => state.dateSelected);
  const { setFilterList } = useRenewalGridState((state) => state.effects);
  const { computeClassName } = useComputeBranding(useRenewalGridState);
  if (!filterList) return null;

  const filter = filterList[id];
  const childIds = filter.childIds;

  const handleFilterClick = ({ target }) => {
    const filtersCopy = produce(filterList, (draft) => {
      if (!('parentId' in filter))
        draft[filter.id].open = !draft[filter.id].open;
      for (let id of childIds) {
        draft[id].open = !draft[id].open;
      }
    });

    setFilterList(filtersCopy);
  };

  const SubFilterList = () => {
    // If the filter title is "Archives", use `id` instead of `childId`
    if (filter.field === 'Archives') {

      return <SubFilter key={id} id={id} />;
    }

    // Otherwise, map over `childIds` as usual
    return childIds.map((childId) => <SubFilter key={childId} id={childId} />);
  };

  const checkCount = (f) => {
    if (dateSelected && f.field === 'date') {
      return 1;
    }
    let c = [];
    let k = 0;
    if (f.childIds.length > 0) {
      f.childIds.forEach((id) => {
        if (filterList[id].childIds.length > 0) {
          filterList[id].childIds.forEach((id) => {
            c.push(id);
          });
          k = c.filter((id) => {
            return filterList[id].checked === true;
          }).length;
        } else {
          k = filterList[filterList[id].parentId].childIds.filter((id) => {
            return filterList[id].checked === true;
          }).length;
        }
      });
    }
    return k === 0 ? null : k;
  };

  return (
    <>
      {filter.field !== 'Archives' ? (
        <>
          <div onClick={handleFilterClick} className="filter-accordion__item">
            <div className="filter-accordion__item--group">
              <p className={`${filter.open ? computeClassName('active') : ''}`}>
                {filter.title}
              </p>
              <Count
                callback={() =>
                  pushEvent(ANALYTICS_TYPES.events.click, {
                    type: ANALYTICS_TYPES.types.button,
                    category: ANALYTICS_TYPES.category.renewalsTableInteraction,
                    name: ANALYTICS_TYPES.name.filterNumberCounter(
                      checkCount(filter)
                    ),
                  })
                }
              >
                {checkCount(filter)}
              </Count>
            </div>
          </div>
          <If condition={filter.field === 'date'}>
            <div className={computeClassName('filter-option__options')}>
              <FilterDatePicker isOpen={filter.open} />
            </div>
          </If>
          {childIds.length > 0 && (
            <div className={computeClassName('filter-option__options')}>
              <SubFilterList />
            </div>
          )}
        </>
      ) : (
        filter.field === 'Archives' && (
          <div
            className={computeClassName(
              'filter-option__options filter-archives'
            )}
          >
            <SubFilterList />
          </div>
        )
      )}
    </>
  );
}

export default Filter;
