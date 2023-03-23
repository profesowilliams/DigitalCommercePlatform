import React from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function DNotesFlyout({ store, dNotesFlyout, subheaderReference }) {
  const dNoteFlyoutConfig = store((st) => st.dNotesFlyout);
  const effects = store((st) => st.effects);

  const closeFlyout = () =>
    effects.setCustomState({ key: 'dNotesFlyout', value: { show: false } });
  return (
    <BaseFlyout
      open={dNoteFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={dNotesFlyout.title || 'D-notes'}
      buttonLabel={dNotesFlyout.button || 'Download selected'}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <span className="cmp-flyout__content-bold">
            {getDictionaryValueOrKey(dNotesFlyout.orderNo)}
            {'  '}
          </span>
          {dNoteFlyoutConfig?.id}
        </div>
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(dNotesFlyout.description)}
        </div>
      </section>
    </BaseFlyout>
  );
}

export default DNotesFlyout;
