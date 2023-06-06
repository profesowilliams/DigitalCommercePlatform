import React, {useState} from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import { requestFileBlobWithoutModal } from '../../../../utils/utils';
import {
  getExportAnalytics,
  pushDataLayer,
} from '../OrdersTrackingGrid/utils/analyticsUtils';

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
  exportFlyout,
  exportOptionsList,
  exportSecondaryOptionsList,
  subheaderReference,
  isTDSynnex,
  exportAnalyticsLabel,
}) {
  const exportFlyoutConfig = store((st) => st.exportFlyout);
  const effects = store((st) => st.effects);
  const [selected, setSelected] = useState(
    exportOptionsList ? exportOptionsList[0].key : []
  );
  const [secondarySelected, setSecondarySelected] = useState(null);

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };
  const handleSecondarySelectChange = (event) => {
    setSecondarySelected(event.target.value);
  };
  const closeFlyout = () => {
    effects.setCustomState({ key: 'exportFlyout', value: { show: false } });
    setSecondarySelected(null);
  };

  async function getExportAllOrderLines() {
    const url = componentProp?.exportAllOrderLinesEndpoint || 'nourl';
    const singleDownloadUrl = url;
    const name = `file.xlsx`;
    await requestFileBlobWithoutModal(singleDownloadUrl, name, {
      redirect: false,
    });
  }

  const exportRequests = [
    { key: 'exportAllOrderLinesKey', request: getExportAllOrderLines },
    { key: 'exportLinesWithSerialNumbersKey', request: getExportAllOrderLines },
  ];

  const handleDownload = () => {
    const matchingRequest = exportRequests.find(
      (e) => e.key === secondarySelected
    );
    pushDataLayer(getExportAnalytics(exportAnalyticsLabel, secondarySelected));
    if (matchingRequest) {
      const downloadRequest = matchingRequest.request;
      downloadRequest();
      const toaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: false,
        isSuccess: true,
        message: getDictionaryValueOrKey(exportFlyout.exportSuccessMessage),
      };
      closeFlyout();
      effects.setCustomState({ key: 'toaster', value: { ...toaster } });
    }
  };

  return (
    <BaseFlyout
      open={exportFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={exportFlyout.title || 'Export'}
      buttonLabel={exportFlyout.button || 'Export'}
      enableButton={secondarySelected}
      disabledButton={!secondarySelected}
      selected={secondarySelected}
      isTDSynnex={isTDSynnex}
      onClickButton={handleDownload}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(exportFlyout.description)}
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
          {getDictionaryValueOrKey(exportFlyout.secondaryDescription)}
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
