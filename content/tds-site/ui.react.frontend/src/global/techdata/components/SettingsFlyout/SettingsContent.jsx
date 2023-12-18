import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import CollapsibleSection from './CollapsibleSection';
import MessagesForm from './MessagesForm';
import TypesForm from './TypesForm';
import EmailsForm from './EmailsForm';
import CustomSwitch from './CustomSwitch';

const SettingsContent = ({ labels, settingsData, onChange }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(settingsData.active);

  const handleSwitchChange = () => {
    setIsSwitchOn((prevState) => {
      onChange('active', !prevState);
      return !prevState;
    });
  };

  const messageOptions = [
    { key: 'Intouch', label: getDictionaryValueOrKey(labels.rangeIntouchOnly) },
    ...(settingsData.rangeAllEnabled
      ? [{ key: 'All', label: getDictionaryValueOrKey(labels.rangeTdSynnex) }]
      : []),
  ];

  const typeOptions = [
    {
      key: 'TDPACK',
      label: getDictionaryValueOrKey(labels.shippedFromTDSWarehouse),
    },
    { key: 'OFD', label: getDictionaryValueOrKey(labels.outForDelivery) },
    { key: 'DELIVERED', label: getDictionaryValueOrKey(labels.delivered) },
    {
      key: 'EXCEPTION',
      label: getDictionaryValueOrKey(labels.deliveryException),
    },
  ];

  const emailOptions = [
    { key: 'email', label: settingsData.destination.email },
    { key: 'additionalEmail', label: settingsData.destination.additionalEmail },
  ];

  const {
    emailActive,
    additionalEmailActive,
    destination: { email, additionalEmail },
    range,
    types,
  } = settingsData;

  const collapsibleSections = [
    {
      title: getDictionaryValueOrKey(labels.notificationMessages),
      content: (
        <MessagesForm
          value={range}
          onChange={(value) => onChange('range', value)}
          options={messageOptions}
        />
      ),
      expanded: true,
    },
    {
      title: getDictionaryValueOrKey(labels.notificationTypes),
      content: (
        <TypesForm
          value={types}
          onChange={(value) => onChange('types', value)}
          options={typeOptions}
        />
      ),
      expanded: true,
    },
    {
      title: getDictionaryValueOrKey(labels.notificationEmails),
      content: (
        <EmailsForm
          value={{
            emailActive,
            additionalEmailActive,
            email,
            additionalEmail,
          }}
          options={emailOptions}
          labels={labels}
          onChange={onChange}
        />
      ),
      expanded: true,
    },
  ];

  return (
    <section className="cmp-flyout__content settings">
      <div className="switch-wrapper">
        <p className="switch-label">
          {getDictionaryValueOrKey(labels?.switchLabel)}
        </p>
        <div className="switch-icon-wrapper">
          <CustomSwitch checked={isSwitchOn} onChange={handleSwitchChange} />
        </div>
      </div>
      {isSwitchOn && (
        <div className="collapsible-sections-wrapper">
          {collapsibleSections.map((section, index) => (
            <CollapsibleSection
              title={section.title}
              content={section.content}
              expanded={section.expanded}
              key={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SettingsContent;
