import React, {useState} from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';

const styleOverrideFormControlLabel = {
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
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

function ExportFlyout({ store, exportFlyout, subheaderReference }) {
  const exportFlyoutConfig = store((st) => st.exportFlyout);
  const effects = store((st) => st.effects);
  const [selected, setSelected] = useState(
    exportFlyout?.exportOptionsList
      ? exportFlyout.exportOptionsList[0].label
      : []
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
            {exportFlyout.exportOptionsList?.map((e) => (
              <FormControlLabel
                sx={styleOverrideFormControlLabel}
                key={e.key}
                value={e.label}
                control={<Radio sx={styleOverrideRadio} />}
                label={e.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={styleOverrideDivider} />
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(exportFlyout.secondaryDscription)}
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={secondarySelected}
            onChange={handleSecondarySelectChange}
          >
            {exportFlyout.exportSecondaryOptionsList?.map((e) => (
              <FormControlLabel
                sx={styleOverrideFormControlLabel}
                key={e.key}
                value={e.label}
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
