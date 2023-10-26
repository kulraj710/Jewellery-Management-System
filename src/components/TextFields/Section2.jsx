import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Section2({sec2, setSec2}) {

  const handleChange = (event) => {
    setSec2({invoiceType: event.target.value});
  };

  return (
    <Box sx={{ minWidth: 220 }} style={{padding : '1rem 1rem 1rem 0rem'}}>
      <FormControl style={{width : '200px'}}>
        <InputLabel id="demo-simple-select-label">Invoice Type</InputLabel>
        <Select
          value={sec2.invoiceType}
          label="Invoice Type"
          onChange={handleChange}
        >
          <MenuItem value={"Gold Tax Invoice"}>Gold Tax Invoice</MenuItem>
          <MenuItem value={"Silver Tax Invoice"}>Silver Tax Invoice</MenuItem>
          <MenuItem value={"Tax Invoice"}>Tax Invoice</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}