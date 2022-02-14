import React, { useState } from "react";
import { QUOTE_PREVIEW_AVT_TYPE_VALUE, QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE } from "../../../../utils/constants";

const ModalQuoteCreateModal = ({
    setModal,
    setSystemInfoDone,
    createQuote,
    quoteDetails,
    isStandarPrice,
    urlQuotesGrid,
    modalConfig,
  }) => {
  const [techData, setTechData] = useState(false);
  const [buyMethod, setBuyMethod] = useState('');
  const [avg, setAVG] = useState(false);
  const AVG_VALUE = modalConfig?.avgValue ? 
    modalConfig.avgValue : 'AVT';
  const TECH_DATA_VALUE = modalConfig?.techDataValue ? 
    modalConfig.techDataValue : 'Tech Data';
  const TITLE = modalConfig?.title ? 
    modalConfig.title : 'Please verify you the buy method  you set  in CISCOs system below';
  
    /**
   * 
   * @param {string} type 
   */
  const handleToggle = (type) => {
    if (type === AVG_VALUE) {
      setAVG(true)
      setTechData(false)
      setBuyMethod(QUOTE_PREVIEW_AVT_TYPE_VALUE);
    } else {
      setTechData(true)
      setAVG(false)
      setBuyMethod(QUOTE_PREVIEW_TECH_DATA_TYPE_VALUE);
    }
  };

  const veryfyBuyMethodAction = async () => {
    setSystemInfoDone(true);
    if (isStandarPrice) {
      setModal(null);
        createQuote(quoteDetails, buyMethod).then(res => window.location = urlQuotesGrid);
    } else {
        setModal(null);
        await createQuote(quoteDetails, buyMethod, setModal);
    }
  };
  
  const cancelAction = () => {
    setModal(null);
  }
  

  return (
    <section className='cmp-quote-create__container'>
      <div className='cmp-quote-create__title'>
        <strong>
          {TITLE}
        </strong>
      </div>

      <div className='cmp-quote-create__subtitle'>
        <div>
          {AVG_VALUE}
        </div>
        <div>
          {TECH_DATA_VALUE}
        </div>
      </div>
      <div className='cmp-quote-create__checkbox'>
        <div className="__container">
            <label>
                <input type="checkbox" onClick={() => handleToggle(AVG_VALUE)} id={'a'} checked={avg} />
                <span className="checkbox"></span>
            </label>
        </div>
        <div className="">
            <label>
                <input type="checkbox" onClick={() => handleToggle(TECH_DATA_VALUE)} id={'b'} checked={techData} />
                <span className="checkbox"></span>
            </label>
        </div>
      </div>
      <div className="cmp-quote-create__button-container">
        <button onClick={async () => await veryfyBuyMethodAction()} disabled={techData || avg ? false : true } className="cmp-quote-create__button">
          Verify Buy Method
        </button>
        <button onClick={cancelAction}>
          <p className="cmp-quote-create__button-cancel">Cancel and close</p>
        </button>
      </div>
    </section>
  );
}

export default ModalQuoteCreateModal;