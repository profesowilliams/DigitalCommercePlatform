import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { usGet } from '../../../../../utils/api';
import { SearchIcon } from '../../../../../fluentIcons/FluentIcons';
import { filtersDateGroup } from '../utils/orderTrackingUtils';
import Pill from '../../Widgets/Pill';
import { getLocalStorageData, setLocalStorageData } from '../utils/gridUtils';
import { ORDER_SEARCH_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { getUrlParamsCaseInsensitive } from '../../../../../utils';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  ANALYTICS_TYPES,
  pushEvent,
} from '../../../../../utils/dataLayerUtils';
import {
  getSearchAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { debounce } from '../utils/utils';

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

const removeQueryParamsSearch = (options) => {
  const params = getUrlParamsCaseInsensitive();
  options.forEach((el) => {
    if (params.has(el.param)) {
      params.delete(el.param);
    }
  });
  const queryString = params.toString();
  const finalUrl =
    window.location.pathname + (queryString ? `?${queryString}` : '');
  window.history.pushState({}, document.title, finalUrl);
};

const getInitialValue =
  getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).value || '';

const getInitialKey =
  getLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY).field || '';

const Search = (
  {
    options,
    onQueryChanged,
    clearReports,
    gridConfig,
    filtersRefs,
    searchAnalyticsLabel,
  },
  ref
) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const [pill, setPill] = useState({
    field: ref.current.field || getInitialKey,
    value: ref.current.value || getInitialValue,
  });
  const userData = useOrderTrackingStore((state) => state.userData);
  const minimalQueryLength = 2;
  const loading =
    open && value.length >= minimalQueryLength && suggestions.length === 0;

  const translations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const freeTextSearchTranslations =
    translations?.['OrderTracking.FreetextSearchFields'];
  const mainGridTranslations = translations?.['OrderTracking.MainGrid'];

  const loadingTranslations = {
    loading: mainGridTranslations?.Search_Input_Loading,
    noResults: mainGridTranslations?.Search_Input_NoResultFound,
  };
  const [loadingText, setLoadingText] = useState('loading');

  const getFreeTextTranslations = (key) =>
    freeTextSearchTranslations?.[key] || key;

  useImperativeHandle(ref, () => ({ field: pill.field, value: pill.value }), [
    pill,
  ]);

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
        `${
          gridConfig.uiCommerceServiceDomain
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

  const resetLocalStorage = () => {
    setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
      field: '',
      value: '',
    });
  };

  const handleDeletePill = () => {
    setPill({ value: '', field: '' });
    setSuggestions([]);
    resetLocalStorage();
    onQueryChanged({ onSearchAction: true });
    removeQueryParamsSearch(options);
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
          searchAnalyticsLabel,
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
    if (value.length >= minimalQueryLength && suggestions.length > 0) {
      let newKey = '';
      let newGTMKey = '';
      if (newValue === null) {
        setValue('');
      } else if (!newValue.field) {
        newKey = suggestions[0].field;
        newGTMKey = suggestions[0].gtmField;
      } else {
        newKey = newValue.field;
        newGTMKey = newValue.gtmField;
      }
      clearReports();
      ref.current.field = newKey;
      ref.current.value = value;
      onQueryChanged({ onSearchAction: true });
      setFocused(false);
      setPill({ value: value, field: newKey });
      setLocalStorageData(ORDER_SEARCH_LOCAL_STORAGE_KEY, {
        field: newKey,
        value: value,
        customerNumber: userData?.activeCustomer?.customerNumber,
      });
      pushDataToGTMAutocomplete(newGTMKey, value, suggestions);
      resetSearch();
    }
  };

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
      {pill.value && freeTextSearchTranslations && (
        <Pill
          children={
            <span className="td-capsule__text">
              {getFreeTextTranslations(pill.field)}: {pill.value}
            </span>
          }
          closeClick={handleDeletePill}
          hasCloseButton
        />
      )}
      <Autocomplete
        id="free-solo-demo"
        PaperComponent={CustomPaper}
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => option?.text || suggestions[0]?.text || ''}
        renderOption={getOptionLabel}
        filterOptions={(x) => x}
        open={open}
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
            placeholder={getDictionaryValueOrKey(gridConfig.searchPlaceholder)}
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
