import React, { useState } from "react";
import Button from "../Widgets/Button";
import normaliseState from "./normaliseData";

const FilterHeader = ({ handleClearFilter }) => {
  return (
    <div className="filter-modal-container__header">
      <h3>Filters</h3>
      <Button
        onClick={handleClearFilter}
        btnClass="filter-modal-container__header--clear-all"
      >
        Clear all filters
      </Button>
    </div>
  );
};

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const Count = ({ children }) => {
  return <div className="count">{children}</div>;
};

function Filter({
  id,
  filters,
  handleFilterClick,
  handleCheckBoxClick,
  checkCount,
}) {
  const filter = filters[id];
  const childIds = filter.childIds;

  const subFilterList = childIds.map((childId) => (
    <SubFilter
      key={childId}
      id={childId}
      filters={filters}
      handleCheckBoxClick={handleCheckBoxClick}
    />
  ));

  return (
    <>
      <li
        onClick={() => handleFilterClick(filter, childIds)}
        className="filter-accordion__item"
      >
        <div className="filter-accordion__item--group">
          <h3 className={`${filter.open ? "active" : ""}`}>{filter.title}</h3>
          <Count>{checkCount(filter)}</Count>
        </div>
      </li>

      {childIds.length > 0 && (
        <ul className="filter-option__options">
          {subFilterList}
        </ul>
      )}
    </>
  );
}

const FilterItem = ({ id, filter, childIds, filters, handleCheckBoxClick }) => {
  return (
    <li key={id}>
      <input
        name={filter.title}
        type="checkbox"
        className="filter-option__checkbox"
        checked={filter.checked}
        onChange={() => handleCheckBoxClick(childIds, filter, filters)}
      />
      <label className="filter-option__label">{filter.title}</label>
    </li>
  );
};

function SubFilter({ id, filters, handleCheckBoxClick }) {
  const filter = filters[id];
  const childIds = filter.childIds;
  return (
    filter.open && (
      <>
        <FilterItem
          filter={filter}
          filters={filters}
          childIds={childIds}
          handleCheckBoxClick={handleCheckBoxClick}
        />
        {childIds.length > 0 && (
          <ul>
            {childIds.map((childId, index) => {
              return (
                <SubFilter
                  key={index}
                  id={childId}
                  filters={filters}
                  handleCheckBoxClick={handleCheckBoxClick}
                />
              );
            })}
          </ul>
        )}
      </>
    )
  );
}

const FilterTags = ({
  showMore,
  handleShowMore,
  filters,
  handleTagsCloseClick,
}) => {
  return (
    <div className={`filter-tags-container ${showMore ? "active" : ""}`}>
      <span onClick={handleShowMore} className="filter-tags-more"></span>
      {filters.map((filter, index) => {
        if (filter.childIds.length === 0 && filter.checked === true) {
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
};

const isOneChecked = (filters, filter) =>
  filters[filter.parentId].childIds.some((id) => {
    return filters[id].checked === true;
  });

const FilterModal = ({ aemData, handleFilterCloseClick }) => {
  // https://beta.reactjs.org/learn/choosing-the-state-structure#avoid-deeply-nested-state
  const aemFilterData = normaliseState(aemData.filterListValues);
  const [filters, setFilters] = useState(aemFilterData);
  const [showMore, setShowMore] = useState(false);
  const root = filters[0];
  const rootIds = root.childIds;

  const checkCount = (f) => {
    let c = [];
    let k = 0;
    if (f.childIds.length > 0) {
      f.childIds.forEach((id) => {
        if (filters[id].childIds.length > 0) {
          filters[id].childIds.forEach((id) => {
            c.push(id);
          });
          k = c.filter((id) => {
            return filters[id].checked === true;
          }).length;
        } else {
          k = filters[filters[id].parentId].childIds.filter((id) => {
            return filters[id].checked === true;
          }).length;
        }
      });
    }
    return k === 0 ? null : k;
  };

  const handleFilterClick = (filter, c) => {
    const filtersCopy = [...filters];
    /**
     * Apply toggle on parent as well
     */
    if (!("parentId" in filter)) {
      filtersCopy[filter.id].open = !filtersCopy[filter.id].open;
    }

    c.map((id) => {
      return (filtersCopy[id].open = !filtersCopy[id].open);
    });

    setFilters(filtersCopy);
  };

  const handleCheckBoxClick = (childIds, filter, filters) => {
    const filtersCopy = [...filters];

    // toggle the checked state of filter
    filter.checked = !filter.checked;
    childIds.map((id) => {
      return (filtersCopy[id].open = !filtersCopy[id].open);
    });

    /**
     * if filter checked enable all children
     * else, viceversa
     */
    if (childIds.length > 0 && filter.checked) {
      childIds.map((id) => {
        return (filtersCopy[id].checked = true);
      });
    }

    if (childIds.length > 0 && !filter.checked) {
      childIds.map((id) => {
        return (filtersCopy[id].checked = false);
      });
    }

    /**
     * to handle checkbox logic for nested accordion.
     */
    if (childIds.length === 0 && "parentId" in filter) {
      const oneChecked = isOneChecked(filtersCopy, filter);
      const parent = filtersCopy[filter.parentId];

      if (oneChecked) {
        parent.checked = true;
      }

      if (!oneChecked && "parentId" in parent) {
        parent.checked = false;
        // close only nested children
        parent.childIds.map((id) => {
          return (filtersCopy[id].open = false);
        });
      }
    }

    setFilters(filtersCopy);
  };

  const handleTagsCloseClick = (filter) => {
    const filtersCopy = [...filters];
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

    setFilters(filtersCopy);
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleClearFilter = () => {
    const filtersCopy = [...filters];
    filtersCopy.forEach((filter, index) => {
      if (index !== 0) {
        filter.open = false;
        filter.checked = false;
      }
    });

    setFilters(filtersCopy);
  };

  const filterList = rootIds.map((id) => (
    <Filter
      key={id}
      id={id}
      filters={filters}
      handleFilterClick={handleFilterClick}
      handleCheckBoxClick={handleCheckBoxClick}
      checkCount={checkCount}
    />
  ));

  return (
    <div className="filter-modal-container">
      <Button
        onClick={handleFilterCloseClick}
        btnClass="filter-modal-container__close"
      ></Button>
      <FilterDialog>
        <FilterHeader handleClearFilter={handleClearFilter} />
        <ul className="filter-accordion">
          {filterList}
        </ul>
        <FilterTags
          filters={filters}
          showMore={showMore}
          handleTagsCloseClick={handleTagsCloseClick}
          handleShowMore={handleShowMore}
        />
        <Button btnClass="cmp-quote-button filter-modal-container__results">
          {aemData.showResultLabel}
        </Button>
      </FilterDialog>
    </div>
  );
};

export default FilterModal;
