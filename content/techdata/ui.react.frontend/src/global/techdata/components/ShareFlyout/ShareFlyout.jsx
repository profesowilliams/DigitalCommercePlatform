import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  WarningIcon,
} from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { Button, TextField, Autocomplete, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import { CustomTextField } from '../Widgets/CustomTextField';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { getRowAnalytics, ANALYTIC_CONSTANTS } from '../Analytics/analytics';

export function ShareFlyout({ store, shareFlyoutContent, subheaderReference }) {
  const shareFlyoutConfig = store((st) => st.shareFlyout);
  const activeAgreementID = shareFlyoutConfig?.data?.source?.id || '';
  const effects = store((st) => st.effects);
  const [enableShare, setEnableShare] = useState(false);
  const closeFlyout = () => effects.setCustomState({ key: 'shareFlyout', value: {show:false} });
  const [count, setCount] = useState(getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCount));

  useEffect(() => {
  }, []);

  const handleCommentChange = (e) => {

  };

  const formBoxStyle = {
    '& > :not(style)': { width: '100%' },
    '& > div': { marginBottom: '16px' },
    '&.MuiBox-root': { marginTop: '20px' },
  };

  return (
    <BaseFlyout
      open={shareFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutTitle) || 'Share'}
      secondaryButton={false}
      classText="share-flyout"
      buttonLabel={getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutButtonLabel) || 'Share'}
      disabledButton={!enableShare}
    >
      <section className="cmp-flyout__content">
        <p>{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutDescription)}</p>
        <Box
          className="cmp-flyout__share-form"
          component="form"
          sx={formBoxStyle}
          noValidate
          autoComplete="off"
        >
          <Autocomplete
            multiple
            id="to-email"
            options={[]}
            freeSolo={true}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label={getDictionaryValueOrKey("Email to")}
                required
              />
            )}
          />
          <Autocomplete
            multiple
            id="cc-email"
            options={[]}
            freeSolo={true}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label={getDictionaryValueOrKey("CC")}
              />
            )}
          />
          <div className="email-preview-section">
            <h3 className="email-preview-section-title">{getDictionaryValueOrKey(shareFlyoutContent.emailPreviewDescription)}:</h3>
            <p className="email-preview-section-product">{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteHeading)} - {activeAgreementID}</p>
            <p className="email-preview-section-desc">{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteDescription)}</p>
            <a className="email-preview-section-quote-btn" href={`#`}>{getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutQuoteButtonLabel)}</a>
          </div>
          <div>
            <textarea type="text" placeholder="Comments" className="comments" maxLength={count} onChange={(e) => handleCommentChange(e)}/>
            <span className="char-count">{count} {getDictionaryValueOrKey(shareFlyoutContent.shareFlyoutCommentCountText)}</span>
          </div>
        </Box>
      </section>
    </BaseFlyout>
  );
}

export default ShareFlyout;
