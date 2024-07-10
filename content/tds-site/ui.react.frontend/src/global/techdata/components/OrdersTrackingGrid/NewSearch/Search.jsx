import React, { useState, useMemo, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { usGet } from '../../../../../utils/api';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { filtersDateGroup } from '../utils/orderTrackingUtils';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { ANALYTICS_TYPES, pushEvent } from '../../../../../utils/dataLayerUtils';
import { getSearchAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import { debounce } from '../utils/utils';
import { getUrlParamsCaseInsensitive, removeDisallowedParams, removeSpecificParams } from '../../../../../utils/index';

function CustomPaper({ children }) {
  return (
    <Paper
      sx={{
        width: '380px',
        '& .MuiAutocomplete-listbox': {
          bgcolor: '#fff',
          '& .MuiAutocomplete-option': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'block',
            '&:first-of-type': {
              bgcolor: '#003031 !important',
              color: '#fff !important',
            },
          },
        },
        '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
          bgcolor: '#E4E5E6',
        },
      }}
    >
      {children}
    </Paper>
  );
}

const prepareFiltersParams = (filtersRefs) => {
  const dateFilters = Object.entries(filtersRefs?.current).filter(
    (entry) => filtersDateGroup.includes(entry[0]) && Boolean(entry[1])
  );
  let filterDateParams = '';
  dateFilters.forEach(
    (filter) =>
      (filterDateParams = filterDateParams + '&' + filter[0] + '=' + filter[1])
  );

  const filtersStatusAndType =
    (filtersRefs.current.type ?? '') + (filtersRefs.current.status ?? '');
  return filterDateParams + filtersStatusAndType;
};

