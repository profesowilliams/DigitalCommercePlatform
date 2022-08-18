import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#727679",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#005758",
  },
});
