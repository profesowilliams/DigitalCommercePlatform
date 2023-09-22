import React, { useEffect, useState } from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import LineItem from './LineItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { usGet } from '../../../../../utils/api';

const styleOverrideFormControlLabel = {
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
  '& .MuiTypography-root': {
    fontSize: '16px!important',
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

function ProductReplacementFlyout({
  subheaderReference = '',
  isTDSynnex = true,
  labels = {},
  config = {},
}) {
  const [selected, setSelected] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [productDtos, setProductDtos] = useState([]);
  const store = useOrderTrackingStore;
  const productReplacementConfig = store((st) => st.productReplacementFlyout);

  const { setCustomState } = store((st) => st.effects);
  const closeFlyout = () => {
    setCustomState({
      key: 'productReplacementFlyout',
      value: { show: false },
    });
  };

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const handleUpdate = () => {};

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button disabled={isDisabled} className="primary" onClick={handleUpdate}>
        {getDictionaryValueOrKey(labels.update)}
      </button>
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels.cancel)}
      </button>
    </div>
  );

  const options = [
    ...[
      ...productDtos.map((product) => ({
        key: 'replaceWithSuggestedItem',
        label: getDictionaryValueOrKey(labels.replaceWithSuggestedItem),
        content: (
          <LineItem
            item={{
              ...productReplacementConfig?.data?.line,
              urlProductImage: product.images.default.url,
              displayName: product.description,
              mfrNumber: product.manufacturerPartNumber,
              unitCost: product.price.bestPrice,
              unitPriceCurrency: product.price.currency,
              lineTotal: product.price.bestPrice,
            }}
            labels={labels}
          />
        ),
      })),
    ],
    //   {  // TODO add this option after MVP
    //     key: 'replaceWithNewItem',
    //     label: 'Replace with a new item from the catalog.',
    //   },
    {
      key: 'removeWithoutReplacement',
      label: getDictionaryValueOrKey(labels.removeWithoutReplacement),
      content: null,
    },
  ];

  useEffect(async () => {
    if (productReplacementConfig?.data?.line?.tdNumber) {
      try {
        const result = await usGet(`${config.replaceProductEndpoint}`);
        setProductDtos(result?.data?.content?.productDtos || []);
      } catch (error) {
        console.error(error);
      }
    }
  }, [productReplacementConfig?.data?.line]);

  return (
    <BaseFlyout
      open={productReplacementConfig?.show}
      onClose={closeFlyout}
      width="929px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(labels.modifyOrder)}
      disabledButton={isDisabled}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      onClickButton={null}
      bottomContent={null}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content replacement">
        <LineItem
          item={productReplacementConfig?.data?.line}
          labels={labels}
          toBeReplacedItem={true}
        />
        <p className="replacement-text">
          {getDictionaryValueOrKey(labels.pleaseSelect)}
        </p>
        <div className="replacement-list">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={selected}
              onChange={handleSelectChange}
            >
              {options?.map((option) => (
                <div key={option.key}>
                  <FormControlLabel
                    sx={styleOverrideFormControlLabel}
                    key={option.key}
                    value={option.key}
                    control={<Radio sx={styleOverrideRadio} />}
                    label={option.label}
                  />
                  {option.content}
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </section>
    </BaseFlyout>
  );
}

export default ProductReplacementFlyout;
