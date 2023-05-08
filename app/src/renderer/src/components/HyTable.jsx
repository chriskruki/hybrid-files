import React from 'react'
import PropTypes from 'prop-types'
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
import RowDropdown from './RowDropdown'

const DarkTableOld = ({ headers, list, dropdownElems }) => {
  const actionHeader = [...headers, 'Action']
  const headerClasses = [...headers.map((v) => ''), 'w-[60px]']
  return (
    <table className="min-w-full divide-y divide-gray-700 table-auto overflow-auto">
      <thead className="bg-gray-800">
        <tr>
          {actionHeader.map((header, idx) => (
            <th
              key={header}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${headerClasses[idx]}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gray-700 divide-y divide-gray-700 align-top odd:bg-slate-500">
        {list.length ? (
          list.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((value, index) => {
                var displayVal = value
                // console.log(typeof value)
                // if (typeof value === Date) {
                //     displayVal = new Date(value.toISOString())
                // }
                return (
                  <td key={`${idx}-${index}`} className={`px-6 py-4 w-fit`}>
                    <div className="text-sm text-gray-300 border-sky-700 border rounded p-2">{`${displayVal}`}</div>
                  </td>
                )
              })}
              <td className="px-6 py-4 whitespace-nowrap w-fit">
                <RowDropdown rowInfo={item}>{dropdownElems}</RowDropdown>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>No data fetched</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

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


export function HyRow({ row, mainRow, subLabel, subHeader, subBody } ) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton sx={{color: 'white', disabled: row.groups.length > 0}} aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        {mainRow(row)}
      </StyledTableRow>
      <StyledTableRow>
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
      </StyledTableRow>
    </React.Fragment>
  )
}

// HyRow.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired
//   }).isRequired
// }


export default function HyTable({ header, body }) {
  return (
    <TableContainer component={Paper} sx={{backgroundColor: '#455468'}}>
      <Table aria-label="collapsible table">
        <TableHead>
          {header}
          {/* <StyledTableRow>
            <StyledTableCell />
            <StyledTableCell>Dessert (100g serving)</StyledTableCell>
            <StyledTableCell align="right">Calories</StyledTableCell>
            <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
          </StyledTableRow> */}
        </TableHead>
        <TableBody>
          {body}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
