import React from "react";
import Button from "./Button";

export default function IconButton({ icon, onClick, children, btnClass, disabled }) {
  const onClickHandler = (e) => {
    if (!disabled)
      onClick(e);
  };

  return (
    <div className={`icon-button ${btnClass || ""} ${disabled ? "disabled" : ""}`} onClick={onClickHandler}>
      {icon}
      <Button btnClass={"icon-button__default"} disabled={disabled}>{children}</Button>
    </div>
  );
}
