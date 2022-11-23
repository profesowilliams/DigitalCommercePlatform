import React from "react";
import { PenIcon } from "../../../../fluentIcons/FluentIcons";
import { getDictionaryValue } from "../../../../utils/utils";
import IconButton from "../Widgets/IconButton";

function Edit({ handler, btnClass, disabled }) {
  const iconColor = disabled && "#D9D8D7";
  return (
    <IconButton btnClass={btnClass} icon={<PenIcon color={iconColor} />} onClick={handler} disabled={disabled}>
      { getDictionaryValue("techdata.buttons.label.edit", "Edit") }
    </IconButton>
  );
}

export default Edit;
