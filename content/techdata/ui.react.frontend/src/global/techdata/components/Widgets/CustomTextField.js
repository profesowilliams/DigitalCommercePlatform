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
});
