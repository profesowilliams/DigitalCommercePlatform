import React, { useEffect, useState } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import SettingsContent from './SettingsContent';
import { useStore } from '../../../../utils/useStore';
import { usPut } from '../../../../utils/api';

const settingsKeys = [
  'active',
  'range',
  'types',
  'email',
  'additionalEmail',
  'emailActive',
  'additionalEmailActive',
];

const areSettingsIdentical = (originalSettings, settings) => {
  const diff = Object.keys(originalSettings).some(
    (key) => originalSettings[key] !== settings[key]
  );
  return !diff;
};

const SettingsFlyout = ({
  subheaderReference,
  isTDSynnex = true,
  labels = {},
  config,
}) => {
  const settingsFlyoutConfig = useOrderTrackingStore((st) => st.settingsFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [data, setData] = useState({});
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [dataCopy, setDataCopy] = useState({});
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: null, show: false },
    });
  };

  const openFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: settingsFlyoutConfig?.data, show: true },
    });
  };

  const handleDataChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const saveData = async () => {
    try {
      await usPut(`${config.uiProactiveServiceDomain}/v1`, data);
      const successToaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: true,
        message: getDictionaryValueOrKey(labels?.settingsSuccessMessage),
        Child: (
          <a onClick={openFlyout}>
            {getDictionaryValueOrKey(labels?.adjustSettings)}
          </a>
        ),
      };
      effects.setCustomState({ key: 'toaster', value: { ...successToaster } });
    } catch {
      const errorToaster = {
        isOpen: true,
        origin: 'fromUpdate',
        isAutoClose: true,
        isSuccess: false,
        message: getDictionaryValueOrKey(labels?.settingsErrorMessage),
        Child: null,
      };
      effects.setCustomState({ key: 'toaster', value: { ...errorToaster } });
    }
    changeRefreshDetailApiState();
    closeFlyout();
  };

  const isDataModifiedAndValid = () => {
    if (_.isEmpty(data)) {
      return false;
    } else if (!data.emailActive && !data.additionalEmailActive) {
      return false;
    } else if (areSettingsIdentical(dataCopy, data)) {
      return false;
    } else return true;
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons settings">
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels?.cancelSettingsChange)}
      </button>
      <button disabled={!isSaveEnabled} className="primary" onClick={saveData}>
        {getDictionaryValueOrKey(labels?.save)}
      </button>
    </div>
  );

  useEffect(() => {
    isDataModifiedAndValid() ? setIsSaveEnabled(true) : setIsSaveEnabled(false);
  }, [data]);

  useEffect(() => {
    if (settingsFlyoutConfig?.data) {
      const initialSettings = {};
      settingsKeys.forEach((key) => {
        initialSettings[key] =
          key === 'email' || key === 'additionalEmail'
            ? settingsFlyoutConfig.data.destination[key]
            : settingsFlyoutConfig.data[key];
      });
      setData(initialSettings);
      setDataCopy(initialSettings);
    }
  }, [settingsFlyoutConfig?.data]);

  return (
    <BaseFlyout
      open={settingsFlyoutConfig?.show}
      onClose={closeFlyout}
      width="465px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey('Notifications')}
      buttonLabel={getDictionaryValueOrKey('Download selected')}
      secondaryButtonLabel={getDictionaryValueOrKey('Clear all')}
      disabledButton={true}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      buttonsSection={buttonsSection}
    >
      {settingsFlyoutConfig?.data && (
        <SettingsContent
          labels={labels}
          settingsData={settingsFlyoutConfig.data}
          onChange={handleDataChange}
        />
      )}
    </BaseFlyout>
  );
};

export default SettingsFlyout;
