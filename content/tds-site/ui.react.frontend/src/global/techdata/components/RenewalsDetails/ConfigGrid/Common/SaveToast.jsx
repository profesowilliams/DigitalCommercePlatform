import React from "react";
import { Snackbar } from '@mui/material';
import {
    CheckmarkCircle,
    CautionIcon,
    CloseIcon,
} from '../../../../../../fluentIcons/FluentIcons';
import { teal } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';

const toastError = '#CD163F';
const toastSuccess = '#003031';

const closeIconStyle = {
    '&.MuiIconButton-root': {
        position: 'absolute',
        top: '14px',
        right: '14px',
    },
};

const ToastSuccess = () => {
    return (
        <span>
            <CheckmarkCircle
                fill={teal[800]}
                style={{ verticalAlign: 'bottom', marginRight: '16px' }}
            />
            Changes have been succesfully saved. YEI
        </span>
    );
};

const ToastError = () => {
    return (
        <div>
            <CautionIcon
                fill="#E02020"
                style={{ verticalAlign: 'bottom', marginRight: '16px' }}
            />
            Could not save changes. <br />
            <br />
            Please try again. If error persist please contact us at{' '}
            <a href="mailto:test@test.com">test@test.com</a>.
        </div>
    );
};

function SaveToast({
    isToastOpen,
    isToastSuccess,
    handleToastClose,
}) {
    const toastStyle = {
        '& .MuiSnackbarContent-root': {
            minHeight: '62px',
            minWidth: '437px',
            boxShadow: '0px 0px 15px rgb(0 0 0 / 5%)',
            borderRadius: '4px',
            background: '#ffffff',
            color: '#003031',
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '16px',
            borderLeft: `4px solid ${isToastSuccess ? toastSuccess : toastError}`,
            padding: '14px 18px',
        },
    };

    const action = (
        <IconButton
            sx={closeIconStyle}
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleToastClose}
        >
            <CloseIcon />
        </IconButton>
    );

    return (
        <Snackbar
            sx={toastStyle}
            open={isToastOpen}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            autoHideDuration={isToastSuccess ? 6000 : null}
            onClose={handleToastClose}
            message={isToastSuccess ? <ToastSuccess /> : <ToastError />}
            action={isToastSuccess ? null : action}
        />
    );
};

export default SaveToast;