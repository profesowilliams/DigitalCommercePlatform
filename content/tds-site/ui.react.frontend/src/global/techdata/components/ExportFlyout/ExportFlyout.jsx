import React, { useState } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import {
  getExportAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../OrdersTrackingGrid/utils/analyticsUtils';
import { dateToString } from '../../helpers/formatting';

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
    margin: '2rem -20px',
    borderColor: '#E4E5E6',
  },
};

function ExportFlyout({
  store,
  componentProp,
  exportFlyout = {},
  exportOptionsList,
  exportSecondaryOptionsList,
  subheaderReference,
  isTDSynnex,
  exportAnalyticsLabel,
  searchParams,
}) {
  const isOrderDetailsPage = window.location.href.includes(
    'order-details.html?id='
  );
  const exportFlyoutConfig = store((st) => st.exportFlyout);
  let urlSearchParams = new URLSearchParams();
  if (searchParams) {
    const { reports, sort, search, filters } = searchParams;
    const reportValue = reports.current?.value;
    if(reportValue) {
      urlSearchParams.set('reportName', reportValue);
    } else {
      const searchValue = search.current;
      if(searchValue?.value) {
        urlSearchParams.set(searchValue.field, searchValue.value);
      }
      const sortValue = sort.current?.sortData?.[0];
      if(sortValue) {
        urlSearchParams.set('SortDirection', sortValue.sort);
        urlSearchParams.set('SortBy', sortValue.colId);
      }
      (filters.current &&
        Object.entries(filters.current).reduce((params, filter) => {
          if (filter[1] && (filter[0] === 'status' || filter[0] === 'type')) {
            urlSearchParams.append(filter[0], filter[1].replace('&' + filter[0] + '=', ''));
          }
          else if (filter[1]) {
            urlSearchParams.append(filter[0], filter[1]);
          }
        }, ''))
    }
  }
  const effects = store((st) => st.effects);
  const [selected, setSelected] = useState(
    exportOptionsList ? exportOptionsList[0]?.key : []
  );
  const [secondarySelected, setSecondarySelected] = useState(
    (isOrderDetailsPage && exportSecondaryOptionsList[1]?.key) || []
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
    const url = componentProp?.exportAllOrderLinesEndpoint || 'nourl';
    urlSearchParams.set('OnlyWithSerialNumbers', false);
    return requestFileBlobWithoutModal(url + '?' + urlSearchParams.toString(), '', {
      redirect: false,
    });
  }
  function getExportLinesWithSerialNumbersOnly() {
    const url = componentProp?.exportLinesWithSerialNumbersOnlyEndpoint || 'nourl';
    urlSearchParams.set('OnlyWithSerialNumbers', true);
    return requestFileBlobWithoutModal(url + '?' + urlSearchParams.toString(), '', {
      redirect: false,
    });
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
            isAutoClose: false,
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
            isAutoClose: false,
            isSuccess: false,
            message: getDictionaryValueOrKey(exportFlyout?.exportFailedMessage),
          };
          effects.setCustomState({ key: 'toaster', value: { ...toaster } });
        });

      closeFlyout();
    }
  };

  return (
    <BaseFlyout
      open={exportFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={exportFlyout?.title || 'Export'}
      buttonLabel={exportFlyout?.button || 'Export'}
      disabledButton={!secondarySelected}
      selected={secondarySelected}
      isTDSynnex={isTDSynnex}
      onClickButton={handleDownload}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
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
                label={e.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={styleOverrideDivider} />
        <div className="cmp-flyout__content-description">
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
                label={e.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={styleOverrideDivider} />
      </section>
    </BaseFlyout>
  );
}

export default ExportFlyout;
