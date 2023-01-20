import { useEffect } from "react";

const useOutsideClick = (ref, callback, eventName = 'click', dependencies = []) => {
  const handleClick = e => {
    if (ref.current && !ref.current?.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener(eventName, handleClick);

    return () => {
      document.removeEventListener(eventName, handleClick);
    };
  }, [...dependencies]);
};

export default useOutsideClick;