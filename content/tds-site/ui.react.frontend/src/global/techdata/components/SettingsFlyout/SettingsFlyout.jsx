import React, { useEffect, useState } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';
import SettingsContent from './SettingsContent';
import { useStore } from '../../../../utils/useStore';
import { usPut } from '../../../../utils/api';
import { getProActiveMailAnalyticsGoogle, getProActiveNotificationAnalyticsGoogle, getProActiveSettingsActivactionAnalyticsGoogle, getProActiveTypesAnalyticsGoogle, pushDataLayerGoogle } from '../OrdersTrackingGrid/utils/analyticsUtils';

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
  settings,
}) => {
  const settingsFlyoutConfig = useOrderTrackingStore((st) => st.settingsFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [data, setData] = useState({});
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [dataCopy, setDataCopy] = useState({});
  const changeRefreshDetailApiState = useStore(
    (state) => state.changeRefreshDetailApiState
  );
  const pushGoogleDataProactiveMessaging = () => {
    const diff = Object.keys(dataCopy).filter(
      (key) => dataCopy[key] !== data[key]
    );
    diff.includes('active') &&
      pushDataLayerGoogle(
        getProActiveSettingsActivactionAnalyticsGoogle(data.active)
      );
    diff.includes('range') &&
      pushDataLayerGoogle(getProActiveNotificationAnalyticsGoogle(data.range));
    diff.includes('types') &&
      pushDataLayerGoogle(getProActiveTypesAnalyticsGoogle(data.types.join()));
    diff.includes('emailActive') &&
      pushDataLayerGoogle(
        getProActiveMailAnalyticsGoogle(data.emailActive, false)
      );
    diff.includes('additionalEmailActive') &&
      pushDataLayerGoogle(
        getProActiveMailAnalyticsGoogle(data.additionalEmailActive, true)
      );
  };

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: null, show: false },
    });
  };

  const openFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: settings, show: true },
    });
  };

  const handleDataChange = (key, value) => {
    setData((data) => ({ ...data, [key]: value }));
    if (
      !data.additionalEmailActive &&
      key === 'additionalEmail' &&
      value === ''
    ) {
      setData((data) => ({ ...data, emailActive: true }));
    }
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
    changeRefreshDetailApiState('settings');
    pushGoogleDataProactiveMessaging();
    closeFlyout();
  };

  const isDataModifiedAndValid = () => {
    if (_.isEmpty(data)) {
      return false;
    }
    if (!data.emailActive && !data.additionalEmailActive) {
      return false;
    }
    if (areSettingsIdentical(dataCopy, data)) {
      return false;
    }
    return true;
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
    if (!data.additionalEmailActive && data.additionalEmail === '') {
      setData((data) => ({ ...data, emailActive: true }));
    }
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
          settingsData={settings}
          onChange={handleDataChange}
        />
      )}
    </BaseFlyout>
  );
};

export default SettingsFlyout;
