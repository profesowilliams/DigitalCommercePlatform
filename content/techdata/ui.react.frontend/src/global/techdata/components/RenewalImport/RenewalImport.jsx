import React from 'react';
import Button from '../Widgets/Button';
import { ImportIcon } from '../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import VerticalSeparator from '../Widgets/VerticalSeparator';

export default function RenewalImport({ aemData, showImportButton }) {
  const enableImport = aemData?.enableImport;
  return (
    <>
      {showImportButton && enableImport && (
        <>
          <VerticalSeparator />
          <div className="cmp-renewals-import">
            <div className="cmp-renewals-import-container">
              <Button btnClass="cmp-renewals-import-container__button">
                {getDictionaryValueOrKey(aemData?.import)}
              </Button>
              <ImportIcon />
            </div>
          </div>
        </>
      )}
    </>
  );
}
