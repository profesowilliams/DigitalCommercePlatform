import React from "react";
import { CloseRoundIcon, SaveIcon } from "../../../../fluentIcons/FluentIcons";
import IconButton from "../Widgets/IconButton";
import Pipe from "../Widgets/Pipe";

function CancelAndSave({ cancelHandler, saveHandler, customClass, btnClass, disabled }) {
  const iconColor = disabled && "#D9D8D7";
  return (
    <div className={`icon-button__container ${customClass || ""}`}>
      <IconButton btnClass={btnClass} icon={<CloseRoundIcon color={iconColor} />} onClick={cancelHandler} disabled={disabled}>
        Cancel
      </IconButton>
      <Pipe />
      <IconButton btnClass={btnClass} icon={<SaveIcon color={iconColor} />} onClick={saveHandler} disabled={disabled}>
        Save
      </IconButton>
    </div>
  );
}

export default CancelAndSave;
