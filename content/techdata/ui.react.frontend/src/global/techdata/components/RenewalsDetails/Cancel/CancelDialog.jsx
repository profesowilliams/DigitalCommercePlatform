import React from "react";
import { 
    Dialog, 
    Button,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { 
    dialogUI,
    dialogContentUI,
    actionsUI,
    continueButtonUI, 
    cancelButtonUI, 
} from "./CancelDialogMaterialUI";

function CancelDialog({ isDialogOpen, onClose, labels }) {
    const {
        cancelButtonLabel,
        cancelDialogContent,
        continueButtonLabel,
    } = labels;

    const handleClose = () => onClose();
    const handleReset = () => onClose(true);

    return (
        <Dialog
            open={isDialogOpen}
            onClose={handleClose}
            {...dialogUI}
        >
            <DialogContent {...dialogContentUI}>
                {cancelDialogContent}
            </DialogContent>
            <DialogActions {...actionsUI}>
                <Button autoFocus onClick={handleReset} {...cancelButtonUI}>{cancelButtonLabel}</Button>
                <Button onClick={handleClose} {...continueButtonUI}>{continueButtonLabel}</Button>
            </DialogActions>
        </Dialog>
    );
  }
  
  export default CancelDialog;
  