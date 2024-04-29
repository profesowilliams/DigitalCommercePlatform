import React, { useState } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import {
  requestFileBlobWithoutModal,
  getDateValue,
  createdFromDate,
} from '../../../../utils/utils';
import { getUrlParams } from '../../../../utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import {
  getExportAnalyticsGoogle,
  getExportSerialNumbersAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import {
  endpoints,
  setSearchCriteriaDefaultDateRange,
  filtersDateGroup,
} from '../OrdersTrackingGrid/utils/orderTrackingUtils';

const styleOverrideFormControlLabel = {
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
    color: '#262626',
  },
};
const styleOverrideRadio = {
  color: '#262626',
  '&.Mui-checked': {
    color: '#005758',
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
};
const styleOverrideDivider = {
  '&.MuiDivider-root': {
    width: '360px',
    margin: '16px -20px !important',
    borderColor: '#D9D8D7',
  },
};

function ExportFlyout({
  componentProp,
  exportFlyout = {},
  exportOptionsList,
  exportSecondaryOptionsList,
  subheaderReference,
  isTDSynnex,
  exportAnalyticsLabel,
  searchParams,
}) {
  const { id = '' } = getUrlParams();
  const isOrderDetailsPage = window.location.href.includes(
    'order-details.html?id='
  );
  const url =
    componentProp?.uiCommerceServiceDomain + endpoints.exportAllOrderLines ||
    'nourl';

  const exportFlyoutConfig = useOrderTrackingStore((st) => st.exportFlyout);
  const exportFlyoutSource = useOrderTrackingStore(
    (state) => state.exportFlyoutSource
  );
  const requestUrl = new URL(url);
  let urlSearchParams = requestUrl.searchParams;
  const { reports, sort, search, filters, dateRange } = searchParams;

  if (searchParams) {
    const reportValue = reports.current?.value;
    if (reportValue) {
      urlSearchParams.set('reportName', reportValue);
    } else {
      const sortValue = sort.current?.sortData?.[0];
      if (sortValue) {
        urlSearchParams.set('SortDirection', sortValue.sort);
        urlSearchParams.set('SortBy', sortValue.colId);
      }

      setSearchCriteriaDefaultDateRange({
        searchCriteria: search,
        requestUrl: requestUrl,
        filtersRefs: filters,
        defaultSearchDateRange: dateRange,
      });

      filters.current &&
        Object.entries(filters.current).reduce((params, filter) => {
          if (filter[1] && (filter[0] === 'status' || filter[0] === 'type')) {
            filter[1].split('&').forEach((e) => {
              if (!e) {
                return;
              }
              let key = e.split('=');
              urlSearchParams.append(key[0], key[1]);
            });
          } else if (filter[1]) {
            urlSearchParams.set(filter[0], filter[1]);
          }
        }, '');
    }
  } else if (isOrderDetailsPage) {
    urlSearchParams.set('Id', id);
  }
  const effects = useOrderTrackingStore((st) => st.effects);
  const [selected, setSelected] = useState(
    exportOptionsList ? exportOptionsList?.[0]?.key : []
  );
  const [secondarySelected, setSecondarySelected] = useState(
    (isOrderDetailsPage && exportSecondaryOptionsList?.[1]?.key) || null
  );
  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const handleSecondarySelectChange = (event) => {
    setSecondarySelected(event.target.value);
  };

  const closeFlyout = () => {
    effects.setCustomState({ key: 'exportFlyout', value: { show: false } });
    !isOrderDetailsPage && setSecondarySelected(null);
  };

  function getExportAllOrderLines() {
    urlSearchParams.set('OnlyWithSerialNumbers', false);
    return requestFileBlobWithoutModal(
      url + '?' + urlSearchParams.toString(),
      '',
      {
        redirect: false,
      }
    );
  }

  function getExportLinesWithSerialNumbersOnly() {
    urlSearchParams.set('OnlyWithSerialNumbers', true);
    return requestFileBlobWithoutModal(
      url + '?' + urlSearchParams.toString(),
      '',
      {
        redirect: false,
      }
    );
  }

  const exportRequests = [
    {
      key: 'exportAllOrderLinesKey',
      request: getExportAllOrderLines,
      analyticsLabel: 'all',
    },
    {
      key: 'exportLinesWithSerialNumbersKey',
      request: getExportLinesWithSerialNumbersOnly,
      analyticsLabel: 'serials',
    },
  ];

  const handleDownload = () => {
    const matchingRequest = exportRequests.find(
      (e) => e.key === secondarySelected
    );
    pushDataLayerGoogle(
      getExportAnalyticsGoogle(
        exportAnalyticsLabel,
        matchingRequest.analyticsLabel
      )
    );
    if (matchingRequest) {
      matchingRequest
        .request()
        .then(() => {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: true,
            message: getDictionaryValueOrKey(
              exportFlyout?.exportSuccessMessage
            ),
          };

          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        })
        .catch(() => {
          const toaster = {
            isOpen: true,
            origin: 'fromUpdate',
            isAutoClose: true,
            isSuccess: false,
            message: getDictionaryValueOrKey(exportFlyout?.exportFailedMessage),
          };
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        });

      closeFlyout();
    }
    if (exportFlyoutSource === 'Details') {
      pushDataLayerGoogle(getExportSerialNumbersAnalyticsGoogle());
      effects.setExportFlyoutSource(null);
    }
  };

  return (
    <BaseFlyout
      open={exportFlyoutConfig?.show}
      onClose={closeFlyout}
      width="360px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(exportFlyout?.title || 'Export')}
      buttonLabel={getDictionaryValueOrKey(exportFlyout?.button || 'Export')}
      disabledButton={!secondarySelected}
      selected={secondarySelected}
      isTDSynnex={isTDSynnex}
      onClickButton={handleDownload}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description-message">
          {getDictionaryValueOrKey(exportFlyout?.descriptionMessage)}
        </div>
        <div className="cmp-flyout__content-description-export">
          {getDictionaryValueOrKey(exportFlyout?.description)}
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selected}
            onChange={handleSelectChange}
          >
            {exportOptionsList?.map((e) => (
              <FormControlLabel
                sx={styleOverrideFormControlLabel}
                key={e.key}
                value={e.key}
                control={<Radio sx={styleOverrideRadio} />}
                label={getDictionaryValueOrKey(e.label)}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={styleOverrideDivider} />
        <div className="cmp-flyout__content-description-export">
          {getDictionaryValueOrKey(exportFlyout?.secondaryDescription)}
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={secondarySelected}
            onChange={handleSecondarySelectChange}
          >
            {exportSecondaryOptionsList?.map((e) => (
              <FormControlLabel
                sx={styleOverrideFormControlLabel}
                key={e.key}
                value={e.key}
                control={<Radio sx={styleOverrideRadio} />}
                label={getDictionaryValueOrKey(e.label)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </section>
    </BaseFlyout>
  );
}

export default ExportFlyout;
