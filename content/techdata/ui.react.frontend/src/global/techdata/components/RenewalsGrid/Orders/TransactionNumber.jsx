import React, { useState } from 'react'
import { Menu, MenuItem } from "@mui/material";

function TransactionNumber({data}) {
    const [contextMenu, setContextMenu] = useState(null);
    const handleContextMenu = (e) => {
      e.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
            mouseX: e.clientX,
            mouseY: e.clientY,
          }
          : null
      )
    }
  
    const handleCopy = async (data) => {
      try {
        await navigator.clipboard.writeText(data);
        handleClose();
      } catch (err) {
        console.error('Failed to copy to clipboard: ', err);
      }
    }
  
    const handleClose = () => {
      setContextMenu(null);
    }
  
    return <>
      <b onClick={handleContextMenu}>Transaction number : {data}</b>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleCopy(data)}>Copy</MenuItem>
      </Menu> 
    </>;
  }
  

export default TransactionNumber