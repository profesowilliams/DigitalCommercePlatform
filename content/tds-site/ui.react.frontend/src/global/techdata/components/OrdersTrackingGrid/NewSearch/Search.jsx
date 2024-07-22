/**
 * File is too big!
 * reorganise: CustomPaper, fetchSuggestions, GTM
 */
import React, { useState, useMemo, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { usGet } from '../../../../../utils/api';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { ANALYTICS_TYPES, pushEvent } from '../../../../../utils/dataLayerUtils';
import { getSearchAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import { debounce } from '../utils/utils';
import { getUrlParamsCaseInsensitive } from '../../../../../utils/index';
import { updateUrl, prepareFiltersParams } from './Utils/utils';

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

      handleSearch({
        field: field,
        value: value,
        gtmField: newGTMKey
      });
    }
  };

  /**
   * Handles the search action when a search option is selected.
   *
   * @param {Object} option - The selected search option.
   * @param {string} option.field - The field being searched.
   * @param {string} option.value - The value of the search.
   * @param {string} option.gtmField - The Google Tag Manager field associated with the search.
   * @param {boolean} option.isInit - Indicates if the search is an initial search.
   */
  const handleSearch = (option) => {
    console.log('Search::handleSearch');

    // Trigger the onChange callback with the selected search option details
    onChange({
      key: option.field,
      field: freeTextSearchTranslations?.[option.field],
      value: option.value,
      gtmField: option.gtmField,
      isInit: option.isInit
    });

    // Set the focused state to false
    setFocused(false);

    // Update the URL with the search option details
    updateUrl({
      field: option.field,
      gtmField: option.gtmField,
      value: option.value
    });

    // Push data to Google Tag Manager for autocomplete tracking
    pushDataToGTMAutocomplete(option.gtmField, option.value, suggestions);

    // Reset the search state
    resetSearch();
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
      handleSearch({
        field: getInitial.field,
        value: getInitial.value,
        gtmField: getInitial.gtmField,
        isInit: true
      });
    }
  }, [freeTextSearchTranslations]); // Dependency array to re-run the effect when translations are updated

  /**
   * Returns a debounced version of the handleAutocompleteInput function.
   * The debounce delay is determined based on the length of the input value.
   *
   * @param {string} value - The current input value.
   * @returns {Function} - The debounced handleAutocompleteInput function.
   */
  const debouncedAutocomplete = useMemo(() => {
    // Determine the debounce timeout based on the length of the input value
    const timeout =
      !value || value.length < 3
        ? 300 // 300ms delay for input length less than 3 or empty
        : value.length < 5
          ? 200 // 200ms delay for input length between 3 and 4
          : value.length < 10
            ? 100 // 100ms delay for input length between 5 and 9
            : 0;  // No delay for input length 10 or more

    // Return the debounced handleAutocompleteInput function with the calculated timeout
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