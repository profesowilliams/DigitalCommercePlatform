import React from "react";
import { 
    Dialog, 
    Button,
    DialogContent,
    DialogActions,
    DialogTitle,
} from "@mui/material";
import { 
    dialogUI,
    dialogContentUI,
    actionsUI,
    continueButtonUI, 
    cancelButtonUI, 
} from "./CancelDialogMaterialUI";
import { getDictionaryValue } from "../../../../../utils/utils";

function CancelDialog({ isDialogOpen, onClose, labels = {}}) {
    const {
        cancelDialogTitle = "",
        cancelDialogDescription = "",
    } = labels;

    const cancelDialogNo = getDictionaryValue("techdata.buttons.label.cancelDialogNo", "No, continue editing");
    const cancelDialogYes = getDictionaryValue("techdata.buttons.label.cancelDialogYes", "Yes, cancel");

    const handleClose = () => onClose();
    const handleReset = () => onClose(true);

    return (
        <Dialog
            open={isDialogOpen}
            onClose={handleClose}
            {...dialogUI}
        >
            <DialogTitle>
                {cancelDialogTitle}
            </DialogTitle>
            <DialogContent {...dialogContentUI}>
                {cancelDialogDescription}
            </DialogContent>
            <DialogActions {...actionsUI}>
                <Button autoFocus onClick={handleReset} {...cancelButtonUI}>{cancelDialogYes}</Button>
                <Button onClick={handleClose} {...continueButtonUI}>{cancelDialogNo}</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
  export default CancelDialog;
  