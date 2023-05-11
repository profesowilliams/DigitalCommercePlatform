import { Autocomplete } from '@mui/material';
import { styled } from "@mui/material/styles";

export const StyledDetailsAutocomplete = styled(Autocomplete)({
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']": {
      color: '#FFFFFF',
      backgroundColor: '#005758',//computeBrandColor
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'].Mui-focused": {
      color: '#FFFFFF',
      backgroundColor: '#005758',
    },

    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'] div div label": {
      color: '#FFFFFF',
      backgroundColor: '#005758',//computeBrandColor
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true'].Mui-focused div div label": {
      color: '#FFFFFF',
      backgroundColor: '#005758',
    },
    
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='false']": {
      //color: '$brand-cool-gray-10',
      color: '#63666A',
      backgroundColor: '#FFFFFF',
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='false'].Mui-focused": {
      //color: '#63666A',
      backgroundColor: '#FFFFFF',
    },
});