import React from "react";
import { CloseRoundIcon, SaveIcon } from "../../../../fluentIcons/FluentIcons";
import { getDictionaryValue } from "../../../../utils/utils";
import IconButton from "../Widgets/IconButton";
import Pipe from "../Widgets/Pipe";

function CancelAndSave({ cancelHandler, saveHandler, customClass, btnClass, disabled }) {
  const iconColor = disabled && "#D9D8D7";
  return (
    <div className={`icon-button__container ${customClass || ""}`}>
      <IconButton btnClass={btnClass} icon={<CloseRoundIcon color={iconColor} />} onClick={cancelHandler} disabled={disabled}>
        { getDictionaryValue("button.common.label.cancel", "Cancel") }
      </IconButton>
      <Pipe />
      <IconButton btnClass={btnClass} icon={<SaveIcon color={iconColor} />} onClick={saveHandler} disabled={disabled}>
        { getDictionaryValue("button.common.label.save", "Save") }
      </IconButton>
    </div>
  );
}

export default CancelAndSave;