const Search = (
  {
    onChange,
    gridConfig,
    filtersRefs,
    analyticsLabel,
  }, ref
) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const params = getUrlParamsCaseInsensitive();
  const getInitial = {
    field: params.get('field'),
    gtmField: params.get('gtmfield'),
    value: params.get('value')
  };
  const minimalQueryLength = 2;
  const loading =
    open && value.length >= minimalQueryLength && suggestions.length === 0;

  const translations = useOrderTrackingStore((state) => state.uiTranslations);
  const freeTextSearchTranslations = translations?.['OrderTracking.FreetextSearchFields'];
  const mainGridTranslations = translations?.['OrderTracking.MainGrid'];

  const loadingTranslations = {
    loading: mainGridTranslations?.Search_Input_Loading,
    noResults: mainGridTranslations?.Search_Input_NoResultFound,
  };
  const [loadingText, setLoadingText] = useState('loading');

  const getOptionLabel = (props, option) => {
    const chosenOption = option || suggestions[0] || {};
    return (
      <div {...props}>
        <span>{chosenOption.text || ''}</span>
        <span
          style={{
            fontSize: '14px',
            verticalAlign: 'middle',
            float: 'right',
          }}
        >
          ({chosenOption.matchCount})
        </span>
      </div>
    );
  };

  const fetchSuggestions = useCallback(async (newValue) => {
    const filterParams = prepareFiltersParams(filtersRefs);
    try {
      const result = await usGet(
        `${gridConfig.uiCommerceServiceDomain
        }/v3/lookahead?searchtext=${encodeURIComponent(
          newValue
        )}${filterParams}`
      );
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const handleAutocompleteInput = useCallback(
    (newValue) => {
      newValue.length >= minimalQueryLength
        ? fetchSuggestions(newValue).then((result) => {
          setSuggestions(result?.data?.content?.suggestions || []);
          if (result?.data?.content?.suggestions?.length === 0) {
            setLoadingText('noResults');
          } else {
            setLoadingText('loading');
            setOpen(true);
          }
        })
        : setSuggestions([]);
    },
    [fetchSuggestions]
  );

  const resetSearch = () => {
    setValue('');
    setSuggestions([]);
  };

  const pushToGTM = useCallback(
    (newGTMKey, currentValue, currentSuggestions) => {
      pushEvent(ANALYTICS_TYPES.events.orderSearch, null, {
        order: {
          searchTerm: currentValue,
          searchType: newGTMKey,
        },
      });
      pushDataLayerGoogle(
        getSearchAnalyticsGoogle(
          analyticsLabel,
          newGTMKey,
          currentValue,
          currentSuggestions
        )
      );
    },
    []
  );

  const pushDataToGTMAutocomplete = useMemo(() => {
    return debounce(pushToGTM, 300);
  }, []);

  const triggerSearch = (newValue) => {
    console.log('Search::triggerSearch');
    if (value.length >= minimalQueryLength && suggestions.length > 0) {
      let field = '';
      let newGTMKey = '';
      if (newValue === null) {
        setValue('');
      } else if (!newValue.field) {
        field = suggestions[0].field;
        newGTMKey = suggestions[0].gtmField;
      } else {
        field = newValue.field;
        newGTMKey = newValue.gtmField;
      }
      handleSearch(field, value, newGTMKey);
    }
  };

  const handleSearch = (field, value, gtmField) => {
    console.log('Search::handleSearch');
    onChange({
      key: field,
      field: freeTextSearchTranslations?.[field],
      value: value,
      gtmField: gtmField
    });
    setFocused(false);
    updateUrl({
      field: field,
      gtmField: gtmField, 
      value: value
    });
    pushDataToGTMAutocomplete(gtmField, value, suggestions);
    resetSearch();
  };

  /**
   * Updates the URL based on the selected filter
   * @param {Object} filter - The selected filter
   */
  const updateUrl = (filter) => {
    console.log('Search::updateUrl');

    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Declare a variable to hold the updated URL
    let url;

    if (filter) {
      // List of allowed parameters
      const allowedParameters = ['status', 'type', 'datetype', 'datefrom', 'dateto', 'page', 'sortby', 'sortdirection', 'saleslogin'];

      // Remove disallowed parameters from the current URL, keeping only specified ones
      url = removeDisallowedParams(new URL(window.location.href), allowedParameters);
      url.searchParams.set('field', filter.field);
      url.searchParams.set('gtmfield', filter.gtmField);
      url.searchParams.set('value', filter.value);
    } else {
      // List of parameters which should be removed
      const parametersToRemove = ['field', 'gtmfield', 'value'];

      // Remove specific parameters from the URL
      url = removeSpecificParams(new URL(window.location.href), parametersToRemove);
    }

    // If the URL has changed, update the browser history
    if (url.toString() !== currentUrl.toString())
      window.history.pushState(null, '', url.toString());
    // history.push(url.href.replace(url.origin, ''));
  };

  /**
   * Exposes methods to the parent component using a ref
   */
  useImperativeHandle(ref, () => ({
    cleanUp() {
      console.log('Search::cleanUp');

      // Call the updateUrl function with undefined to clear specific parameters from the URL
      updateUrl(undefined);
    }
  }));

  /**
   * Effect hook to trigger the initial search when translations are ready.
   * It checks if initial search parameters are present and then calls the handleSearch function.
   */
  useEffect(() => {
    console.log('Search::Translations ready trigger handleSearch');

    // Check if initial search parameters are provided
    if (getInitial.field && getInitial.value && getInitial.gtmField) {
      // Trigger the search with the initial parameters
      handleSearch(getInitial.field, getInitial.value, getInitial.gtmField);
    }
  }, [freeTextSearchTranslations]); // Dependency array to re-run the effect when translations are updated

  const debouncedAutocomplete = useMemo(() => {
    const timeout =
      !value || value.length < 3
        ? 300
        : value.length < 5
          ? 200
          : value.length < 10
            ? 100
            : 0;
    return debounce(handleAutocompleteInput, timeout);
  }, [value]);

  const tooltipMessage = mainGridTranslations ? (
    <div style={{ padding: '0 5px' }}>
      <p style={{ color: '#fff', marginBottom: '5px' }}>
        {mainGridTranslations.Search_Input_Tooltip}
      </p>
      <ul style={{ listStyle: 'inside', color: '#fff', margin: 0, padding: 0 }}>
        {Object.values(freeTextSearchTranslations)
          .sort((a, b) => a.localeCompare(b))
          .map((el) => (
            <li key={el} style={{ color: '#fff' }}>
              {el}
            </li>
          ))}
      </ul>
    </div>
  ) : (
    ''
  );

  return (
    <>
      <Autocomplete
        PaperComponent={CustomPaper}
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => option?.text || suggestions[0]?.text || ''}
        renderOption={getOptionLabel}
        filterOptions={(x) => x}
        open={open}
        className="search-autocomplete-input"
        loading={loading}
        loadingText={loadingTranslations[loadingText]}
        blurOnSelect={false}
        inputValue={value}
        openOnFocus={true}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={(event, reason) => {
          if (reason === 'createOption') {
            triggerSearch({});
          } else {
            setOpen(false);
          }
        }}
        onChange={(event, value) => {
          triggerSearch(value);
        }}
        disableClearable={true}
        sx={{
          width: 380,
          '& .MuiAutocomplete-input': {
            textOverflow: 'clip',
          },
          '& .MuiInput-root.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot':
            {
              justifyContent: 'space-between',
            },
        }}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            id="standard-basic"
            variant="standard"
            focused={focused}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={mainGridTranslations?.Search_Placeholder}
            inputProps={{
              ...params.inputProps,
              maxLength: 30,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <Icon>
                    <Tooltip
                      title={tooltipMessage}
                      placement="top"
                      arrow
                      disableInteractive={true}
                    >
                      <div>
                        <SearchIcon
                          onClick={() => triggerSearch({})}
                          className={`search-icon__dark ${
                            value.length < minimalQueryLength ? 'disabled' : ''
                          }`}
                        />
                      </div>
                    </Tooltip>
                  </Icon>
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === '*') e.preventDefault();
            }}
            onChange={(event) => {
              const newValue = event.target.value.replace('*', '');
              debouncedAutocomplete(newValue);
              setValue(newValue);
            }}
          />
        )}
      />
    </>
  );
};

export default forwardRef(Search);