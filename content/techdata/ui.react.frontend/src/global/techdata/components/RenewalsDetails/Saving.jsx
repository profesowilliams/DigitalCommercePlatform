import React from "react";
import { LoaderIcon } from "../../../../fluentIcons/fluentIcons";
import IconButton from "../Widgets/IconButton";

export default function Saving() {
  return <IconButton icon={<LoaderIcon className="loader-rotate" />}>Saving</IconButton>;
}
