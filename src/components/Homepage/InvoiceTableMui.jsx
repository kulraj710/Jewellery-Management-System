import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import PrintIcon from '@mui/icons-material/Print';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import ViewInvoiceDialog from './ViewInvoiceDialog';
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00b4d8',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 'none !important'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function InvoiceTableMui({ rows }) {

  
  const printRef = Array.from({ length: rows.length }, () => useRef());

  const [openViewModes, setOpenViewModes] = useState(Array(rows.length).fill(false))


  const handleRowView = (index) => {
    console.log('clicked on ' + index)
    const updatedModes = [...openViewModes]
    updatedModes[index] = true
    setOpenViewModes(updatedModes)
  }

  return (
    <TableContainer component={Paper} style={{ width: '80%', margin: '3rem auto', }}>
      <div>
        {openViewModes.map((r, index) => (
          <ViewInvoiceDialog
            key={index}
            open={r}
            setOpen={() => {
              const updatedModes = [...openViewModes]
              updatedModes[index] = false
              setOpenViewModes(updatedModes)
            }}
            data={rows[index]}
            printRef={printRef[index]}
          />
        ))}
      </div>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>No.</StyledTableCell>
            <StyledTableCell align="right">Customer Name</StyledTableCell>
            <StyledTableCell align="right">date</StyledTableCell>
            <StyledTableCell align="right">Total Amount</StyledTableCell>
            <StyledTableCell align="right">Advance</StyledTableCell>
            <StyledTableCell align="right">Outstanding</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
            <StyledTableCell align="right">Print</StyledTableCell>
            <StyledTableCell align="right">Copy</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={row.invoiceDate}>
              <StyledTableCell component="th" scope="row">
                {row.invoiceNo}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{format(row.invoiceDate.toDate(), "dd-MM-yyyy")}</StyledTableCell>
              <StyledTableCell align="right">{row.totalAmt}</StyledTableCell>
              <StyledTableCell align="right">{row.payment}</StyledTableCell>
              <StyledTableCell align="right">{row.totalAmt - row.payment}</StyledTableCell>
              <StyledTableCell align="right"><Button onClick={() => handleRowView(index)}>View</Button></StyledTableCell>

              <StyledTableCell align="right">
                <ReactToPrint
                  trigger={() => (
                    <IconButton><PrintIcon /></IconButton>
                  )}

                  content={() => printRef[index].current}
                  onBeforeGetContent={() => {
                    const b = document.getElementById("invoice-img")
                    b.style.display = 'none'
                  }}
                  onAfterPrint={() => {
                    const b = document.getElementById("invoice-img")
                    b.style.display = 'block'
                  }}
                />
              </StyledTableCell>

              <StyledTableCell align="right">
              <ReactToPrint
                  trigger={() => (
                    <IconButton><FileCopyOutlinedIcon /></IconButton>
                  )}
                  content={() => printRef[index].current}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}