import React, {useState, useRef} from 'react';
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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00b4d8',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border : 'none !important'
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

export default function InvoiceTableMui({rows}) {

  const [openViewMode, setOpenViewMode] = useState(false)

  const printRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      const b = document.getElementById("invoice-img")
      b.style.display = 'none'
    },
    onAfterPrint: () => {
      const b = document.getElementById("invoice-img")
      b.style.display = ''
    }
  })
  const handleCopy = useReactToPrint({
    content: () => printRef.current
  })

  return (
    <TableContainer component={Paper} style={{width : '80%', margin : '3rem auto', }}>
      {/* <ViewInvoiceDialog open={openViewMode} setOpen={setOpenViewMode} data={rows} printRef={printRef}/> */}
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
          {rows.map((row) => (
            <>
            <ViewInvoiceDialog key={row.invoiceNo} open={openViewMode} setOpen={setOpenViewMode} data={row} printRef={printRef}/>
            <StyledTableRow key={row.invoiceNo}>
              <StyledTableCell component="th" scope="row">
                {row.invoiceNo}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{format(row.invoiceDate.toDate(), "dd-MM-yyyy")}</StyledTableCell>
              <StyledTableCell align="right">{row.totalAmt}</StyledTableCell>
              <StyledTableCell align="right">{row.payment}</StyledTableCell>
              <StyledTableCell align="right">{row.totalAmt - row.payment}</StyledTableCell>
              <StyledTableCell align="right"><Button onClick={() => setOpenViewMode(true)}>View</Button></StyledTableCell>
              <StyledTableCell align="right"><IconButton onClick={handlePrint}><PrintIcon/></IconButton></StyledTableCell>
              <StyledTableCell align="right"><IconButton onClick={handleCopy}><FileCopyOutlinedIcon /></IconButton></StyledTableCell>
            </StyledTableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}