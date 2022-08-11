import React from "react";
import { CloseRoundIcon, SaveIcon } from "../../../../fluentIcons/FluentIcons";
import IconButton from "../Widgets/IconButton";
import Pipe from "../Widgets/Pipe";

function CancelAndSave({ cancelHandler, saveHandler, customClass }) {
  return (
    <div className={`icon-button__container ${customClass || ""}`}>
      <IconButton icon={<CloseRoundIcon />} onClick={cancelHandler}>
        Cancel
      </IconButton>
      <Pipe />
      <IconButton icon={<SaveIcon />} onClick={saveHandler}>
        Save
      </IconButton>
    </div>
  );
}

export default CancelAndSave;
