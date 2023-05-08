import React, { Fragment } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { styled } from '@mui/material/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons'


export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#242b35',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: '#475569',
    color: theme.palette.common.white,
    borderBottom: '1',
    borderColor: '#242b35'
  }
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const blankRow = (
  <Fragment>
    <StyledTableCell>
      No Data 
    </StyledTableCell>
    <StyledTableCell><FontAwesomeIcon icon={faHeartBroken} /></StyledTableCell>
    <StyledTableCell><FontAwesomeIcon icon={faHeartBroken} /></StyledTableCell>
    <StyledTableCell><FontAwesomeIcon icon={faHeartBroken} /></StyledTableCell>
  </Fragment>
)

export function HyRow({ row, mainRow, subLabel, subHeader, subBody } ) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {subLabel && (<StyledTableCell sx={{width: '75px'}}>
          <IconButton sx={{color: 'white', disabled: row.groups.length > 0}} aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>)}
        {mainRow(row)}
      </StyledTableRow>
      {subLabel && (<StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {subLabel}
              </Typography>
              <Table size="small">
                <TableHead>
                  {subHeader}
                </TableHead>
                <TableBody>
                  {subBody(row)}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>)}
    </React.Fragment>
  )
}

export default function HyTable({ dataList, header, body }) {
  return (
    <TableContainer component={Paper} sx={{backgroundColor: '#455468'}}>
      <Table aria-label="collapsible table">
        <TableHead>
          {header}
        </TableHead>
        <TableBody>
          {dataList.length > 0 && body}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
