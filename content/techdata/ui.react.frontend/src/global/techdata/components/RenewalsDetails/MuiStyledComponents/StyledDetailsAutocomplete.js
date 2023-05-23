import { Autocomplete } from '@mui/material';
import { styled } from "@mui/material/styles";

export const StyledDetailsAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (prop) => prop !== "isTdBrand"
})(({ isTdBrand }) => ({
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']": {
      color: '#FFFFFF',//$white
      backgroundColor: `${isTdBrand ? '#000c21' : '#005758'}`//$brand-blue : $brand-green
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
    "& label.Mui-focused": {
      borderBottomColor: `${isTdBrand ? '#006FBA' : ''} !important`//$brand-cobalt
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: `${isTdBrand ? '#006FBA' : ''} !important`
    },
}));