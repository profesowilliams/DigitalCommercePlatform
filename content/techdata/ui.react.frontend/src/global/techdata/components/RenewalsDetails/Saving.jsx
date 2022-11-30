import React from "react";
import { LoaderIcon } from "../../../../fluentIcons/FluentIcons";
import { getDictionaryValue } from "../../../../utils/utils";
import IconButton from "../Widgets/IconButton";

export default function Saving({ customClass }) {
  return (
    <IconButton
      btnClass={customClass}
      icon={<LoaderIcon className="loader-rotate" />}
    >
      { getDictionaryValue("button.common.label.saving", "Saving") }
    </IconButton>
  );
}
