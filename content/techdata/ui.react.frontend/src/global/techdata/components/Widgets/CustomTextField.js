import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#727679",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#005758",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#003031",
  },
  "& .MuiFormLabel-asterisk.Mui-error": {
    color: "#003031",
  },
  "& .MuiInputLabel-root.Mui-error.Mui-focused": {
    color: "#727679",
  },
  "& .Mui-focused .MuiFormLabel-asterisk.Mui-error": {
    color: "#727679",
  },
  "& .MuiInput-input.css-1x51dt5-MuiInputBase-input-MuiInput-input" : {
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    color: '#262626',
  },
  "& .MuiInputLabel-root.css-1c2i806-MuiFormLabel-root-MuiInputLabel-root": {
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    color: '#727679',
  },
  "& .MuiInputLabel-asterisk.MuiFormLabel-asterisk": {
    position: 'relative',
    right: '4px',
  },
});
