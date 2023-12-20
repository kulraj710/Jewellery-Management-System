// TextArea.js
import React from 'react';
import TextField from '@mui/material/TextField';

const TextArea = ({ label, onChange, value }) => {
  return (
    <TextField
      multiline
      rows={4}
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      InputProps={{ disableUnderline: true }}
    />
  );
};

export default TextArea;
