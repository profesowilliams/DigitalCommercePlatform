import React from "react";
import { PenIcon } from "../../../../fluentIcons/FluentIcons";
import IconButton from "../Widgets/IconButton";

function Edit({ handler, btnClass }) {
  return (
    <IconButton btnClass={btnClass} icon={<PenIcon />} onClick={handler}>
      Edit
    </IconButton>
  );
}

export default Edit;
