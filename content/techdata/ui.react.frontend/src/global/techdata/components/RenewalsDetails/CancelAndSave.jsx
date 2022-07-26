import React from "react";
import { CloseRoundIcon, SaveIcon } from "../../../../fluentIcons/fluentIcons";
import IconButton from "../Widgets/IconButton";
import Pipe from "../Widgets/Pipe";

function CancelAndSave({ cancelHandler, saveHandler }) {
  return (
    <div className="icon-button__container">
      <IconButton icon={<CloseRoundIcon fill="#005758" />} onClick={cancelHandler}>
        Cancel
      </IconButton>
      <Pipe />
      <IconButton icon={<SaveIcon fill="#005758" />} onClick={saveHandler}>
        Save
      </IconButton>
    </div>
  );
}

export default CancelAndSave;
