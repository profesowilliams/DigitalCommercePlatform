import { useEffect, useState } from 'react';
const GAP = 7;

function usePositionBelowSubheader({ unmountedFn = false }, subheaderReference = null ) {

  const [positioning, setPositioning] = useState({ top: '', height: '' });

  function calculatePosition() {
    const subHeaderElement = !subheaderReference ? document.querySelector('.subheader > div > div') : subheaderReference;
    if (!subHeaderElement) return;
    const { top, height } = subHeaderElement.getBoundingClientRect();
    let topCalculation = top + GAP + height;
    
    if(topCalculation < 0) {
      topCalculation = 0;
    }

    return topCalculation;   
  }
  function updateStatePosition(){
    const topCalculation = calculatePosition();
    setPositioning({
        top: `${topCalculation}px`,
        height: `calc(100vh - ${topCalculation}px)`,
      });
  }
  useEffect(() => {
    const timer = setTimeout(updateStatePosition, 0);
    window.addEventListener('load', updateStatePosition);
    window.addEventListener('scroll', updateStatePosition);
    return () => {
      unmountedFn && unmountedFn();
      clearTimeout(timer);
      window.removeEventListener('scroll', updateStatePosition);
      window.removeEventListener('load', updateStatePosition);
    }
  }, []);
  return {positioning, calculatePosition}
}

export default usePositionBelowSubheader;
