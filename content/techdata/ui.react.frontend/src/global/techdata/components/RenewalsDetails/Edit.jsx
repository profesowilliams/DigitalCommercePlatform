import React from "react";
import { PenIcon } from "../../../../fluentIcons/fluentIcons";
import IconButton from "../Widgets/IconButton";

function Edit({ handler }) {
  return (
    <IconButton icon={<PenIcon stroke="#005758" />} onClick={handler}>
      Edit
    </IconButton>
  );
}

export default Edit;
