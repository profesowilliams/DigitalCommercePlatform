import React from "react";
import Button from "./Button";

export default function IconButton({ icon, onClick, children, btnClass }) {
  return (
    <div className={`icon-button ${btnClass || ""}`} onClick={onClick}>
      {icon}
      <Button btnClass={"icon-button__default"}>{children}</Button>
    </div>
  );
}
