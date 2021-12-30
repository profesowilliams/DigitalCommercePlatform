import React, { useState } from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";


function FilterTags() {
  const [showMore, setShowMore] = useState(false);
  const { filterList, effects } = useRenewalGridState();
  const { setFilterList } = effects;
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const isOneChecked = (filters, filter) =>
    filters[filter.parentId].childIds.some((id) => {
      return filters[id].checked === true;
    });
  const handleTagsCloseClick = (filter) => {
    const filtersCopy = [...filterList];
    filtersCopy.forEach((f) => {
      if (f.id === filter.id) {
        f["checked"] = false;
      }
    });

    /**
     * to handle checkbox logic for nested accordion when u interact with tags.
     */
    if (filter.childIds.length === 0 && "parentId" in filter) {
      const oneChecked = isOneChecked(filtersCopy, filter);

      const parent = filtersCopy[filter.parentId];
      if (!oneChecked && "parentId" in parent) {
        parent.checked = false;
        // close only nested children
        parent.childIds.map((id) => {
          return (filtersCopy[id].open = false);
        });
      }
    }

    setFilterList(filtersCopy);
  };

  return (
    <div className={`filter-tags-container ${showMore ? "active" : ""}`}>
      <span onClick={handleShowMore} className="filter-tags-more"></span>
      {filterList &&
        filterList.map((filter, index) => {
          if (filter.childIds?.length === 0 && filter.checked === true) {
            return (
              <div className="filter-tags" key={index}>
                <span className="filter-tags__title" key={index}>
                  {filter.title}{" "}
                </span>
                <span onClick={() => handleTagsCloseClick(filter)}>
                  <i className="fas fa-times filter-tags__close"></i>
                </span>
              </div>
            );
          } else {
            return null;
          }
        })}
    </div>
  );
}

export default FilterTags;
