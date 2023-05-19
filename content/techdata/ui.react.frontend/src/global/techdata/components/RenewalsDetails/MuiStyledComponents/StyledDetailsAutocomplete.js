import { Autocomplete } from '@mui/material';
import { styled } from "@mui/material/styles";

export const StyledDetailsAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (prop) => prop !== "isTdBrand"
})(({ isTdBrand }) => ({
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']": {
      color: '#FFFFFF',
      backgroundColor: `${isTdBrand ? '#000c21' : '#005758'}`
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'].Mui-focused": {
      color: '#FFFFFF',
      backgroundColor: `${isTdBrand ? '#000c21' : '#005758'}`
    },   
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'] div div label": {
      color: '#FFFFFF',
      backgroundColor: `${isTdBrand ? '#000c21' : '#005758'}`
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'].Mui-focused div div label": {
      color: '#FFFFFF',
      backgroundColor: `${isTdBrand ? '#000c21' : '#005758'}`
    },     
}));