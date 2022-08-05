import React from "react";
import { PenIcon } from "../../../../fluentIcons/FluentIcons";
import IconButton from "../Widgets/IconButton";

function Edit({ handler }) {
  return (
    <IconButton icon={<PenIcon />} onClick={handler}>
      Edit
    </IconButton>
  );
}

export default Edit;
