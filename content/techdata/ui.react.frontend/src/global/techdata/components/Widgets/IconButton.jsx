import React from "react";
import Button from "./Button";

export default function IconButton({ icon, onClick, children }) {
  return (
    <div className="icon-button" onClick={onClick}>
      {icon}
      <Button btnClass={"icon-button__default"}>{children}</Button>
    </div>
  );
}
