import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function PlaceOrderDialog({ onClose, open, buttonSection }) {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiPaper-root.MuiDialog-paper': {
          position: 'absolute',
          bottom: 0,
          right: 0,
          margin: 0,
          height: '373px',
          width: '948px',
          maxWidth: '948px',
        },
      }}
    >
      <DialogTitle>Place order</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          To complete placing your order for{' '}
          <strong>Avenir Global Cherry Advertising LTD</strong> please provide
          the following information.
        </Typography>

        <TextField
          id="standard-helperText"
          //   label="Purchase order number"
          placeholder="Purchase order number"
          helperText="Max 25 characters"
          variant="standard"
        />

        <FormControlLabel
          control={<Checkbox />}
          label="I confirm I am authorized by Adobe to purchase and sell Education licenses. Should my account no longer be authorized I agree that my order will be cancelled by Tech Data."
        />

        <FormControlLabel
          control={<Checkbox />}
          label={
            <Typography>
              I have read and accept the{' '}
              <Link href="#" underline="always">
                TechData Terms & Conditions
              </Link>
              , applicable{' '}
              <Link href="#" underline="always">
                Country Specific Terms
              </Link>
              & the{' '}
              <Link href="#" underline="always">
                Adobe Terms & Conditions
              </Link>
              .
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions>{buttonSection}</DialogActions>
    </Dialog>
  );
}

export default PlaceOrderDialog;
