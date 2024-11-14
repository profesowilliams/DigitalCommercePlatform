import React from 'react';
import Button from '../web-components/Button';
import Icon from '../web-components/Icon';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import { useRenewalGridState } from '../RenewalsGrid/store/RenewalsStore';

export default function RenewalImport({ aemData, showImportButton }) {
  const enableImport = aemData?.enableImport;
  const effects = useRenewalGridState((state) => state.effects);
  const { setCustomState } = effects;
  const handleOpenImportFlyout = () => {
    setCustomState({
      key: 'importFlyout',
      value: { show: true },
    });
  };
  return (
    <>
      {showImportButton && enableImport && (
        <>
          <VerticalSeparator />
          <div className="cmp-renewals-import">
            <div className="cmp-renewals-import-container">
              <Button
                id="renewals-import-button"
                type="button"
                theme="light"
                variant="link"
                color="teal"
                onClick={handleOpenImportFlyout}
              >
                <Icon name="import" state="default" />
                {getDictionaryValueOrKey(aemData?.import)}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
