import React from "react";
import { If } from "../../../../helpers/If";
import Edit from "../../Edit";
import CancelAndSave from "../../CancelAndSave";

function EditFlow({
  disabled,
  editValue,
  setEdit,
  saveHandler,
  cancelHandler,
  customClass,
}) {
  const handleIconEditClick = () => {
    setEdit(true);
  };

  const handleIconCancelClick = () => {
    setEdit(false);
    cancelHandler();
  };

  const handleIconSaveClick = () => {
    saveHandler();
  };

  return (
    <If
      condition={!editValue}
      Then={
        <Edit btnClass="icon-button__reseller underlined_hover" handler={handleIconEditClick} disabled={disabled} />
      }
      Else={
        <CancelAndSave
          disabled={disabled}
          customClass={customClass}
          cancelHandler={handleIconCancelClick}
          saveHandler={handleIconSaveClick}
          btnClass="underlined_hover"
        />
      }
    />
  );
};

export default EditFlow;