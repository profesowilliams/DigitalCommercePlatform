import React from "react";
import { If } from "../../../../helpers/If";
import Edit from "../../Edit";
import CancelAndSave from "../../CancelAndSave";

function EditFlow({
  disabled,
  editValue,
  setEdit,
  saveHandler,
}) {
  const handleIconEditClick = () => {
    setEdit(true);
  };

  const handleIconCancelClick = () => {
    setEdit(false);
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
          customClass="cancel-save__absolute"
          cancelHandler={handleIconCancelClick}
          saveHandler={handleIconSaveClick}
          btnClass="underlined_hover"
        />
      }
    />
  );
};

export default EditFlow;