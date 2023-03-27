import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ChevronDownIcon } from '../../../../../fluentIcons/FluentIcons';
import { ReportIcon } from '../../../../../fluentIcons/FluentIcons'
import ReportDropdown from './ReportDropdown';
import "../../../../../../src/styles/TopIconsBar.scss"

function Report({ options, selectOption, selectedKey }, ref) {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(selectedKey);
  const wrapperRef = useRef(null);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropDownOpen);
  };

  const handleSelectOption = (option) => {
    setCurrentValue(option.key);
    selectOption(option);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useImperativeHandle(
    ref,
    () => {
      return { value: currentValue };
    },
    [currentValue]
  );

  return (
    <div
      onClick={handleDropdownClick}
      className="cmp-order-tracking-grid__report"
    >
      <ReportIcon fill="#262626" className="icon-hover"/>
      {isDropDownOpen && (
        <ReportDropdown
          ref={wrapperRef}
          reportOptions={options}
          selectOption={handleSelectOption}
        />
      )}
    </div>
  );
}

export default forwardRef(Report);
