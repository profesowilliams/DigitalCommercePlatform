import React from 'react';
import { DismissFilledIcon } from '../../../../fluentIcons/FluentIcons';
import BaseFlyout from '../BaseFlyout/BaseFlyout';

function CopyFlyout({ store, copyFlyout }) {
  const showCopyFlyout = store( st => st.showCopyFlyout);
  const effects = store( st => st.effects);
  const { title = '', description = '', button = '' } = copyFlyout;
  const closeFlyout = () => effects.setCustomState({ key: 'showCopyFlyout', value: false });
  return (
    <BaseFlyout
      open={showCopyFlyout}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
    >
      <div className="cmp-renewals-copy-flyout">
        <section className="cmp-renewals-copy-flyout__header">
          <h4 className="cmp-renewals-copy-flyout__header-title">{title || 'Copy'}</h4>
          <div className="cmp-renewals-copy-flyout__header-icon" onClick={closeFlyout}>
            <DismissFilledIcon width="30" height="30"/>
          </div>
        </section>
        <section className="cmp-renewals-copy-flyout__content">
          <div className="cmp-renewals-copy-flyout__content-description">
            {description}
          </div>
          <div className="cmp-renewals-copy-flyout__content-search">

          </div>
        </section>
        <section className="cmp-renewals-copy-flyout__footer">
          <button>{button || 'Copy'}</button>
        </section>
      </div>
    </BaseFlyout>
  );
}

export default CopyFlyout;
