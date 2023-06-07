import React from "react";

export const dialogUI = {
    sx: {
        "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "461px",  // Set your width here
        },
    }
}

export const dialogContentUI = {
    sx: {
        p: "39px 31px 33px 31px",
        textAlign: "center",
        fontWeight: 400,
        fontSize: "20px",
        lineHeight: "30px",
    }
}

export const actionsUI = {
    sx: {
        alignItems: "center",
        justifyContent: "center",
        p: "0px 30px 33px 36px",
        "& button": {
            width: "197px",
            borderRadius: 0,
            textTransform: "none",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "16px",
            py: "16px",
        },
        "& .MuiButton-outlined": {
            border: 1,
            borderColor: "#005758",
            py: "15px",
        }
    }
}

export const continueButtonUI = {
    variant: "contained",
    disableElevation: true,
    sx: { 
        background: "#005758",
        color: "#FFFFFF",

        "&:hover": { 
            background: "#08BED5",
            color: "#262626",
        },
    },
}

export const cancelButtonUI = {
    variant: "outlined",
    sx: { 
        color: "#005758",
        "&:hover": { 
            background: "#08BED5",
            color: "#262626",
            border: 0,
            p: "16px",
        },
    },
}
