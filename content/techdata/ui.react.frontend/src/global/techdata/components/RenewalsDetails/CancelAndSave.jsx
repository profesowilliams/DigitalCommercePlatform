import React from "react";
import { CloseRoundIcon, SaveIcon } from "../../../../fluentIcons/FluentIcons";
import IconButton from "../Widgets/IconButton";
import Pipe from "../Widgets/Pipe";

function CancelAndSave({ cancelHandler, saveHandler, customClass, btnClass }) {
  return (
    <div className={`icon-button__container ${customClass || ""}`}>
      <IconButton btnClass={btnClass} icon={<CloseRoundIcon />} onClick={cancelHandler}>
        Cancel
      </IconButton>
      <Pipe />
      <IconButton btnClass={btnClass} icon={<SaveIcon />} onClick={saveHandler}>
        Save
      </IconButton>
    </div>
  );
}

export default CancelAndSave;
